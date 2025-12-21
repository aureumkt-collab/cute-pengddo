import React, { useEffect, useRef } from 'react';

const SnowParticles = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const createSnowflake = () => {
            const snowflake = document.createElement('div');

            // Random size (10px ~ 25px)
            const size = Math.random() * 15 + 10;
            // Random horizontal position
            const left = Math.random() * 100;
            // Random duration (8s ~ 15s)
            const duration = Math.random() * 7 + 8;
            // Random delay
            const delay = Math.random() * 5;
            // Random horizontal wobble
            const wobble = (Math.random() - 0.5) * 200;

            snowflake.innerHTML = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                top: -30px;
                left: ${left}%;
                font-size: ${size}px;
                color: rgba(255, 255, 255, 0.8);
                pointer-events: none;
                animation: snowFall ${duration}s linear ${delay}s forwards;
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
                opacity: 0;
            `;

            snowflake.style.setProperty('--wobble', `${wobble}px`);

            container.appendChild(snowflake);

            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.remove();
                }
            }, (duration + delay) * 1000);
        };

        // Initial snow
        for (let i = 0; i < 20; i++) {
            setTimeout(createSnowflake, i * 300);
        }

        // Periodic snow
        const interval = setInterval(createSnowflake, 500);

        return () => {
            clearInterval(interval);
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        };
    }, []);

    return (
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
    );
};

export default SnowParticles;
