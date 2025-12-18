import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

const playlist = ['/bgm.mp3', '/bgm2.mp3', '/flight_of_500won_v4.mp3', '/gift_from_blue_ice_v1.mp3'];

export const MusicProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [showLyrics, setShowLyrics] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [isShuffle, setIsShuffle] = useState(false);
    const audioRef = useRef(null);

    const getRandomIndex = (currentIndex) => {
        if (playlist.length <= 1) return 0;
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentIndex);
        return nextIndex;
    };

    const handleTrackEnd = () => {
        if (isShuffle) {
            setTrackIndex(getRandomIndex(trackIndex));
        } else {
            const nextIndex = (trackIndex + 1) % playlist.length;
            setTrackIndex(nextIndex);
        }
    };

    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(e => console.log("Play failed", e));
        }
    }, [trackIndex]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;

        const handleCanPlay = () => {
            if (isPlaying) audio.play().catch(e => console.log("Autoplay blocked"));
        };

        audio.addEventListener('ended', handleTrackEnd);
        return () => {
            audio.removeEventListener('ended', handleTrackEnd);
        };
    }, [trackIndex, isPlaying, volume, isShuffle]);

    useEffect(() => {
        const handleUserInteraction = () => {
            if (audioRef.current && audioRef.current.paused && isPlaying) {
                audioRef.current.play().catch(e => console.log("Play failed", e));
            }
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
    }, [isPlaying]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setShowLyrics(false);
            } else {
                audioRef.current.play().catch(e => console.log("Play failed", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const skipToNextTrack = () => {
        if (isShuffle) {
            setTrackIndex(getRandomIndex(trackIndex));
        } else {
            const nextIndex = (trackIndex + 1) % playlist.length;
            setTrackIndex(nextIndex);
        }
        setIsPlaying(true);
    };

    const skipToPrevTrack = () => {
        if (isShuffle) {
            setTrackIndex(getRandomIndex(trackIndex));
        } else {
            const prevIndex = (trackIndex - 1 + playlist.length) % playlist.length;
            setTrackIndex(prevIndex);
        }
        setIsPlaying(true);
    };

    const value = {
        isPlaying,
        setIsPlaying,
        trackIndex,
        setTrackIndex,
        showLyrics,
        setShowLyrics,
        isShuffle,
        setIsShuffle,
        togglePlay,
        skipToNextTrack,
        skipToPrevTrack,
        playlist,
        currentTrack: playlist[trackIndex]
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
            <audio
                ref={audioRef}
                src={playlist[trackIndex]}
            />
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};
