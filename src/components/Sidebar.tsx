import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
    isAdmin: boolean;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Campus Board</h3>
            </div>
            <div className="sidebar-menu">
                <button className={`menu-item ${isActive('/dashboard')}`} onClick={() => navigate('/dashboard')}>
                    📂 My Groups
                </button>
                <button className={`menu-item ${isActive('/explore')}`} onClick={() => navigate('/explore')}>
                    🌍 Explore
                </button>
                {isAdmin && (
                    <button className={`menu-item ${isActive('/admin')}`} onClick={() => navigate('/admin')}>
                        🛡️ Admin Panel
                    </button>
                )}
            </div>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
