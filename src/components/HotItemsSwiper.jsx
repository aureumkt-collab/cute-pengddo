import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HotItemsSwiper = ({ items }) => {
    const handleClick = () => {
        alert('준비중입니다. ✨');
    };

    return (
        <div style={{
            marginBottom: '64px',
            animation: 'fadeIn 1s ease-out'
        }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <span style={{ fontSize: '2rem' }}>🔥</span>
                HOT 한 상품들
            </h2>

            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1.3}
                centeredSlides={false}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2.3,
                    },
                    1024: {
                        slidesPerView: 3.3,
                    }
                }}
                className="hot-swiper"
                style={{
                    paddingBottom: '50px'
                }}
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div
                            onClick={handleClick}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(139, 92, 246, 0.1)',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.15)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                            }}
                        >
                            <div style={{
                                width: '100%',
                                paddingTop: '75%',
                                position: 'relative',
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
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '16px',
                                    background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
                                    color: 'white',
                                    padding: '6px 16px',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    fontWeight: '800',
                                    boxShadow: '0 4px 10px rgba(255, 75, 43, 0.3)',
                                    zIndex: 2
                                }}>
                                    HOT
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h3 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    marginBottom: '8px',
                                    color: '#2d3436',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>{item.name}</h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        fontSize: '1.15rem',
                                        fontWeight: '800',
                                        color: 'var(--color-primary)'
                                    }}>{item.price}</span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style>{`
                .hot-swiper .swiper-pagination-bullet-active {
                    background: var(--color-primary) !important;
                }
            `}</style>
        </div>
    );
};

export default HotItemsSwiper;
