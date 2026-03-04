/**
 * Account settings panel for updating password.
 */

'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SettingsRow from "./settingsrow";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import Spinner from "../spinner";
import validatePassword from "../validatePassword";

export default function AccountSettings() {

    // Global state
    const theme = useStore((s) => s.theme);

    // Form input states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state for loading, error, success messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle password change
    const handleChangePassword = async () => {

        setError('');
        setSuccess('');

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) return setError('Please fill all required fields.');

        // Ensure passwords match
        if (newPassword !== confirmPassword) return setError('New passwords do not match');

        // Prevent reuse of old password
        if (currentPassword === newPassword) return setError('New password must be different from current password.');

        // Validate password strength
        const passwordValidationError = validatePassword(newPassword);
        if (passwordValidationError) {
            return setError(passwordValidationError);
        }

        setLoading(true);

        // Retrieve authenticated user info
        const {data: {user},} = await supabase.auth.getUser();
        const email = user?.email;

        // Re-auth with current password
        const {error: signInError} = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword
        });

        // Signin error displayed
        if (signInError) {
            setLoading(false);
            return setError('Current password is incorrect.');
        }

        // Update password
        const {error: updateError} = await supabase.auth.updateUser({
            password: newPassword,
        });

        setLoading(false);

        // Update error displayed
        if (updateError) return setError(updateError.message);

        // Success message
        setSuccess('Password updated.')

        // Form reset
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    return (

        // Outer container
        <div className="space-y-6">

            {/* Loading overlay */}
            {loading && <Spinner/>}

            {/* Section heading */}
            <h5 className="font-bold">Account</h5>

            {/* Password change section */}
            <SettingsRow
                label='Change Password'
                text='Update your password to keep your account secure and protect your data.'
                col={true}
            >
                <div className="text-xs flex flex-col w-full sm:gap-0 md:gap-0 lg:gap-1 xl:gap-1 2xl:gap-2">

                    {/* Error and success messages */}
                    {(error || success) && (
                        <div 
                            role="alert"
                            aria-live="assertive"
                            className={`error-message w-3/4 ${success ? 'bg-[var(--successL)]' : ''}`}
                        >
                            <div 
                                className="flex flex-row items-center justify-center gap-1"
                            >
                                <img
                                    src={error ? ICONS[theme].warning : ICONS[theme].success}
                                    className="bg-white rounded-full p-0.5"
                                    alt=""
                                    aria-hidden='true'
                                />
                                <p className="font-bold">{error ? 'Error!' : 'Success!'}</p>
                                <p className="text-[var(--text-a)]">{error ? error : success}</p>
                            </div>

                            <button
                                onClick={() => {
                                    error ? setError('') : setSuccess('')
                                }}
                            >
                                <img
                                    src={ICONS[theme].close}
                                    className="lg:w-[1rem] aspect-square opacity-70"
                                    alt=""
                                    aria-hidden='true'
                                />
                            </button>
                        </div>
                    )}

                    {/* Current password input */}
                    <label 
                        className="sr-only" 
                        htmlFor="current-password"
                    >
                        Current password
                    </label>

                    <input
                        id="current-password"
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        autoComplete="current-password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-3/4 text-xs sm:p-0.5 md:p-1 lg:p-1.5 xl:p-1.5 2xl:p-2 rounded-lg border bg-[--baseAcc-b] border-[--e-main]"
                        aria-label="Current password"
                    />

                    {/* New password */}
                    <label 
                        className="sr-only" 
                        htmlFor="new-password"
                    >
                        New password
                    </label>

                    <input
                        id="new-password"
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        autoComplete="new-password"
                        onChange={(e) => {
                            const value = e.target.value;
                            setNewPassword(e.target.value);
                            const validationError = validatePassword(value);
                            setError(validationError || '');    
                        }}
                        className="w-3/4 text-xs sm:p-0.5 md:p-1 lg:p-1.5 xl:p-1.5 2xl:p-2 rounded-lg border bg-[--baseAcc-b] border-[--e-main]"
                        aria-label="New password"
                    />

                    {/* Confirm new password */}
                    <label 
                        className="sr-only" 
                        htmlFor="confirm-password"
                    >
                        Confirm password
                    </label>

                    <input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        autoComplete="confirm-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-3/4 text-xs sm:p-0.5 md:p-1 lg:p-1.5 xl:p-1.5 2xl:p-2 rounded-lg border bg-[--baseAcc-b] border-[--e-main]"
                        aria-label="Confirm new password"
                    />

                    {/* Update password button */}
                    <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="prim-act-btn"
                    >
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
            </SettingsRow>
        </div>
    );
}