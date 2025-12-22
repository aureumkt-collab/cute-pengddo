import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const WelcomeChat = () => {
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [messageGroups, setMessageGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const localMessageGroups = [
        {
            id: 'initial',
            groupDelay: 500,
            displayDuration: 5000,
            messages: [
                { sender: '펭뚜 매니저', text: '펭~~하!!', type: 'manager', delay: 1000 },
                { sender: '헤펭이', text: '어, 누가 들어왔다!', type: 'hepeng', delay: 2500 },
                { sender: '펭뚜 매니저', text: '떤배님 잠시만요!', type: 'manager', delay: 2000 },
            ]
        }
    ];

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${ampm} ${formattedHours}:${formattedMinutes}`;
    };

    useEffect(() => {
        const fetchChats = async () => {
            const { data, error } = await supabase.from('welcome_chats').select('*').order('orders', { ascending: true });

            if (!error && data && data.length > 0) {
                const grouped = data.reduce((acc, chat) => {
                    const existingGroup = acc.find(g => g.id === chat.group_id);
                    if (existingGroup) {
                        existingGroup.messages.push(chat);
                    } else {
                        acc.push({
                            id: chat.group_id,
                            groupDelay: chat.group_delay || 500,
                            displayDuration: chat.display_duration || 5000,
                            messages: [chat]
                        });
                    }
                    return acc;
                }, []);
                setMessageGroups(grouped);
            } else {
                setMessageGroups(localMessageGroups);
            }
            setLoading(false);
        };
        fetchChats();
    }, []);

    useEffect(() => {
        if (loading || messageGroups.length === 0) return;

        let timeouts = [];

        const playGroup = async (groupIndex) => {
            if (groupIndex >= messageGroups.length) return;

            const group = messageGroups[groupIndex];

            const waitBeforeGroup = setTimeout(() => {
                setVisibleMessages([]);
                setIsVisible(true);

                let cumulativeDelay = 0;
                group.messages.forEach((msg, msgIndex) => {
                    cumulativeDelay += msg.delay;
                    const msgTimeout = setTimeout(() => {
                        setVisibleMessages(prev => [...prev, { ...msg, time: getCurrentTime() }]);

                        if (msgIndex === group.messages.length - 1) {
                            const hideTimeout = setTimeout(() => {
                                setIsVisible(false);
                                const resetTimeout = setTimeout(() => {
                                    setVisibleMessages([]);
                                    playGroup(groupIndex + 1);
                                }, 600);
                                timeouts.push(resetTimeout);
                            }, group.displayDuration);
                            timeouts.push(hideTimeout);
                        }
                    }, cumulativeDelay);
                    timeouts.push(msgTimeout);
                });
            }, group.groupDelay);

            timeouts.push(waitBeforeGroup);
        };

        playGroup(0);

        return () => {
            timeouts.forEach(t => clearTimeout(t));
        };
    }, [loading, messageGroups]);

    if (loading) return null;
    if (!isVisible && visibleMessages.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '140px',
            right: '24px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
            maxWidth: '280px',
            pointerEvents: 'none',
            transition: 'all 0.5s ease',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        }}>
            {visibleMessages.map((msg, index) => (
                <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 18px',
                    borderRadius: '20px 20px 4px 20px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#1a1a1a',
                    animation: 'chatSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                    transformOrigin: 'bottom right',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    position: 'relative',
                    fontWeight: '500'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                        gap: '12px'
                    }}>
                        <div style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            color: msg.type === 'manager' ? '#FF4D6D' : '#4361EE',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: msg.type === 'manager' ? '#FF4D6D' : '#4361EE'
                            }}></span>
                            {msg.sender}
                        </div>
                        <div style={{
                            fontSize: '9px',
                            color: '#999',
                            fontWeight: '400'
                        }}>
                            {msg.time}
                        </div>
                    </div>
                    {msg.text}
                </div>
            ))}
            <style>{`
                @keyframes chatSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.7) rotate(5deg);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1) rotate(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default WelcomeChat;
