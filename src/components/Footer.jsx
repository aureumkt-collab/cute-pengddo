import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--color-background)',
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
            padding: '40px 0 120px',
            textAlign: 'center',
            marginTop: 'auto'
        }}>
            <div className="container">
                <p style={{ fontSize: '0.9rem' }}>
                    © 2025 귀염부서 펭뚜. All rights reserved.
                </p>
                <p style={{
                    fontSize: '0.8rem',
                    marginTop: '8px',
                    opacity: 0.6
                }}>
                    Made with 💜
                </p>
            </div>
        </footer>
    );
};

export default Footer;
