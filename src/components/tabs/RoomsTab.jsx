import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Mock matched movies
const MOCK_MATCHES = [
    { id: 1, title: 'Inception', poster: 'https://image.tmdb.org/t/p/w200/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
    { id: 2, title: 'The Dark Knight', poster: 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: 3, title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
    { id: 4, title: 'Pulp Fiction', poster: 'https://image.tmdb.org/t/p/w200/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
    { id: 5, title: 'The Matrix', poster: 'https://image.tmdb.org/t/p/w200/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' }
];

const RoomsTab = () => {
    const [copied, setCopied] = useState(false);
    const [matchesExpanded, setMatchesExpanded] = useState(false);
    const mockRoomUrl = "https://moviematch.app/room/c0cbd297"; // Mock UUID from earlier

    const handleCopy = () => {
        navigator.clipboard.writeText(mockRoomUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center p-6 mt-10 z-40 relative">
            <h2 className="text-3xl font-bold text-white mb-2">My Rooms</h2>

            <div className="w-full bg-slate-800/80 rounded-2xl p-6 backdrop-blur-md mb-8 shadow-xl border border-white/10 text-center">
                <span className="text-4xl mb-4 block">🎫</span>
                <h3 className="text-xl font-semibold text-emerald-400 mb-2">Get a Room!</h3>
                <p className="text-sm text-slate-300 mb-6">Create a private space and invite a partner to start syncing your movie nights together.</p>

                <div className="flex bg-slate-900 rounded-lg p-1 border border-white/10">
                    <input
                        className="bg-transparent text-slate-400 text-xs px-3 w-full outline-none select-all"
                        readOnly
                        value={mockRoomUrl}
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 py-2 rounded text-sm transition-colors"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="w-full">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Active Connections</h3>
                <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col hover:bg-slate-800 transition-colors border border-white/5 overflow-hidden">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setMatchesExpanded(!matchesExpanded)}>
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">B</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-100">Bob</h4>
                            <p className="text-xs text-slate-400">Created 2 days ago</p>
                        </div>
                        <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                            {MOCK_MATCHES.length} Matches ✨ {matchesExpanded ? '▲' : '▼'}
                        </span>
                    </div>

                    {/* Expandable Matches View */}
                    <AnimatePresence>
                        {matchesExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 pt-4 border-t border-white/10"
                            >
                                <h4 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Shared Watchlist</h4>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                    {MOCK_MATCHES.map(movie => (
                                        <div key={movie.id} className="flex-shrink-0 w-20 flex flex-col gap-2">
                                            <div className="w-20 h-28 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] text-slate-300 font-medium text-center truncate">{movie.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RoomsTab;
