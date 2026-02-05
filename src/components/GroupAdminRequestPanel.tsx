import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface PendingRequest {
    id: string;
    userId: string;
    type: 'JOIN' | 'BECOME_GROUP_ADMIN' | 'REQUEST_POST_ACCESS';
    status: 'PENDING';
    metadata?: {
        userName?: string;
        reason?: string;
    };
    createdAt?: string;
}

interface GroupAdminRequestPanelProps {
    groupId: string;
    isVisible: boolean;
}

const GroupAdminRequestPanel: React.FC<GroupAdminRequestPanelProps> = ({ groupId, isVisible }) => {
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'ALL' | 'JOIN' | 'BECOME_GROUP_ADMIN' | 'REQUEST_POST_ACCESS'>('ALL');
    const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isVisible) {
            fetchRequests();
        }
    }, [groupId, isVisible]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/groups/${groupId}/requests`);
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (requestId: string, action: 'APPROVE' | 'REJECT', requestType: string) => {
        try {
            const permissionLevel = selectedPermissions[requestId];
            const payload: any = { action };

            // Add permission level for admin requests or join requests if specified
            if (requestType === 'BECOME_GROUP_ADMIN' || requestType === 'JOIN') {
                payload.permissionLevel = permissionLevel || (requestType === 'JOIN' ? 'member' : 'admin');
            }
            // For REQUEST_POST_ACCESS, permission is handled in backend (auto-set to post_access)

            await api.post(`/requests/${requestId}/review`, payload);
            await fetchRequests(); // Refresh the list
            alert(`Request ${action.toLowerCase()}d successfully!`);
        } catch (err: any) {
            console.error('Failed to review request:', err);
            alert(err.response?.data?.message || 'Failed to process request');
        }
    };

    if (!isVisible) return null;

    const filteredRequests = requests.filter(req =>
        filter === 'ALL' || req.type === filter
    );

    return (
        <div className="request-panel-container">
            <div className="request-panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h3>Pending Requests ({requests.length})</h3>
                    <button
                        onClick={fetchRequests}
                        className="refresh-btn"
                        title="Refresh Requests"
                        style={{
                            background: 'none',
                            border: '1px solid #475569',
                            color: '#e2e8f0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            padding: '4px 8px'
                        }}
                    >
                        ↻
                    </button>
                </div>
                <div className="request-filters">
                    <button
                        className={filter === 'ALL' ? 'active' : ''}
                        onClick={() => setFilter('ALL')}
                    >
                        All
                    </button>
                    <button
                        className={filter === 'JOIN' ? 'active' : ''}
                        onClick={() => setFilter('JOIN')}
                    >
                        Join
                    </button>
                    <button
                        className={filter === 'REQUEST_POST_ACCESS' ? 'active' : ''}
                        onClick={() => setFilter('REQUEST_POST_ACCESS')}
                    >
                        Post Access
                    </button>
                    <button
                        className={filter === 'BECOME_GROUP_ADMIN' ? 'active' : ''}
                        onClick={() => setFilter('BECOME_GROUP_ADMIN')}
                    >
                        Admin
                    </button>
                </div>
            </div>

            {loading && <div className="loading-text">Loading requests...</div>}

            {!loading && filteredRequests.length === 0 && (
                <div className="no-requests">
                    <p>No pending requests</p>
                </div>
            )}

            <div className="request-list">
                {filteredRequests.map(request => (
                    <div key={request.id} className="request-item">
                        <div className="request-info">
                            <div className="request-type-badge">
                                {request.type === 'JOIN' ? 'Join Request' :
                                    request.type === 'REQUEST_POST_ACCESS' ? 'Post Access Request' :
                                        'Admin Role Request'}
                            </div>
                            <div className="request-user">
                                <strong>{request.metadata?.userName || `User ${request.userId.slice(0, 8)}`}</strong>
                            </div>
                            {request.metadata?.reason && (
                                <div className="request-reason">
                                    <em>"{request.metadata.reason}"</em>
                                </div>
                            )}
                            {request.createdAt && (
                                <div className="request-timestamp">
                                    {new Date(request.createdAt).toLocaleString()}
                                </div>
                            )}

                            {/* Permission level selector for admin requests or join requests */}
                            {(request.type === 'BECOME_GROUP_ADMIN' || request.type === 'JOIN') && (
                                <div className="permission-selector">
                                    <label htmlFor={`permission-${request.id}`}>
                                        {request.type === 'BECOME_GROUP_ADMIN' ? 'Grant Permission Level:' : 'Assign Permission:'}
                                    </label>
                                    <select
                                        id={`permission-${request.id}`}
                                        value={selectedPermissions[request.id] || (request.type === 'JOIN' ? 'member' : 'admin')}
                                        onChange={(e) => setSelectedPermissions(prev => ({
                                            ...prev,
                                            [request.id]: e.target.value
                                        }))}
                                    >
                                        {request.type === 'JOIN' && (
                                            <>
                                                <option value="member">Member (View Only)</option>
                                                <option value="post_access">Post Access</option>
                                            </>
                                        )}
                                        {request.type === 'BECOME_GROUP_ADMIN' && (
                                            <>
                                                <option value="post_access">Post Access</option>
                                                <option value="grant_access">Grant Access (Approve Requests)</option>
                                                <option value="admin">Admin (Full Management)</option>
                                                <option value="super_admin">Super Admin (Can Add Admins)</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="request-actions">
                            <button
                                className="approve-btn"
                                onClick={() => handleReview(request.id, 'APPROVE', request.type)}
                            >
                                Approve
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => handleReview(request.id, 'REJECT', request.type)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupAdminRequestPanel;
