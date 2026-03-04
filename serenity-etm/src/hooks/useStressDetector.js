/**
 * Stress detection hook using MorphCast SDK.
 * 
 * This hook:
    * Initialises MorphCast facial analysis SDK
    * Listens for emotion, arousal, valence, and attention signals
    * Calculates a combined stress score
    * Smoothly updates the application's global emotion value
 *
 * Used to:
    * Trigger focus mode
    * Detect stress states
    * Adapt UI complexity
 */

'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useRef, useState } from "react";
import useStore from "@/store/useStore";

// SDK license key
const LICENSE_KEY = process.env.NEXT_PUBLIC_MY_SDK_KEY;

export default function useStressDetector() {
    
    // Supabase session
    const [session, setSession] = useState(null);

    // Global store values
    const {sdkActive, setEmotionValue, stressDetectionDuration, stressSensitivity} = useStore();

    // Stress update intervals
    const CHECK_INTERVAL_MS = stressDetectionDuration; 
    const TRANSITION_MS = stressDetectionDuration; 
    
    // Previous stress value used for smoothing animation
    const prevStressRef = useRef(0);

    // Stress targets for smoothing raw stress value
    const liveTargetRef = useRef(0);
    const internalTargetRef = useRef(0);
    
    // References used to stop loops and SDK safely
    const animationRef = useRef(null);
    const intervalRef = useRef(null);
    const stopSDKRef = useRef(null);

    // Latest facial analysis signals from SDK
    const latestSignalsRef = useRef({
        arousal: 0,
        valence: 0,
        attention: 0,
        emotionBias: 0,
    });

    /**
     * Auth session listener
     * Tracks authentication state for SDK to only run when user session exists.
     */
    useEffect(() => {

        supabase.auth.getSession().then(({data}) => {
            setSession(data.session);
        });

        // Session listener
        const {data: listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        console.log('SDK Active?', sdkActive)

        // Cleanup listerner
        return () => listener.subscription.unsubscribe();
    }, []);

    /**
     * SDK initialisation
     * Starts SDK when sdkActive is true, and user session exists.
     */
    useEffect(() => {
        
        // Stops if disables or user logged out
        if (!sdkActive || !session) {

            stopSDKRef.current?.();
            cancelAnimationFrame(animationRef.current);
            clearTimeout(intervalRef.current);
            
            return;
        }

        // Prevents double initialisation
        if(!window.__morphcastInitialized) window.__morphcastInitialized = true;

        let stopSDK;

        // SDK bootstrap function
        const initSDK = async () => {
            try {
                
                // Wait until MorphCast SDK loads in the browser
                const CY = await new Promise((resolve, reject) => {
                    
                    let tries = 0;
                    
                    const check = setInterval(() => {
                    
                        tries++;

                        // If SDK loader exists, resolve promise
                        if (window.CY && window.CY.loader) {
                    
                            clearInterval(check);
                            resolve(window.CY);

                        } else if (tries > 40) {
                            
                            // If too many tries, assume SDK failed to load
                            clearInterval(check);
                            reject('MorphCast SDK not found');
                        }
                    
                    }, 250);
                });

                // Configure MorphCast modules
                const loader = await CY.loader()
                    .licenseKey(LICENSE_KEY)
                    .addModule(
                        CY.modules().FACE_AROUSAL_VALENCE.name, 
                        { smoothness: 0.7 }
                    )
                    .addModule(
                        CY.modules().FACE_EMOTION.name, 
                        { smoothness: 0.4 }
                    )
                    .addModule(
                        CY.modules().FACE_ATTENTION.name, 
                        { smoothness: 0.8 }
                    )
                    .load();

                    const { start, stop } = loader;

                    stopSDK = stop;
                    stopSDKRef.current = stop;

                    // Event names used by SDK modules
                    const emotionEvent = CY.modules().FACE_EMOTION.eventName;
                    const arousalEvent = CY.modules().FACE_AROUSAL_VALENCE.eventName;

                    /**
                     * Stress calculation
                     * 
                     * Combines physiological and emotional signals into a normalised stress value (0-100).
                     */
                    const calculateStress = () => {
                        
                        const { 
                            arousal, 
                            valence, 
                            attention, 
                            emotionBias 
                        } = latestSignalsRef.current;

                        // Base stress from arousal and valence 
                        let baseStress = arousal * (1 - valence);

                        // Attention increases stress intensity
                        baseStress *= 0.7 + attention * 0.6;

                        // Combines physiological and emotional signals
                        let combinedStress = baseStress * 0.55 + emotionBias * 0.45;

                        // Curve adjustment
                        combinedStress = Math.pow(combinedStress, 0.7);

                        // Scale and clamp
                        combinedStress *= 2.5;
                        combinedStress = Math.min(Math.max(combinedStress, 0), 1);

                        // Convert to percentage
                        liveTargetRef.current = Math.round(combinedStress * 100);
                    };

                    /**
                     * Emotion signal handler
                     * 
                     * Converts facial emotion probabilities into an emotion stress bias.
                     */
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

                        // Weighted emotional stress model
                        let emotionStress = 
                            anger * 1.0 +
                            fear * 1.0 +
                            disgust * 0.6 +
                            sad * 0.5 +
                            surprise * 0.3 -
                            happy * 0.7; 

                        // Preventing negative values
                        emotionStress = Math.max(emotionStress, 0);

                        // Sensitivity exponent applied
                        emotionStress = Math.pow(emotionStress, stressSensitivity);

                        latestSignalsRef.current.emotionBias = Math.min(Math.max(emotionStress, 0), 1);

                        calculateStress();
                    };

                    /**
                     * Arousal handler
                     * 
                     * Updates physiological stress signals.
                     */
                    const arousalHandler = (evt) => {

                        const data = evt?.detail?.output?.FACE_AROUSAL_VALENCE?.emotion || evt?.detail?.output;
                        if(!data) return;
                        
                        // Normalise values from [-1, 1] to [0, 1]
                        latestSignalsRef.current.arousal = (data.arousal + 1) / 2;
                        latestSignalsRef.current.valence = (data.valence + 1) / 2;
                        latestSignalsRef.current.attention = evt?.detail?.output?.FACE_ATTENTION?.attention ?? 0.5;

                        calculateStress();
                    };

                    // Register event listeners
                    if (CY.on) {
                        CY.on(emotionEvent, emotionHandler);
                        CY.on(arousalEvent, arousalHandler);
                    } else {
                        window.addEventListener(emotionEvent, emotionHandler);
                        window.addEventListener(arousalEvent, arousalHandler);
                    }

                    // Start SDK camera processing
                    start();

                    /**
                     * Stress smoothing animation
                     * 
                     * Smoothly transitions stress values to avoid sudden jumps in UI behaviour.
                     */
                    const animate = () => {

                        // Previous and target reference
                        const prev = prevStressRef.current;
                        const target = internalTargetRef.current;
                        
                        const delta = target - prev;

                        // Smooth transitions from previous to target if difference is large
                        if (Math.abs(delta) > 0.1) {
                            
                            const step = delta * (16 / TRANSITION_MS);
                            const next = prev + step;

                            prevStressRef.current = next;
                            setEmotionValue(Math.round(next));

                        } else {
                            
                            // Otherwise snap to target
                            prevStressRef.current = target;
                            setEmotionValue(target);
                        }

                        // Continue animation loop
                        animationRef.current = requestAnimationFrame(animate);
                    };

                    // Start smoothing animation loop
                    animationRef.current = requestAnimationFrame(animate);

                    // Periodically update internal target
                    intervalRef.current = setInterval(() => {
                        internalTargetRef.current = liveTargetRef.current;
                    }, CHECK_INTERVAL_MS);

            } catch (err) {
                console.log('MorphCast SDK error:', err);
            }
        };

        initSDK();

        /**
         * Cleanup
         */
        return () => {
            cancelAnimationFrame(animationRef.current);
            clearInterval(intervalRef.current);
            stopSDK?.();
            window.__morphcastInitialized = false;
        };

    }, [sdkActive, session, stressDetectionDuration, stressSensitivity]);
}