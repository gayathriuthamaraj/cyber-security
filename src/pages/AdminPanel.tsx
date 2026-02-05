import React, { useEffect, useState } from 'react';
import RequestList from '../components/RequestList'; // Fix import path if needed
import CreateGroupModal from '../components/CreateGroupModal';
import { api } from '../services/api'; // Assumption: api service exists/will be updated
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
    const [requests, setRequests] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not admin
        if (!isAdmin) {
            navigate('/dashboard');
            return;
        }
        fetchRequests();
    }, [isAdmin, navigate]);

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Placeholder for System Stats or other admin controls
    return (
        <div className="app-layout">
            <Sidebar isAdmin={true} onLogout={handleLogout} />
            <div className="main-content">
                <h2>Admin Control Center</h2>

                <section style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Group Management</h3>
                        <button
                            className="btn-primary"
                            onClick={() => setIsCreateModalOpen(true)}
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            + Create New Group
                        </button>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Create and manage community groups with custom join and posting permissions.
                    </p>
                </section>

                <section>
                    <h3>Pending Requests</h3>
                    <RequestList requests={requests} onReview={handleReview} />
                </section>

                <section>
                    <h3>System Overview</h3>
                    <p>Audit Logs can go here (reuse existing component)</p>
                </section>
            </div>

            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    alert('Group created successfully!');
                    // Optionally refresh groups list
                }}
            />
        </div>
    );
};

export default AdminPanel;
