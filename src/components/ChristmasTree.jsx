import React, { useState, useEffect } from 'react';

const ChristmasTree = () => {
    const [lights, setLights] = useState([]);

    // 트리 전구 위치 생성
    useEffect(() => {
        const generateLights = () => {
            const newLights = [];
            const colors = ['#ff0000', '#ffcc00', '#00ff00', '#00ccff', '#ff66cc', '#ff9900'];

            // 트리 각 층에 전구 배치
            const layers = [
                { y: 30, count: 3, spread: 25 },
                { y: 50, count: 5, spread: 45 },
                { y: 75, count: 7, spread: 65 },
                { y: 100, count: 9, spread: 85 },
                { y: 125, count: 7, spread: 70 },
            ];

            layers.forEach((layer, layerIndex) => {
                for (let i = 0; i < layer.count; i++) {
                    const xOffset = (i - (layer.count - 1) / 2) * (layer.spread / (layer.count - 1 || 1));
                    newLights.push({
                        id: `light-${layerIndex}-${i}`,
                        x: 90 + xOffset,
                        y: layer.y,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        delay: Math.random() * 2,
                        size: 6 + Math.random() * 4
                    });
                }
            });

            setLights(newLights);
        };

        generateLights();
    }, []);

    return (
        <div style={{

            width: '180px',
            height: '180px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <style>{`
                @keyframes twinkle {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                        box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
                    }
                    50% {
                        opacity: 0.4;
                        transform: scale(0.7);
                        box-shadow: 0 0 5px currentColor;
                    }
                }
                
                
            `}</style>

            {/* 트리 SVG */}
            <svg
                viewBox="0 0 180 180"
                style={{
                    width: '100%',
                    height: '100%',
                    animation: 'treeGlow 3s ease-in-out infinite'
                }}
            >
                {/* 트리 본체 - 다층 삼각형 */}
                <defs>
                    <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#228B22" />
                        <stop offset="50%" stopColor="#006400" />
                        <stop offset="100%" stopColor="#228B22" />
                    </linearGradient>
                    <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B4513" />
                        <stop offset="50%" stopColor="#A0522D" />
                        <stop offset="100%" stopColor="#8B4513" />
                    </linearGradient>
                    <radialGradient id="starGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff9c4" />
                        <stop offset="100%" stopColor="#ffd700" />
                    </radialGradient>
                </defs>

                {/* 트리 나무 줄기 */}
                <rect x="78" y="140" width="24" height="30" rx="3" fill="url(#trunkGradient)" />

                {/* 트리 층 1 (맨 위) */}
                <polygon
                    points="90,15 60,55 120,55"
                    fill="url(#treeGradient)"
                    stroke="#1a5c1a"
                    strokeWidth="1"
                />

                {/* 트리 층 2 */}
                <polygon
                    points="90,40 50,90 130,90"
                    fill="url(#treeGradient)"
                    stroke="#1a5c1a"
                    strokeWidth="1"
                />

                {/* 트리 층 3 (맨 아래) */}
                <polygon
                    points="90,70 35,140 145,140"
                    fill="url(#treeGradient)"
                    stroke="#1a5c1a"
                    strokeWidth="1"
                />

                {/* 별 */}
                <polygon
                    points="90,5 93,12 101,12 95,17 97,25 90,21 83,25 85,17 79,12 87,12"
                    fill="url(#starGradient)"
                    style={{ animation: 'starGlow 2s ease-in-out infinite' }}
                />

                {/* 장식 오너먼트 */}
                <circle cx="75" cy="60" r="5" fill="#ff0000" stroke="#cc0000" strokeWidth="1" />
                <circle cx="105" cy="65" r="5" fill="#ffd700" stroke="#ccaa00" strokeWidth="1" />
                <circle cx="60" cy="100" r="6" fill="#ff66cc" stroke="#cc4499" strokeWidth="1" />
                <circle cx="120" cy="95" r="6" fill="#00ccff" stroke="#0099cc" strokeWidth="1" />
                <circle cx="90" cy="85" r="5" fill="#ff9900" stroke="#cc7700" strokeWidth="1" />
                <circle cx="50" cy="130" r="7" fill="#9933ff" stroke="#7722cc" strokeWidth="1" />
                <circle cx="130" cy="125" r="7" fill="#00ff66" stroke="#00cc44" strokeWidth="1" />
                <circle cx="90" cy="120" r="6" fill="#ff0066" stroke="#cc0044" strokeWidth="1" />
                <circle cx="70" cy="130" r="5" fill="#00ccff" stroke="#0099cc" strokeWidth="1" />
                <circle cx="110" cy="135" r="5" fill="#ffcc00" stroke="#cc9900" strokeWidth="1" />

                {/* 선물 상자들 */}
                <rect x="40" y="155" width="25" height="20" rx="2" fill="#ff4444" stroke="#cc0000" strokeWidth="1" />
                <rect x="50" y="155" width="5" height="20" fill="#ffcc00" />
                <rect x="40" y="163" width="25" height="4" fill="#ffcc00" />

                <rect x="115" y="158" width="22" height="17" rx="2" fill="#4444ff" stroke="#0000cc" strokeWidth="1" />
                <rect x="124" y="158" width="4" height="17" fill="#ff66cc" />
                <rect x="115" y="165" width="22" height="3" fill="#ff66cc" />

                <rect x="75" y="162" width="30" height="13" rx="2" fill="#44cc44" stroke="#22aa22" strokeWidth="1" />
                <rect x="88" y="162" width="4" height="13" fill="#ffffff" />
                <rect x="75" y="167" width="30" height="3" fill="#ffffff" />
            </svg>

            {/* 반짝이는 전구들 */}
            {lights.map((light) => (
                <div
                    key={light.id}
                    style={{
                        position: 'absolute',
                        left: `${light.x}px`,
                        top: `${light.y}px`,
                        width: `${light.size}px`,
                        height: `${light.size}px`,
                        backgroundColor: light.color,
                        borderRadius: '50%',
                        color: light.color,
                        animation: `twinkle ${1 + Math.random()}s ease-in-out infinite`,
                        animationDelay: `${light.delay}s`,
                        zIndex: 10
                    }}
                />
            ))}
        </div>
    );
};

export default ChristmasTree;
