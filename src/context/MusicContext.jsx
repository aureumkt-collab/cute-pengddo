import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

export const MusicProvider = ({ children }) => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin, loading: authLoading } = useAuth();

    // 앨범 커버 이미지 프리로딩 함수
    const preloadImages = (trackList) => {
        trackList.forEach(track => {
            if (track.cover) {
                const img = new Image();
                img.src = track.cover;
            }
        });
    };

    const [refreshKey, setRefreshKey] = useState(Date.now());
    const fetchTracks = async () => {
        // 인증 확인 중이면 대기
        if (authLoading) return;

        try {
            // image_library와 JOIN하여 최신 public_url 및 thumbnail_url을 가져옴
            let query = supabase
                .from('tracks')
                .select(`
                    *,
                    cover_library:image_library(public_url, thumbnail_url)
                `);

            // 관리자가 아닐 때만 is_active 필터링 적용
            if (!isAdmin) {
                query = query.or('is_active.eq.true,is_active.is.null');
            }

            const { data, error } = await query.order('orders', { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                const now = Date.now();
                setRefreshKey(now);
                // image_library에서 가져온 URL들을 할당
                const processedData = data.map(track => {
                    const coverBase = track.cover_library?.thumbnail_url || track.cover_library?.public_url || track.cover || '/default-album.png';
                    const originalBase = track.cover_library?.public_url || track.cover || '/default-album.png';
                    return {
                        ...track,
                        // 캐시 방지를 위해 타임스탬프 추가
                        cover: coverBase.includes('?') ? `${coverBase}&t=${now}` : `${coverBase}?t=${now}`,
                        original_cover: originalBase.includes('?') ? `${originalBase}&t=${now}` : `${originalBase}?t=${now}`
                    };
                });
                setTracks(processedData);
                preloadImages(processedData);
            }
        } catch (err) {
            console.error("Error fetching tracks from Supabase:", err);
            setTracks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracks();
    }, [isAdmin, authLoading]);

    const [isPlaying, setIsPlaying] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.has('song');
    });
    const [trackIndex, setTrackIndex] = useState(0);

    // URL 파라미터 기반 초기 트랙 설정은 데이터 로딩 후 처리
    // song 파라미터가 없으면 랜덤 곡으로 자동 재생
    useEffect(() => {
        if (!loading && tracks.length > 0) {
            const params = new URLSearchParams(window.location.search);
            const songId = params.get('song');
            if (songId) {
                // slug 또는 id 중 하나라도 일치하는 곡 찾기 (유연한 리졸버 방식)
                const index = tracks.findIndex(t =>
                    String(t.slug) === String(songId) || String(t.id) === String(songId)
                );
                if (index !== -1) {
                    setTrackIndex(index);
                } else {
                    // 찾을 수 없는 경우 랜덤 곡
                    setTrackIndex(Math.floor(Math.random() * tracks.length));
                    setIsPlaying(true);
                }
            } else {
                // song 파라미터가 없으면 랜덤 곡 선택 및 자동 재생
                const randomIndex = Math.floor(Math.random() * tracks.length);
                setTrackIndex(randomIndex);
                setIsPlaying(true);
            }
        }
    }, [loading, tracks]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [isShuffle, setIsShuffle] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const getRandomIndex = (currentIndex) => {
        if (tracks.length <= 1) return 0;
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * tracks.length);
        } while (nextIndex === currentIndex);
        return nextIndex;
    };

    const handleTrackEnd = () => {
        if (tracks.length === 0) return;

        if (isShuffle) {
            setTrackIndex(getRandomIndex(trackIndex));
        } else {
            const nextIndex = (trackIndex + 1) % tracks.length;
            setTrackIndex(nextIndex);
        }
        setIsPlaying(true);
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
    }, [trackIndex, isPlaying, volume, isShuffle, tracks]);



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
            const nextIndex = (trackIndex + 1) % tracks.length;
            setTrackIndex(nextIndex);
        }
        setIsPlaying(true);
    };

    const skipToPrevTrack = () => {
        if (isShuffle) {
            setTrackIndex(getRandomIndex(trackIndex));
        } else {
            const prevIndex = (trackIndex - 1 + tracks.length) % tracks.length;
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
        tracks,
        currentTrack: tracks[trackIndex],
        currentTime,
        duration,
        seek,
        loading,
        isAdmin,
        refreshTracks: fetchTracks,
        refreshKey
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
            {!loading && tracks.length > 0 && (
                <audio
                    ref={audioRef}
                    src={tracks[trackIndex]?.audio ? encodeURI(tracks[trackIndex].audio) : ''}
                />
            )}
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
