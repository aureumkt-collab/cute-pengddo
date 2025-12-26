import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, ShoppingBag, Music } from 'lucide-react';

const MobileTabs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Only show on main routes
    const isMainPage = location.pathname === '/' || location.pathname === '/activity' || location.pathname === '/mall';

    if (!isMainPage) return null;

    const getActiveTab = () => {
        if (location.pathname === '/mall') return 'mall';
        if (location.pathname === '/activity') return 'activity';
        return 'home';
    };

    const activeTab = getActiveTab();

    const tabs = [
        { id: 'home', label: '뮤직', icon: <Music size={20} />, path: '/' },
        { id: 'activity', label: '활동 기록', icon: <Camera size={20} />, path: '/activity' },
        { id: 'mall', label: '귀염몰', icon: <ShoppingBag size={20} />, path: '/mall' }
    ];

    return (
        <div className="mobile-tabs-container">
            <div className="mobile-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`mobile-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => navigate(tab.path)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileTabs;
