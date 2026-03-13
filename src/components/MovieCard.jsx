import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const MovieCard = ({ movie, drag, onDragEnd, isFront, exitAction }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Rotate the card slightly based on X drag distance
    const rotate = useTransform(x, [-200, 200], [-10, 10]);

    // Opacity overlays for feedback (Green for Right, Red for Left, Blue/Gray for Down)
    const opacityRight = useTransform(x, [0, 150], [0, 1]);
    const opacityLeft = useTransform(x, [0, -150], [0, 1]);
    const opacityDown = useTransform(y, [0, 150], [0, 1]); // Mapping down swipe exclusively to Y distance

    // Fallback static gradient generation based on movie ID/title length
    const gradientHue = movie?.title ? (movie.title.length * 15) % 360 : 200;

    // Dynamically calculate the exit trajectory if a button triggered it
    const exitAnimation = {
        x: exitAction === 'RIGHT' ? 500 : exitAction === 'LEFT' ? -500 : 0,
        y: exitAction === 'DOWN' ? 500 : 0,
        opacity: 0,
        rotate: exitAction === 'RIGHT' ? 15 : exitAction === 'LEFT' ? -15 : 0,
        transition: { duration: 0.3 }
    };

    return (
        <motion.div
            exit={exitAnimation}
            className="absolute rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden border border-white/20"
            style={{
                width: 320,
                height: 500,
                x,
                y,
                rotate,
                background: movie?.poster_url
                    ? `url(${movie.poster_url}) center/cover no-repeat`
                    : `linear-gradient(135deg, hsl(${gradientHue || 200}, 80%, 40%), hsl(${((gradientHue || 200) + 60) % 360}, 80%, 20%))`,
                boxShadow: isFront ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                // Scale back cards slightly layered behind
                scale: isFront ? 1 : 0.95,
                zIndex: isFront ? 10 : 0,
                transformOrigin: 'bottom',
                opacity: 1
            }}
            drag={isFront ? true : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, info) => isFront && onDragEnd(info, movie)}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Visual Indicators (YES / NO / MAYBE) */}
            {isFront && (
                <>
                    <motion.div
                        className="absolute top-8 left-6 border-4 border-green-500 text-green-500 rounded-lg px-4 py-2 text-3xl font-extrabold uppercase tracking-wider z-20 transform -rotate-12 bg-black/20 backdrop-blur-sm"
                        style={{ opacity: opacityRight }}
                    >
                        LIKE
                    </motion.div>
                    <motion.div
                        className="absolute top-8 right-6 border-4 border-red-500 text-red-500 rounded-lg px-4 py-2 text-3xl font-extrabold uppercase tracking-wider z-20 transform rotate-12 bg-black/20 backdrop-blur-sm"
                        style={{ opacity: opacityLeft }}
                    >
                        NOPE
                    </motion.div>
                    <motion.div
                        className="absolute bottom-32 left-0 right-0 mx-auto w-max border-4 border-blue-400 text-blue-400 rounded-lg px-4 py-2 text-2xl font-extrabold uppercase tracking-wider z-20 bg-black/20 backdrop-blur-sm"
                        style={{ opacity: opacityDown }}
                    >
                        MAYBE LATER
                    </motion.div>
                </>
            )}

            {/* Poster Gradient / Info Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 select-none pointer-events-none">
                <h2 className="text-3xl font-bold text-white mb-2 text-glow drop-shadow-md">{movie?.title || 'Unknown Title'}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                    <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md font-medium border border-white/5">
                        {movie?.genre || 'Genre'}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md font-medium border border-white/5">
                        ⏱ {movie?.runtime_minutes ? `${movie.runtime_minutes} min` : '120 min'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
