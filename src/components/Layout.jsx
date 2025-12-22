import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, hideHeader = false }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            {!hideHeader && <Header />}
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
