import React, { useEffect } from 'react';
import { X, Calendar, User } from 'lucide-react';

const NoticeModal = ({ notice, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!notice) return null;

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
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <div
                style={{
                    background: 'var(--color-surface)',
                    borderRadius: '24px',
                    padding: '32px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    border: '1px solid var(--color-border)',
                    animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: 'var(--color-text-muted)',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = 'var(--color-text)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                    }}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: 'var(--color-primary-light)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '16px'
                    }}>
                        🐧 공지사항
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            {notice.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} />
                            {notice.author}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    color: 'var(--color-text)',
                    lineHeight: '1.8',
                    fontSize: '1rem',
                    whiteSpace: 'pre-wrap',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    {notice.content}
                </div>

                {/* Footer Icon */}
                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    opacity: 0.3,
                    fontSize: '2rem'
                }}>
                    🐧
                </div>
            </div>
        </div>
    );
};

export default NoticeModal;
