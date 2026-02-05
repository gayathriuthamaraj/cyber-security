import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import GroupCard from '../components/GroupCard';
import Sidebar from '../components/Sidebar';
import RequestGroupCreation from '../components/RequestGroupCreation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [myGroups, setMyGroups] = useState<any[]>([]);
    const [showRequestModal, setShowRequestModal] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchGroups();
    }, [user, navigate]);

    const fetchGroups = async () => {
        try {
            const res = await api.get('/groups');
            // Filter groups where user is a member
            const filtered = res.data.filter((group: any) =>
                group.members && group.members.some((m: any) => m.userId === user?.id)
            );
            setMyGroups(filtered);
        } catch (err) {
            console.error('Failed to fetch groups', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="app-layout">
            <Sidebar isAdmin={false} onLogout={handleLogout} />
            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>My Communities</h2>
                    <button
                        onClick={() => setShowRequestModal(true)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        + Request New Group
                    </button>
                </div>

                {myGroups.length === 0 ? (
                    <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
                        You haven't joined any groups yet. Visit <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => navigate('/explore')}>Explore</span> to find communities!
                    </p>
                ) : (
                    <div className="group-grid">
                        {myGroups.map(group => (
                            <GroupCard
                                key={group.id}
                                id={group.id}
                                name={group.name}
                                description={group.description}
                                joinMode={group.joinMode}
                                isMember={true}
                                onView={() => navigate(`/groups/${group.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showRequestModal && (
                <RequestGroupCreation
                    onClose={() => setShowRequestModal(false)}
                    onSuccess={() => fetchGroups()}
                />
            )}
        </div>
    );
};

export default Dashboard;
