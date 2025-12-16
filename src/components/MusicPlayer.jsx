import React, { useState, useEffect, useRef } from 'react';

// 플레이리스트 정의
const playlist = ['/bgm.mp3', '/bgm2.mp3'];

const LYRICS = `[Verse 1]
안녕! 나는 펭뚜야 (뚜뚜)
귀염부서 팀장 소수 인형
호기심 백만 개 눈 반짝반짝
세상 모든 게 신기해 항상 여섯 살!

[Pre-Chorus]
아빠~ 아빠~~ 어디 있어요? (찾는다 뚜뚜)
아빠만 바라보는 귀염둥이
오늘도 내 귀여움 충전 완료!
모두에게 힐링을 줄게 (큐트 파워!)

[Chorus]
랄랄라 펭뚜 (귀여워!) 랄랄라 펭뚜 (사랑스러워!)
온 동네 귀여움은 내가 다 맡아!
작지만 세상 제일 큰 행복
펭뚜와 함께라면 매일이 즐거워!
헤-펭-이! (멍~) 거기서 뭐 해?

[Verse 2]
헤펭이는 항상 멍 때리지 (멍청미!)
펭뚜 옆에선 늘 티격태격 짝꿍
"야! 펭뚜! (흥칫뿡)" 말만 그래도
사실 제일 친한 우리 둘

[Pre-Chorus]
아빠~ 아빠~~ 배고파요! (냠냠 뚜뚜)
밥 먹을 때도 귀여움 발사!
매일매일 귀여움 만렙 찍는 중
이 모습 그대로가 힐링 그 자체!

[Chorus]
랄랄라 펭뚜 (귀여워!) 랄랄라 펭뚜 (사랑스러워!)
온 동네 귀여움은 내가 다 맡아!
작지만 세상 제일 큰 행복
펭뚜와 함께라면 매일이 즐거워!`;


const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [showLyrics, setShowLyrics] = useState(false);
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
                setShowLyrics(false); // 플레이 멈추면 가사창 닫기
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

            {/* Lyrics Button - Only visible when playing */}
            {isPlaying && (
                <button
                    onClick={() => setShowLyrics(!showLyrics)}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backdropFilter: 'blur(12px)',
                        border: showLyrics ? '2px solid rgba(236, 72, 153, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: showLyrics
                            ? '0 8px 32px rgba(236, 72, 153, 0.4)'
                            : '0 8px 32px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        background: showLyrics
                            ? 'rgba(236, 72, 153, 0.2)'
                            : 'rgba(31, 31, 31, 0.6)',
                        color: showLyrics ? '#F9A8D4' : '#9CA3AF',
                        cursor: 'pointer',
                        position: 'absolute',
                        right: 'calc(100% - 10px)',
                        marginRight: '16px',
                        zIndex: 1,
                        animation: showLyrics ? 'glow 2s ease-in-out infinite' : 'none'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        if (!showLyrics) {
                            e.currentTarget.style.color = '#F9A8D4';
                            e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        if (!showLyrics) {
                            e.currentTarget.style.color = '#9CA3AF';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }
                    }}
                    aria-label="가사 보기"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </button>
            )}

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

            {/* Lyrics Modal */}
            {showLyrics && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 80,
                        // left: 0,
                        width: '100%',
                        // height: '100%',
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                    onClick={() => setShowLyrics(false)}
                >
                    <div
                        style={{
                            background: 'rgba(30, 30, 30, 0.9)',
                            borderRadius: '20px',
                            padding: '40px 50px',
                            // maxWidth: '1200px',
                            minWidth: '400px',
                            minHeight: '600px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                            position: 'relative',
                            color: 'white',
                            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #F9A8D4, #F472B6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            🎵 펭뚜송 가사
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 0 60px 0'
                        }}>
                            {LYRICS.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                                const isHeader = line.startsWith('[') && line.endsWith(']');
                                return isHeader ? (
                                    <div key={index} style={{
                                        color: '#F9A8D4',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        marginTop: '16px',
                                        marginBottom: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        textShadow: '0 0 10px rgba(249, 168, 212, 0.5)'
                                    }}>
                                        {line.slice(1, -1)}
                                    </div>
                                ) : (
                                    <div key={index} style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(4px)',
                                        padding: '12px 20px',
                                        borderRadius: '20px',
                                        borderBottomLeftRadius: '4px',
                                        color: '#fff',
                                        maxWidth: '100%',
                                        lineHeight: '1.5',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        animation: `popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards`,
                                        animationDelay: `${Math.min(index * 0.05, 1.5)}s`
                                    }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                                            e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                                            e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)';
                                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(236, 72, 153, 0.2)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                        }}
                                    >
                                        {line}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
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
                @keyframes popIn {
                    0% { opacity: 0; transform: scale(0.5); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default MusicPlayer;
