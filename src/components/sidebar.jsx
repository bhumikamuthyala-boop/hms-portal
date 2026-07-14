import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Menu layout mapping matching your active routes
    const menuItems = [
        { name: '🏥 Dashboard', path: '/dashboard' },
        { name: '📅 OP Appointments', path: '/appointments' },
        { name: '🔍 Master Registry', path: '/registry' },
        { name: '👥 Staff Roles', path: '/roles' },
        { name: '🛏️ Admissions', path: '/admissions' },
        { name: '💳 Billing Desk', path: '/billing' },
        { name: '👨‍⚕️ Doctors Directory', path: '/doctors' },
        // 🔥 FIX: ADDED MASTER LEDGER ENTRY HERE
        { name: '📋 Master Audit Ledger', path: '/master-ledger' }
    ];

    const handleNavigation = (path) => {
        // Forces React Router to seamlessly swap screens without reloading the page context
        navigate(path);
    };

    return (
        <div style={sidebarContainerStyle}>
            <div style={logoAreaStyle}>
                <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '0.5px' }}>HMS Portal</h2>
                <span style={{ fontSize: '11px', color: '#a3b1cc' }}>v1.0.4 Premium</span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            style={{
                                ...menuItemButtonStyle,
                                backgroundColor: isActive ? '#2d3748' : 'transparent',
                                color: isActive ? '#fff' : '#cbd5e0',
                                fontWeight: isActive ? '600' : '400'
                            }}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            <div style={footerStyle}>
                <button onClick={() => navigate('/')} style={logoutButtonStyle}>
                    🚪 System Sign Out
                </button>
            </div>
        </div>
    );
}

// --- CLEAN STRUCTURAL UI STYLES ---
const sidebarContainerStyle = {
    width: '240px',
    backgroundColor: '#1a202c',
    color: '#fff',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 100
};

const logoAreaStyle = {
    padding: '25px 20px',
    borderBottom: '1px solid #2d3748',
    marginBottom: '20px'
};

const menuItemButtonStyle = {
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'block'
};

const footerStyle = {
    marginTop: 'auto',
    padding: '20px',
    borderTop: '1px solid #2d3748'
};

const logoutButtonStyle = {
    width: '100%',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
};