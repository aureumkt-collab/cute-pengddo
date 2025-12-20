import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

import { trackInfo } from '../data/tracks';

const playlist = trackInfo.map(track => track.audio);

export const MusicProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.has('song');
    });
    const [trackIndex, setTrackIndex] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const songId = params.get('song');
        if (songId) {
            const index = trackInfo.findIndex(t => t.id === songId);
            if (index !== -1) return index;
        }
        return 0;
    });
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [isShuffle, setIsShuffle] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
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

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.log("Play blocked or failed", e);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, trackIndex]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;

        const handleCanPlay = () => {
            if (isPlaying && audioRef.current?.paused) {
                audioRef.current.play().catch(() => { });
            }
        };



        audio.addEventListener('ended', handleTrackEnd);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('ended', handleTrackEnd);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [trackIndex, isPlaying, volume, isShuffle]);



    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
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
        isPanelOpen,
        setIsPanelOpen,
        isShuffle,
        setIsShuffle,
        togglePlay,
        skipToNextTrack,
        skipToPrevTrack,
        playlist,
        currentTrack: playlist[trackIndex],
        currentTime,
        duration,
        seek
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
