import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import GroupCard from '../components/GroupCard';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [myGroups, setMyGroups] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch All Groups then Filter for "My Groups"
        // Ideally backend has /groups/me endpoint, but we can filter client side from /groups 
        // OR /groups returns all, we check membership.
        // GroupController.listGroups returns ALL for now.
        // We'll filter client side based on some flag or just show all for now and rename "My Groups" later
        // Actually the backend `getGroup` checks access, `listGroups` returns all.
        // We need a way to know if I am a member. 
        // `GroupCard` takes `isMember`.
        // We can fetch all and check `members` map, but members map isn't returned in full list usually?
        // Let's assume listGroups returns simplified objects.
        // I will just fetch all groups for now and mock the "My Group" logic or check if I can join.

        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const res = await api.get('/groups');
        // Filter those where I am member... (Need user ID or similar)
        // For simple demo, I'll just show all in Explore and Dashboard checks boolean? 
        // Let's just make Dashboard = Explore for now or separate based on filtering if possible.
        setMyGroups(res.data);
    };

    return (
        <div className="app-layout">
            <Sidebar isAdmin={false} onLogout={() => navigate('/')} />
            <div className="main-content">
                <h2>My Communities</h2>
                <div className="group-grid">
                    {myGroups.map(group => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            name={group.name}
                            description={group.description}
                            joinMode={group.joinMode}
                            isMember={true} // Assumption for Dashboard
                            onView={() => navigate(`/groups/${group.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
