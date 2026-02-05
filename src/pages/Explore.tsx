import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import GroupCard from '../components/GroupCard';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Explore: React.FC = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const navigate = useNavigate();
    const { user, isAdmin, logout } = useAuth();

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
            setGroups(res.data);
        } catch (err) {
            console.error('Failed to fetch groups', err);
        }
    };

    const handleJoin = async (id: string, joinMode: string) => {
        try {
            await api.post(`/groups/${id}/join`);
            if (joinMode === 'OPEN') {
                alert('Successfully joined the group!');
            } else if (joinMode === 'REQUEST') {
                alert('Join request submitted! Waiting for approval.');
            }
            fetchGroups(); // Refresh
        } catch (err: any) {
            alert(err.response?.data?.message || 'Join failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isUserMember = (group: any) => {
        return group.members && group.members.some((m: any) => m.userId === user?.id);
    };

    return (
        <div className="app-layout">
            <Sidebar isAdmin={isAdmin} onLogout={handleLogout} />
            <div className="main-content">
                <h2>Explore Communities</h2>
                <div className="group-grid">
                    {groups.map(group => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            name={group.name}
                            description={group.description}
                            joinMode={group.joinMode}
                            isMember={isUserMember(group)}
                            onJoin={() => handleJoin(group.id, group.joinMode)}
                            onView={() => navigate(`/groups/${group.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explore;
