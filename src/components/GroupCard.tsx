import React from 'react';

interface GroupCardProps {
    id: string;
    name: string;
    description: string;
    joinMode: string; // OPEN, REQUEST, INVITE_ONLY
    isMember: boolean;
    onJoin?: () => void;
    onView?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ name, description, joinMode, isMember, onJoin, onView }) => {
    return (
        <div className="group-card">
            <div className="group-header">
                <h4>{name}</h4>
                <span className={`badge ${joinMode.toLowerCase()}`}>{joinMode.replace('_', ' ')}</span>
            </div>
            <p>{description}</p>
            <div className="group-actions">
                {isMember ? (
                    <button onClick={onView} className="btn-primary">View Channel</button>
                ) : (
                    <button onClick={onJoin} className="btn-secondary" disabled={joinMode === 'INVITE_ONLY'}>
                        {joinMode === 'INVITE_ONLY' ? 'Invite Only' : 'Join Group'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default GroupCard;
