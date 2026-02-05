import React, { useState } from 'react';
import { api } from '../services/api';
import './CreateGroupModal.css';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [joinMode, setJoinMode] = useState<'OPEN' | 'REQUEST' | 'INVITE_ONLY'>('OPEN');
    const [postMode, setPostMode] = useState<'OPEN_POSTING' | 'ADMIN_ONLY' | 'APPROVED_MEMBERS'>('ADMIN_ONLY');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            await api.post('/groups', {
                name,
                description,
                joinMode,
                postMode,
                creatorId: user.id
            });

            setName('');
            setDescription('');
            setJoinMode('OPEN');
            setPostMode('ADMIN_ONLY');
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create group');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create New Group</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Group Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter group name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter group description"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Join Mode *</label>
                        <select value={joinMode} onChange={(e) => setJoinMode(e.target.value as any)}>
                            <option value="OPEN">Open - Anyone can join</option>
                            <option value="REQUEST">Request - Approval required</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Post Mode *</label>
                        <select value={postMode} onChange={(e) => setPostMode(e.target.value as any)}>
                            <option value="OPEN_POSTING">Open Posting - All members can post</option>
                            <option value="ADMIN_ONLY">Admin Only - Only admins can post</option>
                            <option value="APPROVED_MEMBERS">Approved Members - Requires approval</option>
                        </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
