import React from 'react';

const Header = ({ onApplyClick }) => {
    return (
        <header style={{
            padding: '16px 0',
            background: 'rgba(15, 15, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--color-border)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div className="logo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    fontFamily: 'var(--font-heading)',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    cursor: 'pointer'
                }}
                    onClick={() => window.location.reload()}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid var(--color-primary)',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                    }}>
                        <img
                            src="/assets/1764841628723.jpg"
                            alt="Pengddo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    귀염부서 펭뚜
                </div>
                <nav>
                    <ul style={{
                        display: 'flex',
                        gap: '32px',
                        listStyle: 'none'
                    }}>
                        <li>
                            <button
                                onClick={onApplyClick}
                                style={{
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    color: 'var(--color-text)',
                                    background: 'var(--gradient-primary)',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
                                }}
                            >
                                🐧 귀염부서 지원
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
