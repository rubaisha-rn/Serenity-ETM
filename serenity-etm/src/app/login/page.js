'use client';

import { useState } from "react";
import {supabase} from '@/lib/supabaseClient'
import { useRouter } from "next/navigation";
import useStore from '@/store/useStore';
import Spinner from "@/components/spinner";

export default function LoginPage() {
    const router = useRouter()
    const {setScreen} = useStore();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setError(error.message)
        }
        else {
            setScreen('dashboard')
            router.push('/dashboard')
        }

        setLoading(false)
    }

    return (
        <div style={{maxWidth: 360, margin: '120px auto'}}>

            {loading && <Spinner/>}

            <h2>Serenity ETM</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[--baseAcc-b] border-[--e-main]"
                />
                <br/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[--baseAcc-b] border-[--e-main]"
                />
                <br/>
                <button type="submit" disabled={loading}>
                    {loading ? "Signin in..." : "Login"}
                </button>
            </form>

            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}