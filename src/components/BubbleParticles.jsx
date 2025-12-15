import React, { useEffect, useRef } from 'react';

const BubbleParticles = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 물방울 생성 함수
        const createBubble = () => {
            const bubble = document.createElement('div');

            // 랜덤 크기 (8px ~ 30px)
            const size = Math.random() * 22 + 8;

            // 랜덤 수평 위치
            const left = Math.random() * 100;

            // 랜덤 지속 시간 (6s ~ 12s)
            const duration = Math.random() * 6 + 6;

            // 랜덤 지연 시간
            const delay = Math.random() * 2;

            // 랜덤 수평 흔들림
            const wobble = (Math.random() - 0.5) * 100;

            // 물방울 색상 (파스텔 톤 보라/핑크 계열)
            const colors = [
                'rgba(139, 92, 246, 0.25)',   // 보라
                'rgba(236, 72, 153, 0.2)',    // 핑크
                'rgba(167, 139, 250, 0.25)',  // 연보라
                'rgba(244, 114, 182, 0.2)',   // 연핑크
                'rgba(129, 140, 248, 0.2)',   // 인디고
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            bubble.style.cssText = `
                position: absolute;
                bottom: -${size}px;
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle at 30% 30%, 
                    rgba(255, 255, 255, 0.4), 
                    ${color});
                border-radius: 50%;
                pointer-events: none;
                animation: bubbleFloat ${duration}s ease-in-out ${delay}s forwards,
                           bubbleWobble ${duration / 3}s ease-in-out ${delay}s infinite;
                box-shadow: 
                    inset 0 -2px 4px rgba(255, 255, 255, 0.3),
                    inset 2px 2px 4px rgba(255, 255, 255, 0.4),
                    0 0 ${size / 2}px ${color};
                opacity: 0;
            `;

            // 커스텀 CSS 변수로 wobble 값 전달
            bubble.style.setProperty('--wobble', `${wobble}px`);

            container.appendChild(bubble);

            // 애니메이션 완료 후 제거
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.remove();
                }
            }, (duration + delay) * 1000);
        };

        // 초기 물방울들 생성
        for (let i = 0; i < 15; i++) {
            setTimeout(createBubble, i * 200);
        }

        // 주기적으로 새 물방울 생성
        const interval = setInterval(createBubble, 800);

        return () => {
            clearInterval(interval);
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        };
    }, []);

    return (
        <>
            <style>{`
                @keyframes bubbleFloat {
                    0% {
                        transform: translateY(0) translateX(0) scale(0.8);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                    }
                    80% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(var(--wobble)) scale(1.1);
                        opacity: 0;
                    }
                }
                
                @keyframes bubbleWobble {
                    0%, 100% {
                        margin-left: 0;
                    }
                    25% {
                        margin-left: 8px;
                    }
                    75% {
                        margin-left: -8px;
                    }
                }
            `}</style>
            <div
                ref={containerRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
        </>
    );
};

export default BubbleParticles;
