import React from 'react';

interface RequestItem {
    id: string;
    type: string; // GROUP_CREATE, GROUP_JOIN, POST_CONTENT
    requesterName: string;
    targetGroupName?: string; // If available or derived
    status: string;
    payload: any;
    createdAt: number;
}

interface RequestListProps {
    requests: RequestItem[];
    onReview: (id: string, action: 'APPROVE' | 'REJECT') => void;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onReview }) => {
    if (requests.length === 0) {
        return <div className="empty-state">No pending requests.</div>;
    }

    return (
        <div className="request-list">
            {requests.map(req => (
                <div key={req.id} className="request-item">
                    <div className="req-info">
                        <strong>{req.type.replace('_', ' ')}</strong>
                        <span> by {req.requesterName}</span>
                        {req.targetGroupName && <span> for {req.targetGroupName}</span>}
                        <br />
                        <small>{new Date(req.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="req-content">
                        {req.type === 'GROUP_CREATE' && (
                            <div>New Group: {req.payload.name} ({req.payload.joinMode})</div>
                        )}
                        {req.type === 'POST_CONTENT' && (
                            <div>Post: {req.payload.title}</div>
                        )}
                    </div>
                    <div className="req-actions">
                        <button className="btn-success" onClick={() => onReview(req.id, 'APPROVE')}>Approve</button>
                        <button className="btn-danger" onClick={() => onReview(req.id, 'REJECT')}>Reject</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RequestList;
