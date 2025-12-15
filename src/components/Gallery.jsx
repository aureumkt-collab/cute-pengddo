import React, { useState, useCallback, useEffect } from 'react';
import assets from '../assets.json';

const EMOJIS = ['🐧', '💜', '✨', '💕', '🌟', '❄️', '💙', '🎀', '🦋', '🌸'];

// URL에서 image 파라미터 읽기
const getImageFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('image');
};

// URL에 image 파라미터 설정
const setImageToURL = (filename) => {
    const url = new URL(window.location.href);
    if (filename) {
        url.searchParams.set('image', filename);
        window.history.pushState({ image: filename }, '', url.toString());
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
                        Gallery
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
                                </div>
                            </div>
                        ))}
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
                >
                    <button
                        className="modal-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeModal();
                        }}
                    >
                        ✕
                    </button>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={`/assets/${selectedImage}`}
                            alt="Gallery preview"
                        />
                        <div className="modal-caption">
                            <div className="caption-content">
                                <span className="caption-icon">🐧</span>
                                <p>{CAPTIONS[selectedImage] || "귀여움이 세상을 구한다! ✨"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const CAPTIONS = {
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
    "1734390789549-5.jpg": "내 주머니에 쏙 넣고 다니고 싶어 🎒💕"
};

export default Gallery;
