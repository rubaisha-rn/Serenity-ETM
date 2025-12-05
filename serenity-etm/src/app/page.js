'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import FloatingBlobs from '../components/floatingblobs';
import StressControl from '../components/stressControl';

export default function IntroPage() {
    
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);

    return (
        <main
            className='relative min-h-screen text-light-mainText bg-light-background dark:bg-dark-background overflow-hidden'
        >
            <FloatingBlobs className='z-0'/>
            {/* <StressControl className='z-20' /> */}

            {/* 2x2 grid layout */}
            <div 
                className='
                relative z-10 
                grid grid-cols-1 grid-rows-1 
                
                md:grid-cols-2
                md:grid-rows-2
                
                h-screen
                gap-6 p-8
                md:p-10
                md:mt-0'
            >

                {/* top left box */}
                <div className='
                    flex 
                    items-center
                    justify-start
                    h-full
                    order-1
                    
                    md:order-none
                    md:pt-4'
                >
                    <div className='max-w-md p-6 space-y-4'>
                        
                        <h1 className='text-[clamp(4.5rem,7.8vw,8rem)] leading-none font-AbrilFatface'>Serenity</h1>
                        
                        <h1 className='text-[clamp(1.5rem,2.5vw,3rem)] leading-none font-AbrilFatface'>Email & Task Manager</h1>
                        
                        <p className='pt-4 text-light-subText font-Roboto text-[clamp(0.8rem,1.1vw,1rem)] leading-snug'>A calm, emotion-aware email and task manager to reduce workplace stress.</p>
                    
                    </div>
                </div>

                {/* top right and bottom left intentionally left empty */}
                <div />
                <div />

                {/* bottom right */}
                <div className='
                    flex 
                    items-center
                    justify-start
                    h-full
                    order-2
                    
                    md:order-none
                    md:ml-40
                    md:mr-10'
                >
                    <div className='w-full max-w-md space-y-4'>
                        
                        <p className='text-light-subText font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug'>
                            By using this prototype, you agree that the application will adapt its interface based on your detected stress level. No real biometric data is stored, and this is a prototype for academic purposes.  
                        </p>

                        <div className='flex items-center space-x-2'>
                            
                            <input
                                type='checkbox'
                                id='accept'
                                checked={accepted}
                                onChange={() => setAccepted(!accepted)}
                                className='w-3 h-3 accent-blue-500'
                            />
                            
                            <label htmlFor='accept' className='text-light-subText font-Roboto text-[clamp(0.6rem,0.9vw,1rem)] leading-snug'>I agree to the&nbsp;
                                
                                <button
                                    className='underline hover:text-blue-400'
                                    onClick={()=> router.push('/terms')}
                                >Terms and Conditions</button>
                            
                            </label>
                        
                        </div>

                        <button
                            disabled={!accepted}
                            className={`font-Roboto text-[clamp(0.8rem,1.1vw,1rem)] leading-snug w-full py-3 rounded-full font-medium transition-colors ${accepted
                                ? 'bg-light-button hover:bg-light-buttonHover text-white cursor-pointer'
                                : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                            }`}
                            onClick={() => router.push('/emails')}
                        >
                            Enter Serenity Workplace
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};