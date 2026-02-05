import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './MyRequests.css';

interface PendingRequest {
    id: string;
    groupId: string;
    userId: string;
    type: 'JOIN' | 'BECOME_GROUP_ADMIN' | 'CREATE_GROUP' | 'POST';
    status: 'PENDING';
    metadata?: {
        userName?: string;
        reason?: string;
        name?: string;
        description?: string;
    };
    groupName?: string;
    createdAt?: string;
}

const MyRequests: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'JOIN' | 'BECOME_GROUP_ADMIN' | 'CREATE_GROUP'>('ALL');

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchMyRequests();
        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchMyRequests, 5000);
        return () => clearInterval(interval);
    }, [user, navigate]);

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/requests/my');
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch my requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const filteredRequests = requests.filter(req =>
        filter === 'ALL' || req.type === filter
    );

    const getRequestTypeLabel = (type: string) => {
        switch (type) {
            case 'JOIN': return 'Join Group';
            case 'BECOME_GROUP_ADMIN': return 'Admin Role Request';
            case 'CREATE_GROUP': return 'Create Group';
            case 'POST': return 'Post Request';
            default: return type;
        }
    };

    const getRequestTypeColor = (type: string) => {
        switch (type) {
            case 'JOIN': return '#4CAF50';
            case 'BECOME_GROUP_ADMIN': return '#2196F3';
            case 'CREATE_GROUP': return '#FF9800';
            case 'POST': return '#9C27B0';
            default: return '#757575';
        }
    };

    return (
        <div className="app-layout">
            <Sidebar isAdmin={false} onLogout={handleLogout} />
            <div className="main-content">
                <div className="my-requests-page">
                    <div className="my-requests-header">
                        <h1>My Requests</h1>
                        <p className="subtitle">Track all your pending requests across groups</p>
                    </div>

                    <div className="filter-bar">
                        <button
                            className={filter === 'ALL' ? 'active' : ''}
                            onClick={() => setFilter('ALL')}
                        >
                            All ({requests.length})
                        </button>
                        <button
                            className={filter === 'JOIN' ? 'active' : ''}
                            onClick={() => setFilter('JOIN')}
                        >
                            Join Requests ({requests.filter(r => r.type === 'JOIN').length})
                        </button>
                        <button
                            className={filter === 'BECOME_GROUP_ADMIN' ? 'active' : ''}
                            onClick={() => setFilter('BECOME_GROUP_ADMIN')}
                        >
                            Admin Requests ({requests.filter(r => r.type === 'BECOME_GROUP_ADMIN').length})
                        </button>
                        <button
                            className={filter === 'CREATE_GROUP' ? 'active' : ''}
                            onClick={() => setFilter('CREATE_GROUP')}
                        >
                            Create Group ({requests.filter(r => r.type === 'CREATE_GROUP').length})
                        </button>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading requests...</p>
                        </div>
                    )}

                    {!loading && filteredRequests.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No pending requests</h3>
                            <p>You don't have any pending requests at the moment.</p>
                        </div>
                    )}

                    {!loading && filteredRequests.length > 0 && (
                        <div className="requests-grid">
                            {filteredRequests.map(request => (
                                <div key={request.id} className="request-card">
                                    <div
                                        className="request-type-badge"
                                        style={{ backgroundColor: getRequestTypeColor(request.type) }}
                                    >
                                        {getRequestTypeLabel(request.type)}
                                    </div>

                                    <div className="request-content">
                                        {request.type === 'CREATE_GROUP' ? (
                                            <>
                                                <h3>{request.metadata?.name || 'New Group'}</h3>
                                                <p className="request-description">
                                                    {request.metadata?.description || 'No description provided'}
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <h3>{request.groupName || 'Unknown Group'}</h3>
                                                {request.metadata?.reason && (
                                                    <p className="request-reason">
                                                        <em>"{request.metadata.reason}"</em>
                                                    </p>
                                                )}
                                            </>
                                        )}

                                        <div className="request-meta">
                                            <span className="request-date">
                                                {request.createdAt
                                                    ? new Date(request.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : 'Recently'}
                                            </span>
                                            <span className="request-status-badge">Pending Review</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRequests;
