import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const playAudio = async () => {
            try {
                if (audioRef.current) {
                    audioRef.current.volume = 0.3; // Start with a reasonable volume
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } catch (err) {
                console.log("Autoplay blocked, waiting for user interaction");
                setIsPlaying(false);
            }
        };

        playAudio();

        // If autoplay is blocked, try to play on the first user interaction
        const handleUserInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.log("Play failed", e));
            }
            // Remove the listeners once we've tried to play
            ['click', 'keydown', 'touchstart'].forEach(event =>
                document.removeEventListener(event, handleUserInteraction)
            );
        };

        ['click', 'keydown', 'touchstart'].forEach(event =>
            document.addEventListener(event, handleUserInteraction)
        );

        return () => {
            ['click', 'keydown', 'touchstart'].forEach(event =>
                document.removeEventListener(event, handleUserInteraction)
            );
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <audio ref={audioRef} src="/bgm.mp3" loop />
            <button
                onClick={togglePlay}
                className={`w-12 h-12 rounded-full backdrop-blur-md border shadow-lg flex items-center justify-center transition-all duration-300 ${isPlaying
                        ? 'bg-pink-500/20 border-pink-500/40 text-pink-200 animate-pulse-slow'
                        : 'bg-gray-800/40 border-white/10 text-gray-400'
                    } hover:scale-110`}
                aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
            >
                {isPlaying ? (
                    <div className="flex gap-1 items-end h-4">
                        <div className="w-1 bg-current animate-[music-bar_1s_ease-in-out_infinite] h-2"></div>
                        <div className="w-1 bg-current animate-[music-bar_1.2s_ease-in-out_infinite_0.1s] h-4"></div>
                        <div className="w-1 bg-current animate-[music-bar_0.8s_ease-in-out_infinite_0.2s] h-3"></div>
                    </div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                    </svg>
                )}
            </button>
            <style jsx>{`
        @keyframes music-bar {
          0%, 100% { height: 40%; }
          50% { height: 100%; }
        }
      `}</style>
        </div>
    );
};

export default MusicPlayer;
