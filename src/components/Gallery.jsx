import React, { useState, useCallback } from 'react';
import assets from '../assets.json';

const EMOJIS = ['🐧', '💜', '✨', '💕', '🌟', '❄️', '💙', '🎀', '🦋', '🌸'];

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [particles, setParticles] = useState([]);

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
            document.body.style.overflow = 'hidden';
        }, 50);
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
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
                        클릭하여 크게 보기
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
                    onClick={closeModal}
                >
                    <button
                        className="modal-close"
                        onClick={closeModal}
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
                    </div>
                </div>
            )}
        </>
    );
};

export default Gallery;
