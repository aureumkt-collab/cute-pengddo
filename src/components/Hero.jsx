import React from 'react';
import BubbleParticles from './BubbleParticles';

const Hero = () => {
    return (
        <section style={{
            padding: '120px 0 80px',
            textAlign: 'center',
            background: 'var(--gradient-dark)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Bubble Particles Background */}
            <BubbleParticles />

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
                <div style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid rgba(139, 92, 246, 0.5)',
                    boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(236, 72, 153, 0.2)'
                }} className="animate-float animate-glow">
                    <img
                        src="/assets/1764841628723.jpg"
                        alt="Pengddo Profile"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '700',
                    marginBottom: '16px',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    펭뚜의 갤러리
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    maxWidth: '500px',
                    margin: '0 auto 48px',
                    lineHeight: '1.8'
                }}>
                    귀여운 순간들을 담은 특별한 공간
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
                    onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    갤러리 보기
                </button>
            </div>
        </section>
    );
};

export default Hero;
