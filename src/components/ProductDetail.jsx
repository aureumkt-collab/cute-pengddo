import React, { useEffect, useState } from 'react';
import { localMallItems } from '../data/mallItems';

const ProductDetail = ({ productId, onBack }) => {
    const [product, setProduct] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const found = localMallItems.find(item => item.id === productId);
        setProduct(found);
        setIsLoaded(true);
        window.scrollTo(0, 0);
    }, [productId]);

    if (!isLoaded) return null;
    if (!product) {
        return (
            <div style={{
                padding: '100px 20px',
                textAlign: 'center',
                color: 'var(--color-text-muted)'
            }}>
                <h2>상품을 찾을 수 없습니다. 🐧</h2>
                <button onClick={onBack} style={{
                    marginTop: '20px',
                    padding: '100px 20px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer'
                }}>목록으로 돌아가기</button>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            padding: '40px 0 100px',
            animation: 'fadeIn 0.6s ease-out'
        }}>
            <div className="container">
                {/* Back Button */}
                <button
                    onClick={onBack}
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
                        marginBottom: '32px',
                        padding: '8px 0',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary)';
                        e.currentTarget.style.transform = 'translateX(-5px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    뒤로가기
                </button>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '60px',
                    alignItems: 'start'
                }}>
                    {/* Image Section */}
                    <div style={{
                        position: 'relative',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                        aspectRatio: '1/1',
                        background: 'white'
                    }}>
                        <img
                            src={`/assets/${product.image}`}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '6px 18px',
                            borderRadius: '30px',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
                        }}>
                            {product.tag}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{
                        padding: '20px 0'
                    }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            marginBottom: '16px',
                            lineHeight: '1.2'
                        }}>{product.name}</h1>

                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: 'var(--color-primary)',
                            marginBottom: '32px',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '4px'
                        }}>
                            {product.price}
                        </div>

                        <div style={{
                            background: 'var(--color-surface-light)',
                            padding: '32px',
                            borderRadius: '24px',
                            border: '1px solid var(--color-border)',
                            marginBottom: '40px'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', color: 'var(--color-text-secondary)' }}>상품 설명</h3>
                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                color: 'var(--color-text-muted)',
                                whiteSpace: 'pre-line'
                            }}>
                                {product.detail || product.desc}
                            </p>
                        </div>

                        {/* Delivery Notice */}
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '20px',
                            background: 'rgba(245, 158, 11, 0.05)',
                            borderRadius: '16px',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            marginBottom: '40px'
                        }}>
                            <div style={{ fontSize: '1.5rem' }}>🚚</div>
                            <div>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>귀염배속 서비스</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                                    귀염부서 직원이 직접 문앞까지 배송! 펭뚜와 헤펭이가 초인종을 누르고 기다립니다.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                onClick={() => alert('수당이 부족해요! 열심히 응원해 주세요 ✨')}
                                style={{
                                    flex: 1,
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: 'var(--gradient-primary)',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(139, 92, 246, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
                                }}
                            >
                                구매하기
                            </button>
                            <button
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-surface-light)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
