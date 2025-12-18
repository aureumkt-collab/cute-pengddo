import React, { useState, useCallback, useEffect, useRef } from 'react';
import assets from '../assets.json';

const EMOJIS = ['🐧', '💜', '✨', '💕', '🌟', '❄️', '💙', '🎀', '🦋', '🌸'];

// URL에서 image 파라미터 읽기
const getImageFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('image');
};

// URL에 image 파라미터 설정
const setImageToURL = (filename, replace = false) => {
    const url = new URL(window.location.href);
    if (filename) {
        url.searchParams.set('image', filename);
        if (replace) {
            window.history.replaceState({ image: filename }, '', url.toString());
        } else {
            window.history.pushState({ image: filename }, '', url.toString());
        }
    } else {
        url.searchParams.delete('image');
        window.history.replaceState({}, '', url.toString());
    }
};

const EmojiParticle = ({ emoji, style }) => (
    <div style={{
        position: 'fixed',
        fontSize: '2rem',
        pointerEvents: 'none',
        zIndex: 1002,
        ...style
    }}>
        {emoji}
    </div>
);

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(() => getImageFromURL());
    const [particles, setParticles] = useState([]);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [slideDirection, setSlideDirection] = useState(null);

    // 스와이프 관련 ref
    const touchStartY = useRef(0);
    const touchCurrentY = useRef(0);
    const isDragging = useRef(false);

    // 현재 이미지 인덱스 가져오기
    const getCurrentIndex = useCallback(() => {
        if (!selectedImage) return -1;
        return assets.indexOf(selectedImage);
    }, [selectedImage]);

    // 다음 이미지로 이동
    const goToNextImage = useCallback(() => {
        const currentIndex = getCurrentIndex();
        if (currentIndex < assets.length - 1) {
            const nextImage = assets[currentIndex + 1];
            setSlideDirection('up');
            setIsTransitioning(true);
            setTimeout(() => {
                setSelectedImage(nextImage);
                setImageToURL(nextImage, true);
                setSlideDirection(null);
                setIsTransitioning(false);
            }, 300);
        }
    }, [getCurrentIndex]);

    // 이전 이미지로 이동
    const goToPrevImage = useCallback(() => {
        const currentIndex = getCurrentIndex();
        if (currentIndex > 0) {
            const prevImage = assets[currentIndex - 1];
            setSlideDirection('down');
            setIsTransitioning(true);
            setTimeout(() => {
                setSelectedImage(prevImage);
                setImageToURL(prevImage, true);
                setSlideDirection(null);
                setIsTransitioning(false);
            }, 300);
        }
    }, [getCurrentIndex]);

    // 터치 시작
    const handleTouchStart = useCallback((e) => {
        if (isTransitioning) return;
        touchStartY.current = e.touches[0].clientY;
        touchCurrentY.current = e.touches[0].clientY;
        isDragging.current = true;
    }, [isTransitioning]);

    // 터치 이동
    const handleTouchMove = useCallback((e) => {
        if (!isDragging.current || isTransitioning) return;
        touchCurrentY.current = e.touches[0].clientY;
        const diff = touchCurrentY.current - touchStartY.current;
        // 최대 100px까지만 오프셋 허용
        setSwipeOffset(Math.max(-100, Math.min(100, diff)));
    }, [isTransitioning]);

    // 터치 종료
    const handleTouchEnd = useCallback(() => {
        if (!isDragging.current || isTransitioning) return;
        isDragging.current = false;
        const diff = touchCurrentY.current - touchStartY.current;
        const threshold = 50;

        if (diff < -threshold) {
            // 위로 스와이프 -> 다음 이미지
            goToNextImage();
        } else if (diff > threshold) {
            // 아래로 스와이프 -> 이전 이미지
            goToPrevImage();
        }
        setSwipeOffset(0);
    }, [isTransitioning, goToNextImage, goToPrevImage]);

    // 마우스 드래그 시작
    const handleMouseDown = useCallback((e) => {
        if (isTransitioning) return;
        e.preventDefault();
        touchStartY.current = e.clientY;
        touchCurrentY.current = e.clientY;
        isDragging.current = true;
    }, [isTransitioning]);

    // 마우스 이동
    const handleMouseMove = useCallback((e) => {
        if (!isDragging.current || isTransitioning) return;
        touchCurrentY.current = e.clientY;
        const diff = touchCurrentY.current - touchStartY.current;
        setSwipeOffset(Math.max(-100, Math.min(100, diff)));
    }, [isTransitioning]);

    // 마우스 드래그 종료
    const handleMouseUp = useCallback(() => {
        if (!isDragging.current || isTransitioning) return;
        isDragging.current = false;
        const diff = touchCurrentY.current - touchStartY.current;
        const threshold = 50;

        if (diff < -threshold) {
            goToNextImage();
        } else if (diff > threshold) {
            goToPrevImage();
        }
        setSwipeOffset(0);
    }, [isTransitioning, goToNextImage, goToPrevImage]);

    // URL 변경 시 이미지 상태 동기화 (popstate)
    useEffect(() => {
        const handlePopState = () => {
            const imageFromURL = getImageFromURL();
            setSelectedImage(imageFromURL);
            document.body.style.overflow = imageFromURL ? 'hidden' : 'auto';
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // 초기 URL에 이미지가 있으면 body overflow 설정
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        }
    }, []);

    // 키보드 네비게이션
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                goToPrevImage();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                goToNextImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, goToPrevImage, goToNextImage]);

    const createParticles = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const newParticles = [];
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * 360;
            const velocity = 100 + Math.random() * 150;
            const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

            newParticles.push({
                id: Date.now() + i,
                emoji,
                startX: centerX,
                startY: centerY,
                angle,
                velocity,
                rotation: Math.random() * 360
            });
        }

        setParticles(newParticles);

        // Clear particles after animation
        setTimeout(() => setParticles([]), 1000);
    }, []);

    const openModal = (filename, e) => {
        createParticles(e);

        // Delay modal opening slightly for effect
        setTimeout(() => {
            setSelectedImage(filename);
            setImageToURL(filename);
            document.body.style.overflow = 'hidden';
        }, 50);
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
        // 뒤로가기로 URL 복원
        window.history.back();
    };

    return (
        <>
            {/* Emoji Particles */}
            {particles.map((particle) => {
                const radians = (particle.angle * Math.PI) / 180;
                const endX = Math.cos(radians) * particle.velocity;
                const endY = Math.sin(radians) * particle.velocity;

                return (
                    <EmojiParticle
                        key={particle.id}
                        emoji={particle.emoji}
                        style={{
                            left: particle.startX,
                            top: particle.startY,
                            animation: 'emojiExplode 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                            '--end-x': `${endX}px`,
                            '--end-y': `${endY}px`,
                            '--rotation': `${particle.rotation}deg`
                        }}
                    />
                );
            })}

            <style>{`
                @keyframes emojiExplode {
                    0% {
                        transform: translate(-50%, -50%) scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                        transform: translate(
                            calc(-50% + var(--end-x) * 0.7), 
                            calc(-50% + var(--end-y) * 0.7)
                        ) scale(1.5) rotate(var(--rotation));
                    }
                    100% {
                        transform: translate(
                            calc(-50% + var(--end-x)), 
                            calc(-50% + var(--end-y) + 50px)
                        ) scale(0.5) rotate(var(--rotation));
                        opacity: 0;
                    }
                }
            `}</style>

            <section id="gallery" className="section-padding" style={{
                background: 'var(--color-surface)'
            }}>
                <div className="container">
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '16px',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        펭뚜 놀이터
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        marginBottom: '48px'
                    }}>
                        클릭하여 귀여움 극대화
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        {assets.map((filename, index) => (
                            <div
                                key={index}
                                style={{
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    background: 'var(--color-surface-light)',
                                    border: '1px solid var(--color-border)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    animation: `slideUp 0.6s ease-out ${index * 0.05}s both`
                                }}
                                onClick={(e) => openModal(filename, e)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.2)';
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    paddingTop: '100%',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={`/assets/${filename}`}
                                        alt={`Gallery item ${index + 1}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    {/* 순서 표시 */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        backdropFilter: 'blur(4px)',
                                        color: 'white',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        zIndex: 1,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        pointerEvents: 'none'
                                    }}>
                                        {index + 1}
                                    </div>
                                    {/* 해시태그 오버레이 */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '24px 12px 10px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        letterSpacing: '0.02em'
                                    }}>
                                        {HASHTAGS[filename] || '#펭뚜 #귀여움'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* YouTube Section */}
                    <div style={{
                        marginTop: '64px',
                        textAlign: 'center',
                        animation: 'slideUp 0.6s ease-out 0.5s both'
                    }}>
                        <a
                            href="https://www.youtube.com/@pengddo"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '16px 32px',
                                background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '50px',
                                color: 'var(--color-text)',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                textDecoration: 'none',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 0, 0, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 0, 0, 0.2)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 0, 0, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                style={{ color: '#FF0000' }}
                            >
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span>펭뚜 YouTube 채널 구경하기</span>
                            <span style={{
                                fontSize: '1.2rem',
                                animation: 'float 2s ease-in-out infinite'
                            }}>🐧</span>
                        </a>
                        <p style={{
                            marginTop: '16px',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            더 많은 펭뚜의 귀여운 모습을 보러 오세요! ✨
                        </p>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedImage && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        e.stopPropagation();
                        closeModal();
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
                >
                    <style>{`
                        @keyframes slideOutUp {
                            from { transform: translateY(0); opacity: 1; }
                            to { transform: translateY(-100%); opacity: 0; }
                        }
                        @keyframes slideOutDown {
                            from { transform: translateY(0); opacity: 1; }
                            to { transform: translateY(100%); opacity: 0; }
                        }
                        .swipe-hint {
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                            color: rgba(255, 255, 255, 0.6);
                            font-size: 0.85rem;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            transition: opacity 0.3s;
                            pointer-events: none;
                        }
                        .swipe-hint.top {
                            top: 20px;
                        }
                        .swipe-hint.bottom {
                            bottom: 20px;
                        }
                        .swipe-arrow {
                            animation: bounce 1.5s ease-in-out infinite;
                        }
                        .swipe-arrow.up {
                            animation-name: bounceUp;
                        }
                        .swipe-arrow.down {
                            animation-name: bounceDown;
                        }
                        @keyframes bounceUp {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-5px); }
                        }
                        @keyframes bounceDown {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(5px); }
                        }
                    `}</style>

                    <button
                        className="modal-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeModal();
                        }}
                    >
                        ✕
                    </button>

                    {/* 이전 이미지 힌트 */}
                    {getCurrentIndex() > 0 && (
                        <div className="swipe-hint top">
                            <span className="swipe-arrow up">↑</span>
                            <span>스와이프하여 이전</span>
                        </div>
                    )}

                    {/* 이미지 인덱스 표시 */}
                    <div style={{
                        position: 'absolute',
                        top: '60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        background: 'rgba(0, 0, 0, 0.5)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        zIndex: 1001
                    }}>
                        {getCurrentIndex() + 1} / {assets.length}
                    </div>

                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            transform: `translateY(${swipeOffset}px)`,
                            transition: isTransitioning ? 'none' : (swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none'),
                            animation: slideDirection === 'up' ? 'slideOutUp 0.3s ease-out forwards' :
                                slideDirection === 'down' ? 'slideOutDown 0.3s ease-out forwards' : 'none',
                            userSelect: 'none'
                        }}
                    >
                        <img
                            src={`/assets/${selectedImage}`}
                            alt="Gallery preview"
                            draggable="false"
                            style={{ pointerEvents: 'none' }}
                        />
                        <div className="modal-caption">
                            <div className="caption-content">
                                <span className="caption-icon">🐧</span>
                                <p>{CAPTIONS[selectedImage] || "귀여움이 세상을 구한다! ✨"}</p>
                            </div>
                        </div>
                    </div>

                    {/* 다음 이미지 힌트 */}
                    {getCurrentIndex() < assets.length - 1 && (
                        <div className="swipe-hint bottom">
                            <span>스와이프하여 다음</span>
                            <span className="swipe-arrow down">↓</span>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

const CAPTIONS = {
    "bojagi_pengddo.jpg": "보자기에 쏙! 선물 배달 왔어요 🎁",
    "1764841628723.jpg": "오늘도 펭뚜와 함께 힐링 타임! 🐧✨",
    "20251031_230027.jpg": "귀여움이 세상을 구한다... 아마도? 💖",
    "20251019_143807.jpg": "눈이 마주친 순간, 심쿵! 😍",
    "20251019_143009.jpg": "펭뚜의 하루는 오늘도 평화로워요 🌸",
    "20250915_115627.jpg": "작고 소중한 나의 친구 🎀",
    "20250628_112253.jpg": "어디서 타는 냄새 안 나요? 내 마음이 불타고 있잖아요 🔥💕",
    "20250513_072019.jpg": "너에게 빠져드는 시간, 3초 전! ⏰💘",
    "20250412_095919.jpg": "반짝반짝 빛나는 펭뚜의 매력 ✨",
    "20250302_145435.jpg": "이 구역의 귀여움 대장은 나야 나! 😎🐧",
    "20250215_133336.jpg": "사랑스러움 한도 초과! 삐- 삐- 🚨💗",
    "20250127_183440.jpg": "기분이 우울할 땐 펭뚜를 보세요 🍬",
    "20250119_105351.jpg": "너만 보인단 말이야~ 🎶💞",
    "20250117_155954.jpg": "행복은 멀리 있지 않아요, 바로 여기! 🌈",
    "20250117_155719.jpg": "말랑말랑, 콕 찔러보고 싶은 귀여움 👉👈",
    "20250114_215318.jpg": "오늘 하루도 파이팅! 펭뚜가 응원해 💪✨",
    "20241230_200712.jpg": "꿈속에서도 만나고 싶은 비주얼 🌙💤",
    "1734390789549-5.jpg": "내 주머니에 쏙 넣고 다니고 싶어 🎒💕",
    "1637476468581-23.jpg": "우리 언제부터 칭구야?",
    "IMG_20221215_213800_076.jpg": "귀엽게 화 낼꺼야!"
};

const HASHTAGS = {
    "bojagi_pengddo.jpg": "#보자기 #선물 #깜찍",
    "1764841628723.jpg": "#힐링 #일상 #펭뚜",
    "20251031_230027.jpg": "#귀여움 #최고 #심쿵",
    "20251019_143807.jpg": "#눈맞춤 #설렘 #두근",
    "20251019_143009.jpg": "#평화 #하루 #일상",
    "20250915_115627.jpg": "#소중해 #최애 #친구",
    "20250628_112253.jpg": "#불타는맘 #사랑 #심장",
    "20250513_072019.jpg": "#빠져듬 #매력 #중독",
    "20250412_095919.jpg": "#반짝반짝 #빛나 #스타",
    "20250302_145435.jpg": "#귀염대장 #1등 #짱",
    "20250215_133336.jpg": "#사랑스러움 #한도초과 #삐삐",
    "20250127_183440.jpg": "#힐링 #행복 #기분업",
    "20250119_105351.jpg": "#너만보여 #사랑 #하트",
    "20250117_155954.jpg": "#행복 #무지개 #긍정",
    "20250117_155719.jpg": "#말랑 #부드러움 #귀요미",
    "20250114_215318.jpg": "#응원 #파이팅 #화이팅",
    "20241230_200712.jpg": "#꿈속 #달달 #비주얼",
    "1734390789549-5.jpg": "#포켓 #작고소중 #사랑해",
    "1637476468581-23.jpg": "#우리꽤친해요",
    "IMG_20221215_213800_076.jpg": "#귀엽게 #열받음"
};

export default Gallery;
