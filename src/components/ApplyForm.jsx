import React, { useState } from 'react';

const ApplyForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        loveLevel: '',
        reason: '',
        promise: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section style={{
                minHeight: 'calc(100vh - 200px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 20px',
                background: 'var(--color-surface)'
            }}>
                <div style={{
                    textAlign: 'center',
                    animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                    <div style={{
                        fontSize: '6rem',
                        marginBottom: '24px',
                        animation: 'float 2s ease-in-out infinite'
                    }}>
                        🎉🐧🎉
                    </div>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '16px',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        축하합니다!
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '32px',
                        lineHeight: '1.8'
                    }}>
                        {formData.nickname || formData.name}님, 귀염부서 펭뚜의 일원이 되셨습니다!<br />
                        오늘부터 펭뚜와 함께 귀여움을 전파해주세요 💜
                    </p>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '14px 40px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            background: 'var(--gradient-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                        }}
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </section>
        );
    }

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        fontSize: '1rem',
        background: 'var(--color-background)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        color: 'var(--color-text)',
        outline: 'none',
        transition: 'all 0.3s ease'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: 'var(--color-text)'
    };

    return (
        <section style={{
            minHeight: 'calc(100vh - 200px)',
            padding: '60px 20px',
            background: 'var(--color-surface)'
        }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '48px'
                }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        🐧 귀염부서 지원서
                    </h1>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '1rem'
                    }}>
                        펭뚜와 함께할 당신에 대해 알려주세요!
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{
                    background: 'var(--color-surface-light)',
                    padding: '32px',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>이름 *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="실명을 입력해주세요"
                            required
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>닉네임 (선택)</label>
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="귀염부서에서 사용할 닉네임"
                            style={inputStyle}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>펭뚜 사랑 레벨 *</label>
                        <select
                            name="loveLevel"
                            value={formData.loveLevel}
                            onChange={handleChange}
                            required
                            style={{
                                ...inputStyle,
                                cursor: 'pointer'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                        >
                            <option value="">선택해주세요</option>
                            <option value="좋아요">💕 좋아요</option>
                            <option value="많이 좋아요">💜 많이 좋아요</option>
                            <option value="진심으로 사랑해요">💖 진심으로 사랑해요</option>
                            <option value="펭뚜 없이 못 살아요">🐧 펭뚜 없이 못 살아요</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>지원 동기 *</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="귀염부서에 지원하게 된 이유를 알려주세요"
                            required
                            rows={4}
                            style={{
                                ...inputStyle,
                                resize: 'vertical',
                                minHeight: '120px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={labelStyle}>펭뚜에게 한마디</label>
                        <textarea
                            name="promise"
                            value={formData.promise}
                            onChange={handleChange}
                            placeholder="펭뚜에게 하고 싶은 말을 자유롭게 작성해주세요"
                            rows={3}
                            style={{
                                ...inputStyle,
                                resize: 'vertical',
                                minHeight: '100px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '14px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                background: 'var(--color-background)',
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
                            type="submit"
                            style={{
                                flex: 2,
                                padding: '14px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 25px rgba(139, 92, 246, 0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                            }}
                        >
                            🐧 지원하기
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ApplyForm;
