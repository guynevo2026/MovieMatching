import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const ProfileTab = ({ userProfile, setUserProfile }) => {
    const [loginStatus, setLoginStatus] = useState(null); // { type: 'error' | 'success' | 'loading', message: string }

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center p-6 mt-10 z-40 relative">
            <h2 className="text-3xl font-bold text-white mb-2">
                {userProfile ? `Hi, ${userProfile.username.split(' ')[0]}!` : 'My Profile'}
            </h2>

            <button className="w-24 h-24 rounded-full bg-slate-700 border-2 border-emerald-400 mb-6 flex items-center justify-center overflow-hidden hover:scale-105 hover:ring-4 ring-emerald-400/30 transition-all cursor-pointer shadow-xl">
                {userProfile && userProfile.profile_picture_url ? (
                    <img src={userProfile.profile_picture_url} referrerPolicy="no-referrer" alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl">👤</span>
                )}
            </button>

            <div className="w-full bg-slate-800/80 rounded-2xl p-6 backdrop-blur-md mb-6 shadow-xl border border-white/10">
                <h3 className="text-xl font-semibold text-slate-200 mb-4">Streaming Services</h3>
                <p className="text-xs text-slate-400 mb-4">Select the services you are subscribed to, so we only show you movies you can actually watch.</p>

                <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-red-600 font-black text-white flex items-center justify-center text-sm">N</div>
                        <span className="font-medium text-slate-200">Netflix</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>
            </div>

            <div className="w-full mt-4 flex flex-col items-center gap-4">
                {loginStatus && (
                    <div className={`w-full p-3 rounded-lg text-xs font-bold text-center border ${loginStatus.type === 'error' ? 'bg-red-900/50 text-red-200 border-red-500/50' :
                        loginStatus.type === 'success' ? 'bg-emerald-900/50 text-emerald-200 border-emerald-500/50' :
                            'bg-blue-900/50 text-blue-200 border-blue-500/50'
                        }`}>
                        {loginStatus.message}
                    </div>
                )}

                {!userProfile && (
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                setLoginStatus({ type: 'loading', message: 'Verifying Secure Token...' });
                                const res = await fetch('http://localhost:3000/api/auth/google', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ credential: credentialResponse.credential })
                                });
                                const data = await res.json();

                                if (!res.ok) throw new Error(data.error || 'Server rejected token');

                                setUserProfile(data.user);
                                setLoginStatus({ type: 'success', message: `✅ Welcome back, ${data.user.username}!` });
                            } catch (err) {
                                setLoginStatus({ type: 'error', message: `❌ Login Failed: ${err.message}` });
                            }
                        }}
                        onError={() => {
                            setLoginStatus({ type: 'error', message: '❌ Google Login Trigger Failed (Check Cloud Console Origins)' });
                        }}
                        theme="filled_black"
                        shape="pill"
                        text="continue_with"
                        width="280"
                    />
                )}
            </div>
        </div>
    );
};

export default ProfileTab;
