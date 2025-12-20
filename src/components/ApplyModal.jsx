import React, { useState, useEffect } from 'react';

const ApplyModal = ({ onClose, onAgree }) => {
    const [showGiftModal, setShowGiftModal] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    const [agreements, setAgreements] = useState({
        terms1: false,
        terms2: false,
        terms3: false,
        terms4: false
    });

    const allAgreed = Object.values(agreements).every(v => v);

    const handleCheckAll = () => {
        const newValue = !allAgreed;
        setAgreements({
            terms1: newValue,
            terms2: newValue,
            terms3: newValue,
            terms4: newValue
        });
    };

    const handleCheck = (key) => {
        setAgreements(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const agreementItems = [
        {
            key: 'terms1',
            title: '귀염부서 활동 동의',
            content: '본인은 귀염부서 펭뚜의 일원으로서 언제 어디서나 귀여움을 전파하고, 주변 사람들에게 힐링을 선사하는 활동에 적극 참여할 것을 동의합니다.'
        },
        {
            key: 'terms2',
            title: '펭뚜 사랑 서약',
            content: '본인은 펭뚜를 진심으로 아끼고 사랑하며, 펭뚜의 모든 사진과 영상에 "귀엽다"라고 반응할 것을 서약합니다. 무반응은 허용되지 않습니다.'
        },
        {
            key: 'terms3',
            title: '귀여움 전파 의무 동의',
            content: '귀염부서 소속원은 최소 하루에 한 번 이상 펭뚜의 귀여움을 타인에게 자랑해야 하며, 이를 성실히 이행할 것을 동의합니다.'
        },
        {
            key: 'terms4',
            title: '영구 팬심 유지 동의',
            content: '본인은 귀염부서 탈퇴 후에도 펭뚜를 영원히 응원하고, 마음속에 펭뚜를 간직할 것을 약속합니다. 이 사랑은 소멸시효가 없습니다.'
        }
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            animation: 'fadeIn 0.3s ease-out',
            padding: '20px'
        }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--color-surface)',
                    borderRadius: '20px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    border: '1px solid var(--color-border)',
                    animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    marginBottom: '8px',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    🐧 귀염부서 지원하기
                </h2>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowGiftModal(true);
                    }}
                    style={{
                        display: 'block',
                        margin: '0 auto 16px',
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px dashed var(--color-primary)',
                        borderRadius: '20px',
                        color: 'var(--color-primary)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'var(--color-primary)';
                        e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--color-primary)';
                    }}
                >
                    🎁 입사선물 확인하기
                </button>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--color-text-muted)',
                    marginBottom: '20px',
                    fontSize: '0.95rem'
                }}>
                    아래 약관에 동의하시면 귀염부서의 일원이 될 수 있습니다
                </p>

                {/* Check All */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        background: 'var(--color-surface-light)',
                        borderRadius: '12px',
                        marginBottom: '16px',
                        cursor: 'pointer',
                        border: allAgreed ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        transition: 'all 0.3s ease'
                    }}
                    onClick={handleCheckAll}
                >
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: allAgreed ? 'none' : '2px solid var(--color-border)',
                        background: allAgreed ? 'var(--gradient-primary)' : 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                    }}>
                        {allAgreed && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                        전체 동의하기
                    </span>
                </div>

                {/* Individual Agreements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {agreementItems.map((item) => (
                        <div
                            key={item.key}
                            style={{
                                padding: '12px',
                                background: 'var(--color-background)',
                                borderRadius: '12px',
                                border: agreements[item.key] ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => handleCheck(item.key)}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    border: agreements[item.key] ? 'none' : '2px solid var(--color-border)',
                                    background: agreements[item.key] ? 'var(--gradient-primary)' : 'transparent',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                }}>
                                    {agreements[item.key] && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '6px', color: 'var(--color-text)' }}>
                                        {item.title}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                                        {item.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '14px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            background: 'var(--color-surface-light)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={onAgree}
                        disabled={!allAgreed}
                        style={{
                            flex: 2,
                            padding: '14px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            background: allAgreed ? 'var(--gradient-primary)' : 'var(--color-surface-light)',
                            color: allAgreed ? 'white' : 'var(--color-text-muted)',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: allAgreed ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s ease',
                            boxShadow: allAgreed ? '0 4px 20px rgba(139, 92, 246, 0.4)' : 'none'
                        }}
                    >
                        🐧 지원하기
                    </button>
                </div>
            </div>

            {/* Gift Image Modal */}
            {showGiftModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 3100,
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowGiftModal(false);
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowGiftModal(false)}
                            style={{
                                position: 'absolute',
                                top: '-70px',
                                right: '-10px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '50%',
                                color: 'white',
                                fontSize: '2.5rem',
                                width: '56px',
                                height: '56px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            ×
                        </button>
                        <img
                            src="/doc/goods.png"
                            alt="입사선물"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '70vh',
                                borderRadius: '16px',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                            }}
                        />
                        <p style={{
                            textAlign: 'center',
                            color: 'white',
                            marginTop: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                        }}>
                            🎁 신입사원에게만 증정되는 가상 선물 입니다!!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyModal;
