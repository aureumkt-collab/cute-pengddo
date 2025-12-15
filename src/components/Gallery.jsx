import React, { useState } from 'react';
import assets from '../assets.json';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (filename) => {
        setSelectedImage(filename);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <>
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
                                onClick={() => openModal(filename)}
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
