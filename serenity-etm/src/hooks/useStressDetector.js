'use client';

import { useEffect, useRef, useState } from "react";
import useStore from "@/store/useStore";

const LICENSE_KEY = '';

const MIN_INTERVAL_MS = 1 * 60 * 1000; // 1min
const MAX_INTERVAL_MS = 5 * 60 * 1000; // 5min
const TRANSITION_MS = 500; // 5ms
const FOCUS_DURATION_MS = 15 * 60 * 1000; // 15mins

export default function useStressDetector() {
    const sdkActive = useStore((state) => state.sdkActive);
    const focusLockRef = useRef(false);
    const focusTimerRef = useRef(null);

    const setStress = useStore((state) => state.setEmotionValue);
    const prevStressRef = useRef(0);
    const targetStressRef = useRef(0);
    const animationRef = useRef(null);
    const timeoutRef = useRef(null);

    const latestSignalsRef = useRef({
        arousal: 0,
        valence: 0,
        attention: 0,
        emotionBias: 0,
    });

    const stopSDKRef = useRef(null);
    const sdkActiveRef = useState(sdkActive);

    useEffect(() => {
        sdkActiveRef.current = sdkActive;
    }, [sdkActive]);

    useEffect(() => {

        if (!sdkActive) {
            if(stopSDKRef.current) stopSDKRef.current();
            cancelAnimationFrame(animationRef.current);
            clearTimeout(timeoutRef.current);
            clearTimeout(focusTimerRef.current);
            return;
        }

        if(window.__morphcastInitialized) return;
        window.__morphcastInitialized = true;

        let CYInstance;
        let stopSDK = null;

        const initSDK = async () => {
            try {
                // wait for CY
                const CY = await new Promise((resolve, reject) => {
                    let tries = 0;
                    const check = setInterval(() => {
                        tries++;
                        if (window.CY && window.CY.loader) {
                            clearInterval(check);
                            resolve(window.CY);
                        } else if (tries > 40) {
                            clearInterval(check);
                            reject('MorphCast SDK not found');
                        }
                    }, 250);
                });

                CYInstance = CY;

                const loader = await CY.loader()
                    .licenseKey(LICENSE_KEY)
                    .addModule(CY.modules().FACE_AROUSAL_VALENCE.name, { smoothness: 0.7 })
                    .addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.4 })
                    .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.8 })
                    .load();

                    const { start, stop } = loader;
                    stopSDK = stop;

                    const emotionEvent = CY.modules().FACE_EMOTION.eventName;
                    const arousalEvent = CY.modules().FACE_AROUSAL_VALENCE.eventName;

                    const calculateStress = () => {
                        const { arousal, valence, attention, emotionBias } = latestSignalsRef.current;

                        let baseStress = arousal * (1 - valence);
                        baseStress *= 0.7 + attention * 0.6;

                        let combinedStress = baseStress * 0.55 + emotionBias * 0.45;
                        combinedStress = Math.pow(combinedStress, 0.7);
                        combinedStress *= 2.5;
                        combinedStress = Math.min(Math.max(combinedStress, 0), 1);

                        targetStressRef.current = Math.round(combinedStress * 100);
                    };

                    const emotionHandler = (evt) => {
                        const data = evt?.detail?.output?.FACE_EMOTION;
                        if (!data) return;

                        const emotions = data.emotions || data || {};
                        const anger = emotions.angry ?? 0;
                        const fear = emotions.fearful ?? 0;
                        const disgust = emotions.disgusted ?? 0;
                        const sad = emotions.sad ?? 0;
                        const happy = emotions.happy ?? 0;
                        const surprise = emotions.surprise ?? 0;

                        let emotionStress = 
                            anger * 1.0 +
                            fear * 1.0 +
                            disgust * 0.6 +
                            sad * 0.5 +
                            surprise * 0.3 -
                            happy * 0.7;

                        latestSignalsRef.current.emotionBias = Math.min(Math.max(emotionStress, 0), 1);

                        calculateStress();
                    };

                    const arousalHandler = (evt) => {
                        const data = evt?.detail?.output?.FACE_AROUSAL_VALENCE?.emotion || evt?.detail?.output;
                        if(!data) return;

                        latestSignalsRef.current.arousal = (data.arousal + 1) / 2;
                        latestSignalsRef.current.valence = (data.valence + 1) / 2;
                        latestSignalsRef.current.attention = evt?.detail?.output?.FACE_ATTENTION?.attention ?? 0.5;

                        calculateStress();
                    };

                    if (CY.on) {
                        CY.on(emotionEvent, emotionHandler);
                        CY.on(arousalEvent, arousalHandler);
                    } else {
                        window.addEventListener(emotionEvent, emotionHandler);
                        window.addEventListener(arousalEvent, arousalHandler);
                    }

                    start();

                    const animate = () => {
                        const prev = prevStressRef.current;
                        const target = targetStressRef.current;
                        const delta = target - prev;
                                
                        if (Math.abs(delta) > 0.5) {
                            const step = delta * (16 / TRANSITION_MS);
                            prevStressRef.current = prev + step;
                            setStress(Math.round(prev + step));
                        } else {
                            prevStressRef.current = target;
                            setStress(target);
                        }

                        if(!focusLockRef.current && (Math.round(prevStressRef.current) > 60)) {
                            focusLockRef.current = true;
                            useStore.getState().setFocusMode(true);

                            focusTimerRef.current = setTimeout(() => {
                                focusLockRef.current = false;
                                useStore.getState().setFocusMode(false);
                            }, FOCUS_DURATION_MS);
                        }

                        animationRef.current = requestAnimationFrame(animate);
                    };
                    animationRef.current = requestAnimationFrame(animate);

                    const scheduleNextCheck = () => {
                        const interval = MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
                        timeoutRef.current = setTimeout(scheduleNextCheck, interval);
                    };
                    scheduleNextCheck();

            } catch (err) {
                console.log('MorphCast SDK error:', err);
            }
        };

        initSDK();

        return () => {
            cancelAnimationFrame(animationRef.current);
            clearTimeout(timeoutRef.current);
            clearTimeout(focusTimerRef.current);
            if (stopSDK) stopSDK();
            window.__morphcastInitialized = false;
        };
    }, [sdkActive]);
}