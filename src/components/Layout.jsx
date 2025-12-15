import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, onApplyClick }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <Header onApplyClick={onApplyClick} />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
