import React, { useState, useEffect, useRef } from 'react';

// 플레이리스트 정의
const playlist = ['/bgm.mp3', '/bgm2.mp3'];

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const audioRef = useRef(null);

    // 곡이 끝나면 다음 곡으로 전환
    const handleTrackEnd = () => {
        const nextIndex = (trackIndex + 1) % playlist.length;
        setTrackIndex(nextIndex);
    };

    // 트랙이 변경되면 자동 재생
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(e => console.log("Play failed", e));
        }
    }, [trackIndex]);

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

    const skipToNextTrack = () => {
        const nextIndex = (trackIndex + 1) % playlist.length;
        setTrackIndex(nextIndex);
        setIsPlaying(true);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
        }}>
            <audio
                ref={audioRef}
                src={playlist[trackIndex]}
                onEnded={handleTrackEnd}
            />

            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backdropFilter: 'blur(12px)',
                    border: isPlaying ? '2px solid rgba(236, 72, 153, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isPlaying
                        ? '0 8px 32px rgba(236, 72, 153, 0.4)'
                        : '0 8px 32px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    background: isPlaying
                        ? 'rgba(236, 72, 153, 0.2)'
                        : 'rgba(31, 31, 31, 0.6)',
                    color: isPlaying ? '#F9A8D4' : '#9CA3AF',
                    cursor: 'pointer',
                    animation: isPlaying ? 'glow 2s ease-in-out infinite' : 'none',
                    zIndex: 2
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
            >
                {isPlaying ? (
                    <div style={{
                        display: 'flex',
                        gap: '3px',
                        alignItems: 'flex-end',
                        height: '20px'
                    }}>
                        <div style={{
                            width: '4px',
                            backgroundColor: 'currentColor',
                            borderRadius: '2px',
                            animation: 'music-bar 1s ease-in-out infinite'
                        }}></div>
                        <div style={{
                            width: '4px',
                            backgroundColor: 'currentColor',
                            borderRadius: '2px',
                            animation: 'music-bar 1.2s ease-in-out infinite 0.1s'
                        }}></div>
                        <div style={{
                            width: '4px',
                            backgroundColor: 'currentColor',
                            borderRadius: '2px',
                            animation: 'music-bar 0.8s ease-in-out infinite 0.2s'
                        }}></div>
                    </div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '28px', height: '28px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                    </svg>
                )}
            </button>

            {/* Next Track Button - Only visible when playing */}
            {isPlaying && (
                <button
                    onClick={skipToNextTrack}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backdropFilter: 'blur(12px)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        background: 'rgba(31, 31, 31, 0.6)',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        position: 'absolute',
                        left: 'calc(100% - 10px)', // Position to the right of the play button
                        marginLeft: '16px',
                        zIndex: 1
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.color = '#F9A8D4';
                        e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    aria-label="다음 곡 재생"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            )}

            <style>{`
                @keyframes music-bar {
                    0%, 100% { height: 8px; }
                    50% { height: 20px; }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 8px 32px rgba(236, 72, 153, 0.4); }
                    50% { box-shadow: 0 8px 40px rgba(236, 72, 153, 0.7); }
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
