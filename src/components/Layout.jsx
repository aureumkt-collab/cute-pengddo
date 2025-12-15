import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, onApplyClick, hideHeader = false }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            {!hideHeader && <Header onApplyClick={onApplyClick} />}
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
