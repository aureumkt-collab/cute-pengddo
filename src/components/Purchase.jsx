import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localMallItems } from '../data/mallItems';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CreditCard, ShoppingBag, CheckCircle2 } from 'lucide-react';

const Purchase = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const found = localMallItems.find(item => String(item.id) === String(productId));
        setProduct(found);
        window.scrollTo(0, 0);

        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/mall');
        }
    }, [productId, user, navigate]);

    const handlePurchase = () => {
        setIsLoading(true);

        // 가짜 로딩 시뮬레이션 (2초)
        setTimeout(() => {
            setIsLoading(false);
            setIsPurchased(true);
        }, 2000);
    };

    if (!product) return null;

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface)',
                gap: '24px'
            }}>
                <div style={{
                    position: 'relative',
                    width: '120px',
                    height: '120px',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    <span style={{ fontSize: '80px' }}>🐧</span>
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '10px',
                        background: 'rgba(0,0,0,0.1)',
                        borderRadius: '50%',
                        filter: 'blur(4px)',
                        animation: 'shadowPulse 3s ease-in-out infinite'
                    }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: 'var(--color-primary)',
                        marginBottom: '8px'
                    }}>
                        펭뚜가 결제 중...
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                        잠시만 기다려주세요! ✨
                    </p>
                </div>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes shadowPulse {
                        0%, 100% { width: 60px; opacity: 1; }
                        50% { width: 40px; opacity: 0.5; }
                    }
                `}</style>
            </div>
        );
    }

    if (isPurchased) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface)',
                padding: '20px'
            }}>
                <div style={{
                    maxWidth: '480px',
                    width: '100%',
                    background: 'white',
                    padding: window.innerWidth <= 480 ? '40px 24px' : '60px 40px',
                    borderRadius: window.innerWidth <= 480 ? '24px' : '40px',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    animation: 'scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 30px',
                        color: 'white'
                    }}>
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px', color: '#1a1a1a' }}>주문 완료!</h2>
                    <p style={{ color: '#4a4a4a', marginBottom: '40px', lineHeight: '1.6', fontWeight: '500' }}>
                        성공적으로 주문되었습니다.<br />
                        펭뚜와 헤펭이가 곧 찾아갈게요! 🐧✨
                    </p>
                    <button
                        onClick={() => navigate('/mall')}
                        style={{
                            width: '100%',
                            padding: '18px',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'var(--color-primary)',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            padding: window.innerWidth <= 768 ? '24px 0 60px' : '40px 0 100px',
            animation: 'fadeIn 0.6s ease-out'
        }}>
            <div className="container">
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '32px'
                    }}
                >
                    <ArrowLeft size={24} />
                    결제 취소
                </button>

                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px'
                }}>
                    {/* Order Summary */}
                    <div style={{
                        background: 'white',
                        padding: window.innerWidth <= 480 ? '24px' : '32px',
                        borderRadius: window.innerWidth <= 480 ? '24px' : '32px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                    }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px', color: '#1a1a1a' }}>
                            <ShoppingBag size={24} color="var(--color-primary)" />
                            주문 상품
                        </h3>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'center' }}>
                            <img
                                src={`/assets/${product.image}`}
                                alt={product.name}
                                style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }}
                            />
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px', color: '#1a1a1a' }}>{product.name}</h4>
                                <p style={{ color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>{product.tag}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#4a4a4a', fontWeight: '500' }}>
                                <span>상품 금액</span>
                                <span>{product.price}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#4a4a4a', fontWeight: '500' }}>
                                <span>배송비</span>
                                <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>무료 (직접 배송)</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                                paddingTop: '20px',
                                borderTop: '2px solid var(--color-surface)',
                                fontSize: '1.5rem',
                                fontWeight: '900'
                            }}>
                                <span style={{ color: '#1a1a1a' }}>최종 결제 금액</span>
                                <span style={{ color: 'var(--color-primary)' }}>{product.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{
                            background: 'white',
                            padding: window.innerWidth <= 480 ? '24px' : '32px',
                            borderRadius: window.innerWidth <= 480 ? '24px' : '32px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                        }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: '800', marginBottom: '24px', color: '#1a1a1a' }}>
                                <CreditCard size={24} color="var(--color-primary)" />
                                결제 수단
                            </h3>
                            <div style={{
                                padding: '20px',
                                borderRadius: '16px',
                                border: '2px solid var(--color-primary)',
                                background: 'rgba(139, 92, 246, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontWeight: '600'
                            }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                                <span style={{ color: '#1a1a1a' }}>귀염수당 (보유: 99,999,999 P)</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePurchase}
                            style={{
                                width: '100%',
                                padding: '24px',
                                borderRadius: '24px',
                                border: 'none',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                fontSize: '1.25rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                boxShadow: '0 15px 30px rgba(139, 92, 246, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(139, 92, 246, 0.3)';
                            }}
                        >
                            결제하기
                        </button>

                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: '#666',
                            lineHeight: '1.6',
                            fontWeight: '500'
                        }}>
                            위 주문 내용을 확인하였으며 결제에 동의합니다.<br />
                            (본 서비스는 실제 결제가 이루어지지 않습니다.)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Purchase;
