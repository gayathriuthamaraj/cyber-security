import React, { useEffect, useState } from 'react';
import RequestList from '../components/RequestList'; // Fix import path if needed
import { api } from '../services/api'; // Assumption: api service exists/will be updated
import Sidebar from '../components/Sidebar';

const AdminPanel: React.FC = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReview = async (id: string, action: 'APPROVE' | 'REJECT') => {
        try {
            await api.post(`/requests/${id}/review`, { action });
            fetchRequests(); // Refresh
        } catch (err) {
            alert('Action failed');
        }
    };

    // Placeholder for System Stats or other admin controls
    return (
        <div className="app-layout">
            <Sidebar isAdmin={true} onLogout={() => { }} />
            <div className="main-content">
                <h2>Admin Control Center</h2>

                <section>
                    <h3>Pending Requests</h3>
                    <RequestList requests={requests} onReview={handleReview} />
                </section>

                <section>
                    <h3>System Overview</h3>
                    <p>Audit Logs can go here (reuse existing component)</p>
                </section>
            </div>
        </div>
    );
};

export default AdminPanel;
