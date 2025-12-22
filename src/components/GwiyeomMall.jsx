import React from 'react';
import HotItemsSwiper from './HotItemsSwiper';

const GwiyeomMall = ({ mallItems, onProductClick }) => {
    // HOT 상품 데이터 필터링 하거나 따로 관리 (지금은 모든 아이템을 HOT으로 표시하거나 샘플링)
    const hotItems = mallItems.filter(item => item.tag === 'BEST' || item.tag === 'NEW');

    const handleClick = (id, e) => {
        e.stopPropagation();
        if (onProductClick) {
            onProductClick(id);
        } else {
            alert('수당이 부족해요! ✨');
        }
    };

    return (
        <div className="mall-content">
            {/* Mall Introduction Description */}
            <div style={{
                marginBottom: '24px',
                padding: '16px 20px',
                background: 'rgba(139, 92, 246, 0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.08)',
                animation: 'fadeIn 0.8s ease-out'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1rem' }}>🛍️</span>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text-muted)' }}>귀염몰 안내</h2>
                </div>
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: '500',
                    lineHeight: '1.5',
                    margin: 0
                }}>
                    귀염부서에서 운영하는 공식 쇼핑몰입니다.
                    응원을 통해 귀염수당 적립 시 구매하실 수 있습니다.
                    <div style={{ color: '#f59e0b', fontWeight: '700', marginTop: '8px' }}>
                        배송혜택 : *귀염부서 직원이 직접 문앞까지 배송해 드리고 펭뚜와 헤펭이가 초인종을 누르고 서 있습니다.
                    </div>
                </p>
            </div>

            {/* Top Area: HOT Items Swiper */}
            <HotItemsSwiper items={hotItems} onProductClick={onProductClick} />

            {/* All Items Grid */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                marginTop: '40px'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>추천 상품</h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '32px',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                {mallItems.map((item, index) => (
                    <div
                        key={item.id}
                        onClick={(e) => handleClick(item.id, e)}
                        style={{
                            background: 'var(--color-surface-light)',
                            borderRadius: '24px',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 30px 60px rgba(139, 92, 246, 0.15)';
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                        }}
                    >
                        {/* Tag */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '4px 14px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}>
                            {item.tag}
                        </div>

                        {/* Product Image */}
                        <div style={{
                            width: '100%',
                            paddingTop: '80%',
                            position: 'relative',
                            overflow: 'hidden',
                            background: '#f8f9fa'
                        }}>
                            <img
                                src={`/assets/${item.image}`}
                                alt={item.name}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        </div>

                        {/* Product Info */}
                        <div style={{ padding: '24px' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '8px',
                                color: 'var(--color-text)'
                            }}>{item.name}</h3>
                            <p style={{
                                color: 'var(--color-text-muted)',
                                fontSize: '0.9rem',
                                lineHeight: '1.6',
                                marginBottom: '20px'
                            }}>{item.desc}</p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '800',
                                    color: 'var(--color-primary)'
                                }}>{item.price}</span>
                                <button
                                    onClick={(e) => handleClick(item.id, e)}
                                    style={{
                                        background: 'var(--color-text)',
                                        color: 'var(--color-surface)',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'var(--color-text)'}
                                >
                                    구매하기
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Coming Soon Message */}
                <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    marginTop: '40px',
                    padding: '60px',
                    borderRadius: '32px',
                    background: 'rgba(139, 92, 246, 0.03)',
                    border: '2px dashed var(--color-border)',
                    animation: 'fadeIn 1s ease-out'
                }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: '16px' }}>✨</div>
                    <h4 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>더 많은 굿즈가 준비 중이에요!</h4>
                    <p style={{ color: 'var(--color-text-muted)' }}>펭뚜의 귀여운 굿즈들을 곧 만나보실 수 있습니다. 기대해 주세요! 🐧</p>
                </div>
            </div>
        </div>
    );
};

export default GwiyeomMall;
