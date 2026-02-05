import React, { useState } from 'react';
import { api } from '../services/api';
import './RequestGroupCreation.css'; // Reusing existing styles

interface RequestPermissionModalProps {
    groupId: string;
    groupName: string;
    type: 'BECOME_GROUP_ADMIN' | 'REQUEST_POST_ACCESS';
    onClose: () => void;
    onSuccess: () => void;
}

const RequestPermissionModal: React.FC<RequestPermissionModalProps> = ({ groupId, groupName, type, onClose, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const title = type === 'BECOME_GROUP_ADMIN' ? 'Request Admin Role' : 'Request Posting Access';
    const explanation = type === 'BECOME_GROUP_ADMIN'
        ? 'Explain why you should be made an admin of this group...'
        : 'Explain why you want to post in this group...';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/requests', {
                groupId: groupId,
                type: type,
                metadata: {
                    reason
                }
            });

            alert('Request submitted! Waiting for approval.');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to submit request:', err);
            alert(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <label>Group</label>
                        <input
                            type="text"
                            value={groupName}
                            disabled
                            style={{
                                background: 'rgba(15, 23, 42, 0.5)',
                                color: '#94a3b8',
                                cursor: 'not-allowed'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Reason *</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={explanation}
                            rows={6}
                            required
                        />
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

export default RequestPermissionModal;
