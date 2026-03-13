import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { AnimatePresence } from 'framer-motion';
import MovieCard from './MovieCard';

const SwipeDeck = forwardRef(({ queue, onSwipe }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exitAction, setExitAction] = useState(null);

    const processSwipe = (movie, action) => {
        setExitAction(action);
        // Add a micro-delay to let the state process the exitAction before unmounting
        setTimeout(() => {
            onSwipe(movie, action);
            setCurrentIndex((prev) => prev + 1);
        }, 10);
    };

    const handleDragEnd = (info, movie) => {
        const SWIPE_THRESHOLD = 100;
        let swipeAction = null;

        if (info.offset.x > SWIPE_THRESHOLD) swipeAction = 'RIGHT';
        else if (info.offset.x < -SWIPE_THRESHOLD) swipeAction = 'LEFT';
        else if (info.offset.y > SWIPE_THRESHOLD) swipeAction = 'DOWN';

        if (swipeAction) {
            processSwipe(movie, swipeAction);
        }
    };

    useImperativeHandle(ref, () => ({
        swipe: (action) => {
            if (currentIndex < queue.length) {
                processSwipe(queue[currentIndex], action);
            }
        }
    }));

    if (!queue || queue.length === 0 || currentIndex >= queue.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] w-[320px] text-center animate-pulse">
                <div className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-medium text-slate-300">Finding more movies...</h2>
            </div>
        );
    }

    const currentMovies = queue.slice(currentIndex, currentIndex + 3).reverse();

    return (
        <div className="relative w-[320px] h-[500px] flex justify-center items-center">
            <AnimatePresence custom={exitAction}>
                {currentMovies.map((movie, idx) => {
                    const isFront = idx === currentMovies.length - 1;
                    return (
                        <MovieCard
                            key={movie.movie_id || movie.title}
                            movie={movie}
                            isFront={isFront}
                            onDragEnd={handleDragEnd}
                            exitAction={exitAction}
                        />
                    );
                })}
            </AnimatePresence>
        </div>
    );
});

export default SwipeDeck;
