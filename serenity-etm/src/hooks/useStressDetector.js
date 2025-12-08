'use client';

import { useEffect } from "react";
import useStore from "@/store/useStore";
import Script from 'next/script';

export default function useStressDetector() {
    const setStressScore = useStore((state) => state.setEmotionValue);
    
    useEffect(() => {
        if(window.__morphcastInitialized) {
            console.log('MorphCast already initialised.');
            return;
        }
        window.__morphcastInitialized = true;

        const init = async () => {
            console.log('Waiting for MorphCast SDK...');

            const waitForCY = () =>

                new Promise((resolve, reject) => {
                    let tries = 0;
                    const check = setInterval(() => {
                        tries += 1;
                        if (window.CY && window.CY.loader) {
                            clearInterval(check);
                            resolve(window.CY);
                        } else if (tries > 40) {
                            clearInterval(check);
                            reject(new Error('MorphCast SDK not found after waiting.'));
                        }
                    }, 250);
                });

            let CY;
            try {
                CY = await waitForCY();
            } catch (err) {
                console.error("MorphCast SDK never loaded:", err);
                return;
            }

            console.log("MorphCast SDK ready");

            try {
                const loaderResult = await CY.loader()
                .licenseKey("sk6d1bdc4e0b38fecf4215452600f59abd8d710358d338")
                .addModule(CY.modules().FACE_AROUSAL_VALENCE.name, { smoothness: 0.7 })
                .addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.4 })
                .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.8 })
                .load();

                const { start } = loaderResult;
                start();

                const emotionEventName =
                (CY.modules && CY.modules().FACE_EMOTION && CY.modules().FACE_EMOTION.eventName) ||
                "cyFaceEmotionResult";
                const arousalEventName =
                (CY.modules &&
                    CY.modules().FACE_AROUSAL_VALENCE &&
                    CY.modules().FACE_AROUSAL_VALENCE.eventName) ||
                "cyFaceArousalValenceResult";

                const signals = {
                    arousal: 0,
                    valence: 0,
                    attention: 0,
                    emotionBias: 0,
                    stress: 0
                };

                const emotionHandler = (evt) => {
                    try {
                        const data = evt?.detail?.output?.FACE_EMOTION;
                        if (!data) return;

                        const emotions = data.emotions || data || {};

                        const anger = emotions.angry ?? emotions.anger ?? 0;
                        const fear = emotions.fearful ?? emotions.fear ?? 0;
                        const disgust = emotions.disgusted ?? emotions.disgust ?? 0;
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

                        emotionStress = Math.min(Math.max(emotionStress, 0), 1);
                        signals.emotionBias = emotionStress;

                    } catch (e) {
                        console.error("Error in emotionHandler:", e);
                    }
                };

                const arousalHandler = (evt) => {
                    try {
                        const shape1 = evt?.detail?.output?.FACE_AROUSAL_VALENCE?.emotion;
                        const shape2 = evt?.detail?.output;
                        const data = shape1 || shape2;
                        if (!data) return;

                        const arousal = typeof data.arousal === "number" ? data.arousal : data.Arousal ?? 0;
                        const valence = typeof data.valence === "number" ? data.valence : data.Valence ?? 0;

                        const A = (arousal + 1) / 2;
                        const V = (valence + 1) / 2;
                        const Neg = 1 - V;

                        signals.arousal = A;
                        signals.valence = V;

                        const attention = evt?.detail?.output?.FACE_ATTENTION?.attention ?? 0.5;
                        signals.attention = attention;

                        let baseStress = A * Neg;
                        const cognitionBoost = 0.7 + attention * 0.6;
                        baseStress *= cognitionBoost;

                        let combinedStress = baseStress * 0.65 + signals.emotionBias * 0.35;

                        combinedStress = Math.pow(combinedStress, 0.7);
                        const positivitySuppression = Math.pow(signals.valence, 1.3);
                        combinedStress *= (1 - positivitySuppression);
                        combinedStress = combinedStress * 3.2;
                        combinedStress = Math.pow(combinedStress, 0.85)
                        combinedStress = Math.min(Math.max(combinedStress, 0), 1);

                        const newStress = Math.round(combinedStress * 100);

                        setStressScore(newStress);

                    } catch (e) {
                        console.error("Error in arousalHandler:", e);
                    }
                };

                if (typeof CY.on === "function") {
                    CY.on(emotionEventName, emotionHandler);
                    CY.on(arousalEventName, arousalHandler);
                } else {
                    window.addEventListener(emotionEventName, emotionHandler);
                    window.addEventListener(arousalEventName, arousalHandler);
                }
            } catch (err) {
                console.error("MorphCast failed to initialize or attach handlers:", err);
            }
        };

        init();

        return () => {
            try {
                window.__morphcastInitialized = false;
            } catch {}
        };
    }, []);
}