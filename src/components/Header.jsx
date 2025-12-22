import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, loading, signInWithGoogle, signOut } = useAuth();

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
                alignItems: 'center',

            }}>
                <div className="logo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    fontFamily: 'var(--font-heading)',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    cursor: 'pointer'
                }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                    {document.body.classList.contains('christmas-theme') ? '🎄 펭뚜마스' : '귀염부서'}
                </div>
                <nav>
                    <ul style={{
                        display: 'flex',
                        gap: '16px',
                        listStyle: 'none',
                        alignItems: 'center'
                    }}>
                        <li>
                            {loading ? (
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }} />
                            ) : user ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '2px solid var(--color-accent)',
                                        boxShadow: '0 0 10px rgba(236, 72, 153, 0.4)'
                                    }}>
                                        <img
                                            src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                                            alt="프로필"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={signOut}
                                        style={{
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            color: 'var(--color-text-secondary)',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            padding: '8px 14px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={signInWithGoogle}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        color: 'var(--color-text)',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    로그인
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
