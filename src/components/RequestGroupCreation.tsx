import React, { useState } from 'react';
import { api } from '../services/api';
import './RequestGroupCreation.css';

interface RequestGroupCreationProps {
    onClose: () => void;
    onSuccess: () => void;
}

const RequestGroupCreation: React.FC<RequestGroupCreationProps> = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [joinMode, setJoinMode] = useState('REQUEST');
    const [postMode, setPostMode] = useState('ADMIN_ONLY');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // CREATE_GROUP doesn't need groupId
            await api.post('/requests', {
                type: 'CREATE_GROUP',
                groupId: null, // No group yet
                metadata: {
                    name,
                    description,
                    joinMode,
                    postMode
                }
            });

            alert('Group creation request submitted! Waiting for admin approval.');
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to submit request:', err);
            alert('Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Request New Group</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <label>Group Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter group name..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the purpose of this group..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Join Mode</label>
                        <select value={joinMode} onChange={(e) => setJoinMode(e.target.value)}>
                            <option value="OPEN">Open (Anyone can join)</option>
                            <option value="REQUEST">Request to Join</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Post Mode</label>
                        <select value={postMode} onChange={(e) => setPostMode(e.target.value)}>
                            <option value="OPEN_POSTING">Open Posting (Anyone can post)</option>
                            <option value="ADMIN_ONLY">Admin Only</option>
                            <option value="APPROVED_MEMBERS">Approved Members</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-submit">
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestGroupCreation;
