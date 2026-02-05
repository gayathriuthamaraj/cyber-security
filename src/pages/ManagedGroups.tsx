import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GroupAdminRequestPanel from '../components/GroupAdminRequestPanel';
import Sidebar from '../components/Sidebar';
import './ManagedGroups.css';

interface ManagedGroup {
    id: string;
    name: string;
    description: string;
    joinMode: string;
    postMode: string;
    members: any[];
}

const ManagedGroups = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState<ManagedGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    useEffect(() => {
        fetchManagedGroups();
    }, []);

    const fetchManagedGroups = async () => {
        try {
            setLoading(true);
            const res = await api.get('/groups/managed');
            setGroups(res.data);
        } catch (err) {
            console.error('Failed to fetch managed groups:', err);
        } finally {
            setLoading(false);
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
                <div className="managed-groups-container">
                    <div className="header">
                        <h2>My Communities</h2>
                        <p>Manage the groups you created or administer.</p>
                    </div>

                    {loading ? (
                        <div className="loading">Loading your groups...</div>
                    ) : groups.length === 0 ? (
                        <div className="no-groups">
                            <p>You are not managing any groups yet.</p>
                            <button className="create-btn" onClick={() => navigate('/dashboard')}>
                                Create a Group via Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="groups-list">
                            {groups.map(group => (
                                <div key={group.id} className="managed-group-card">
                                    <div className="group-info">
                                        <h3>{group.name}</h3>
                                        <p>{group.description}</p>
                                        <div className="metrics">
                                            <span>{group.joinMode === 'REQUEST' ? 'Request Only' : group.joinMode === 'INVITE_ONLY' ? 'Invite Only' : 'Open'}</span>
                                            <span>{group.postMode.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="actions">
                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/groups/${group.id}`)}
                                        >
                                            View Group
                                        </button>
                                        <button
                                            className={`review-btn ${selectedGroupId === group.id ? 'active' : ''}`}
                                            onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
                                        >
                                            {selectedGroupId === group.id ? 'Close Requests' : 'Manage Requests'}
                                        </button>
                                    </div>

                                    {/* Expandable Request Panel */}
                                    {selectedGroupId === group.id && (
                                        <div className="expanded-requests">
                                            <GroupAdminRequestPanel
                                                groupId={group.id}
                                                isVisible={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagedGroups;
