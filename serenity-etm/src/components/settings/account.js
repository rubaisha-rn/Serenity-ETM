'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SettingsRow from "./settingsrow";
import { ICONS } from "@/lib/assets";
import useStore from "@/store/useStore";
import Spinner from "../spinner";

export default function AccountSettings() {

    const {theme} = useStore();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChangePassword = async () => {
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) return setError('Please fill all required fields.');

        if (newPassword !== confirmPassword) return setError('New passwords do not match');

        if (newPassword.length < 6) return setError('Password must be at least 6 characters long.');

        setLoading(true);

        const {data: {user},} = await supabase.auth.getUser();

        const email = user?.email;

        // re-auth with current password
        const {error: signInError} = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword
        });

        if (signInError) {
            setLoading(false);
            return setError('Current password is incorrect.');
        }

        // update password
        const {error: updateError} = await supabase.auth.updateUser({
            password: newPassword,
        });

        setLoading(false);

        if (updateError) return setError(updateError.message);

        setSuccess('Password updated.')

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    return (
        <div className="space-y-6">

            {loading && <Spinner/>}

            <h5 className="font-bold">Account</h5>

            {/* password change */}
            <SettingsRow
                label='Change Password'
                text='Update your password to keep your account secure and protect your data.'
                col={true}
            >
                <div className="text-xs flex flex-col w-full sm:gap-0 md:gap-0 lg:gap-1 xl:gap-1 2xl:gap-2">

                    {/* error and success messages */}
                    {(error || success) && (
                        <div className={`error-message w-3/4 ${success ? 'bg-[var(--successL)]' : ''}`}>
                            <div className="flex flex-row items-center justify-center gap-1">
                                <img
                                    src={error ? ICONS[theme].warning : ICONS[theme].success}
                                    className="bg-[var(--baseAcc-b)] rounded-full p-0.5"
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

                    <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        autoComplete="current-password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-3/4 text-xs sm:p-0.5 md:p-1 lg:p-1.5 xl:p-1.5 2xl:p-2 rounded-lg border"
                    />

                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        autoComplete="new-password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-3/4 text-xs sm:p-0.5 md:p-1 lg:p-1.5 xl:p-1.5 2xl:p-2 rounded-lg border"
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        autoComplete="confirm-password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-3/4 text-xs sm:p-0.5 md:p-1 lg:p-1.5 xl:p-1.5 2xl:p-2 rounded-lg border"
                    />

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