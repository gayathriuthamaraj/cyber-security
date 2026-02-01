import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import GroupCard from '../components/GroupCard';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Explore: React.FC = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const res = await api.get('/groups');
        setGroups(res.data);
    };

    const handleJoin = async (id: string, joinMode: string) => {
        if (joinMode === 'INVITE_ONLY') return;
        try {
            await api.post(`/groups/${id}/join`);
            alert('Joined or Requested!');
            // Refresh logic
        } catch (err) {
            alert('Join failed');
        }
    };

    return (
        <div className="app-layout">
            <Sidebar isAdmin={false} onLogout={() => navigate('/')} />
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
                            isMember={false} // Assume false for explore
                            onJoin={() => handleJoin(group.id, group.joinMode)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explore;
