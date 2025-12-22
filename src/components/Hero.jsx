import React, { useState, useEffect, useCallback, useRef } from 'react';
import BubbleParticles from './BubbleParticles';
import SnowParticles from './SnowParticles';
import ChristmasTree from './ChristmasTree';
import assets from '../assets.json';
import MusicPlayer from './MusicPlayer';

const Hero = ({ onApplyClick }) => {
    // 현재 이미지 인덱스
    const [currentIndex, setCurrentIndex] = useState(() =>
        Math.floor(Math.random() * assets.length)
    );
    // 애니메이션 상태
    const [isAnimating, setIsAnimating] = useState(false);
    // 반짝이 파티클
    const [sparkles, setSparkles] = useState([]);

    // 랜덤으로 다음 이미지 선택 (현재와 다른 이미지)
    const getNextIndex = useCallback(() => {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * assets.length);
        } while (nextIndex === currentIndex && assets.length > 1);
        return nextIndex;
    }, [currentIndex]);

    // 반짝이 파티클 생성
    const createSparkles = useCallback(() => {
        const newSparkles = [];
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * 360;
            newSparkles.push({
                id: Date.now() + i,
                angle,
                delay: Math.random() * 0.3,
                size: Math.random() * 8 + 4
            });
        }
        setSparkles(newSparkles);
        setTimeout(() => setSparkles([]), 1000);
    }, []);

    // 5초마다 이미지 변경
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            createSparkles();

            // 애니메이션 중간에 이미지 변경
            setTimeout(() => {
                setCurrentIndex(getNextIndex());
            }, 400);

            // 애니메이션 종료
            setTimeout(() => {
                setIsAnimating(false);
            }, 800);
        }, 5000);

        return () => clearInterval(interval);
    }, [getNextIndex, createSparkles]);

    const [showMini, setShowMini] = useState(false);
    const playerRef = useRef(null);
    const [isChristmas, setIsChristmas] = useState(false);

    useEffect(() => {
        const checkIsChristmas = () => {
            const now = new Date();
            const month = now.getMonth() + 1;
            const date = now.getDate();
            return month === 12 && date >= 22 && date <= 25;
        };
        setIsChristmas(checkIsChristmas());
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (playerRef.current) {
                const rect = playerRef.current.getBoundingClientRect();
                setShowMini(rect.bottom < 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentImage = assets[currentIndex];

    return (
        <section style={{
            padding: '120px 0 80px',
            textAlign: 'center',
            background: 'var(--gradient-dark)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 애니메이션 스타일 */}
            <style>{`
                @keyframes heroImageFlip {
                    0% {
                        transform: perspective(1000px) rotateY(0deg) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: perspective(1000px) rotateY(90deg) scale(0.8);
                        opacity: 0.5;
                    }
                    100% {
                        transform: perspective(1000px) rotateY(0deg) scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes sparkleOut {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) translateX(var(--tx)) translateY(var(--ty)) scale(1);
                        opacity: 0;
                    }
                }
                
                @keyframes glowPulse {
                    0%, 100% {
                        box-shadow: 0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(236, 72, 153, 0.2);
                    }
                    50% {
                        box-shadow: 0 0 60px rgba(139, 92, 246, 0.6), 0 0 120px rgba(236, 72, 153, 0.4), 0 0 20px rgba(255, 255, 255, 0.3);
                    }
                }
                
                .hero-image-container {
                    transform-style: preserve-3d;
                }
                
                .hero-image-animating {
                    animation: heroImageFlip 0.8s ease-in-out, glowPulse 0.8s ease-in-out;
                }
            `}</style>

            {/* Seasonal Particles Background */}
            {isChristmas ? <SnowParticles /> : <BubbleParticles />}

            {/* Background glow effects */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* 이미지 컨테이너 */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    {/* 반짝이 파티클 */}
                    {sparkles.map((sparkle) => {
                        const rad = (sparkle.angle * Math.PI) / 180;
                        const distance = 100;
                        return (
                            <div
                                key={sparkle.id}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    width: sparkle.size,
                                    height: sparkle.size,
                                    background: 'linear-gradient(135deg, #fff, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.8))',
                                    borderRadius: '50%',
                                    '--tx': `${Math.cos(rad) * distance}px`,
                                    '--ty': `${Math.sin(rad) * distance}px`,
                                    animation: `sparkleOut 0.8s ease-out ${sparkle.delay}s forwards`,
                                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(139, 92, 246, 0.5)',
                                    zIndex: 10
                                }}
                            />
                        );
                    })}

                    {isChristmas ? (
                        /* 크리스마스 트리 */
                        <div style={{
                            width: '180px',
                            height: '180px',
                            marginTop: '-40px',
                            marginBottom: '60px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 40px rgba(255, 0, 0, 0.2))'
                        }}>
                            <ChristmasTree />
                        </div>
                    ) : (
                        /* 일반 펭도 이미지 */
                        <div
                            className={`hero-image-container ${isAnimating ? 'hero-image-animating' : ''}`}
                            style={{
                                width: '180px',
                                height: '180px',
                                margin: '0 auto 40px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '3px solid rgba(139, 92, 246, 0.5)',
                                boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(236, 72, 153, 0.2)'
                            }}
                        >
                            <img
                                src={`/assets/${currentImage}`}
                                alt="Pengddo Profile"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    )}
                </div>

                <div ref={playerRef}>
                    <MusicPlayer variant="hero" />
                </div>

                <h1 style={{
                    fontSize: '2.8rem',
                    fontWeight: '700',
                    marginBottom: '16px',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    귀염부서 놀이터
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-text-muted)',
                    maxWidth: '500px',
                    margin: '0 auto 48px',
                    lineHeight: '1.8'
                }}>
                    세상에 귀여움을 전파하는 공간
                </p>

                <button
                    style={{
                        padding: '14px 36px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                    }}
                    onClick={onApplyClick}
                >
                    입사지원
                </button>
            </div>
            {/* Mini Player */}
            <div style={{
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                zIndex: 2200,
                opacity: showMini ? 1 : 0,
                visibility: showMini ? 'visible' : 'hidden',
                transform: `translateX(-50%) translateY(${showMini ? '0' : '100px'})`,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: showMini ? 'auto' : 'none'
            }}>
                <MusicPlayer variant="mini" />
            </div>
        </section>
    );
};

export default Hero;
