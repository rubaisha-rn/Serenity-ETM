'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useRef, useState } from "react";
import useStore from "@/store/useStore";

const LICENSE_KEY = process.env.NEXT_PUBLIC_MY_SDK_KEY;

export default function useStressDetector() {
    
    const [session, setSession] = useState(null);

    const {sdkActive, setEmotionValue, stressDetectionDuration, stressSensitivity} = useStore();

    const CHECK_INTERVAL_MS = stressDetectionDuration; 
    const TRANSITION_MS = stressDetectionDuration; 
    
    const prevStressRef = useRef(0);

    const liveTargetRef = useRef(0);
    const internalTargetRef = useRef(0);
    
    const animationRef = useRef(null);
    const intervalRef = useRef(null);
    const stopSDKRef = useRef(null);

    const latestSignalsRef = useRef({
        arousal: 0,
        valence: 0,
        attention: 0,
        emotionBias: 0,
    });

    useEffect(() => {
        supabase.auth.getSession().then(({data}) => {
            setSession(data.session);
        });

        const {data: listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        console.log('SDK Active?', sdkActive)
        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {

        if (!sdkActive || !session) {
            stopSDKRef.current?.();
            cancelAnimationFrame(animationRef.current);
            clearTimeout(intervalRef.current);
            return;
        }

        if(!window.__morphcastInitialized) window.__morphcastInitialized = true;

        let stopSDK;

        const initSDK = async () => {
            try {

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

                const loader = await CY.loader()
                    .licenseKey(LICENSE_KEY)
                    .addModule(CY.modules().FACE_AROUSAL_VALENCE.name, { smoothness: 0.7 })
                    .addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.4 })
                    .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.8 })
                    .load();

                    const { start, stop } = loader;
                    stopSDK = stop;
                    stopSDKRef.current = stop;

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

                        liveTargetRef.current = Math.round(combinedStress * 100);
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
                            happy * 0.7; // assigning weighted values to different emotions

                        // removing negative so exponent behaves properly
                        emotionStress = Math.max(emotionStress, 0);

                        // sensitivity application
                        emotionStress = Math.pow(emotionStress, stressSensitivity);

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
                        const target = internalTargetRef.current;
                        
                        const delta = target - prev;
                                
                        if (Math.abs(delta) > 0.1) {
                            const step = delta * (16 / TRANSITION_MS);
                            const next = prev + step;

                            prevStressRef.current = next;
                            setEmotionValue(Math.round(next));
                        } else {
                            prevStressRef.current = target;
                            setEmotionValue(target);
                        }

                        animationRef.current = requestAnimationFrame(animate);
                    };
                    animationRef.current = requestAnimationFrame(animate);

                    intervalRef.current = setInterval(() => {
                        internalTargetRef.current = liveTargetRef.current;
                    }, CHECK_INTERVAL_MS);

            } catch (err) {
                console.log('MorphCast SDK error:', err);
            }
        };

        initSDK();

        return () => {
            cancelAnimationFrame(animationRef.current);
            clearInterval(intervalRef.current);
            stopSDK?.();
            window.__morphcastInitialized = false;
        };
    }, [sdkActive, session, stressDetectionDuration, stressSensitivity]);
}