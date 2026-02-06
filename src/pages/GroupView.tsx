import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EncryptionDetails from '../components/EncryptionDetails';
import RequestPermissionModal from '../components/RequestPermissionModal';
import './GroupView.css';

interface Post {
    id: string;
    title: string;
    content: string;
    authorName: string;
    authorId: string;
    timestamp: number;
    encryptedKey: string;
    iv: string;
    signature: string;
}

interface Group {
    id: string;
    name: string;
    description: string;
    postMode: string;
    joinMode: string;
    members: any[];
}

const GroupView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [modalType, setModalType] = useState<'BECOME_GROUP_ADMIN' | 'REQUEST_POST_ACCESS' | null>(null);
    const [isMember, setIsMember] = useState(false);
    const [isGroupAdmin, setIsGroupAdmin] = useState(false);
    const [permissions, setPermissions] = useState<string | null>(null);

    useEffect(() => {
        fetchGroupData();

        // Auto-refresh messages every 3 seconds
        const interval = setInterval(() => {
            fetchGroupData();
        }, 3000);

        return () => clearInterval(interval);
    }, [id, user?.id]); // Added user?.id to dependencies for membership check

    const fetchGroupData = async () => {
        try {
            const [groupRes, postsRes] = await Promise.all([
                api.get(`/groups/${id}`),
                api.get(`/groups/${id}/posts`)
            ]);
            setGroup(groupRes.data);
            setPosts(postsRes.data);

            // Use backend permission flags
            if (groupRes.data.currentUserPermissions) {
                setIsMember(groupRes.data.currentUserPermissions.isMember);
                setIsGroupAdmin(groupRes.data.currentUserPermissions.isGroupAdmin);
                setPermissions(groupRes.data.currentUserPermissions.permissions);
            } else {
                // Fallback (shouldn't happen with updated backend)
                const currentMember = groupRes.data.members?.find((m: any) => m.userId === user?.id);
                setIsMember(!!currentMember);
                setIsGroupAdmin(currentMember?.role === 'admin');
                setPermissions(currentMember?.permissions || (currentMember?.role === 'admin' ? 'admin' : 'member'));
            }
        } catch (err) {
            console.error('Failed to fetch group data:', err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await api.post(`/groups/${id}/posts`, {
                title: 'Message',
                content: newMessage,
                encryptedKey: 'demo-key',
                iv: 'demo-iv',
                signature: 'demo-sig'
            });

            setNewMessage('');
            fetchGroupData(); // Refresh immediately
        } catch (err: any) {
            console.error('Failed to send message:', err);
            alert(err.response?.data?.message || 'Failed to send message');
        }
    };

    if (!group) {
        return <div className="loading">Loading...</div>;
    }

    // Determine if user can post
    const canPost = isMember && (
        group.postMode === 'OPEN_POSTING' ||
        isGroupAdmin ||
        (group.postMode === 'APPROVED_MEMBERS' &&
            ['post_access', 'grant_access', 'admin', 'super_admin'].includes(permissions || 'member'))
    );

    return (
        <div className="group-view">
            <div className="chat-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <div className="group-info">
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                        <span className="member-count">{group.members?.length || 0} members</span>

                        {/* Request Post Access Button */}
                        {isMember && !canPost && group.postMode === 'APPROVED_MEMBERS' && (
                            <button
                                className="request-admin-btn" // Reuse style for now
                                onClick={() => {
                                    setModalType('REQUEST_POST_ACCESS');
                                    setShowPermissionModal(true);
                                }}
                            >
                                Request Posting Access
                            </button>
                        )}

                        {/* Request Admin Button */}
                        {isMember && !isGroupAdmin && (
                            <button
                                className="request-admin-btn"
                                onClick={() => {
                                    setModalType('BECOME_GROUP_ADMIN');
                                    setShowPermissionModal(true);
                                }}
                            >
                                Request Admin Role
                            </button>
                        )}

                        {isGroupAdmin && (
                            <button
                                className="manage-requests-btn"
                                onClick={() => navigate('/managed-groups')}
                                style={{
                                    marginLeft: '1rem',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Manage Group
                            </button>
                        )}
                    </div>
                </div>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>

            {/* Admin Management Panel Removed - Moved to ManagedGroups page */}


            <div className="chat-messages">
                {!isMember ? (
                    <div className="not-member-notice">
                        <h3>You are not a member of this group</h3>
                        <p>Please request to join to view messages</p>
                    </div>
                ) : posts.length === 0 ? (
                    <p className="no-messages">No messages yet. Be the first to post!</p>
                ) : (
                    posts.map(post => {
                        const isOwnMessage = post.authorId === user?.id;
                        return (
                            <div key={post.id} className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
                                <div className="message-header">
                                    <strong>{post.authorName}</strong>
                                    <span className="timestamp">
                                        {new Date(post.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="message-content">
                                    {post.content}
                                </div>

                                <EncryptionDetails
                                    encryptedKey={post.encryptedKey}
                                    iv={post.iv}
                                    signature={post.signature}
                                    content={post.content}
                                    authorName={post.authorName}
                                    isOwnMessage={isOwnMessage}
                                />
                            </div>
                        );
                    })
                )}
            </div>

            {isMember && (
                <div className="chat-input-area">
                    {canPost ? (
                        <form onSubmit={handleSendMessage} className="message-form">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="message-input"
                            />
                            <button type="submit" className="send-button">
                                Send
                            </button>
                        </form>
                    ) : (
                        <div className="posting-restricted-notice">
                            {group.postMode === 'ADMIN_ONLY' && (
                                <>
                                    <span className="icon">🔒</span>
                                    <span>Only group admins can post announcements in this group</span>
                                </>
                            )}
                            {group.postMode === 'APPROVED_MEMBERS' && (
                                <>
                                    <span className="icon">⚠️</span>
                                    <span>Only approved members can post in this group</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {showPermissionModal && group && modalType && (
                <RequestPermissionModal
                    groupId={group.id}
                    groupName={group.name}
                    type={modalType}
                    onClose={() => setShowPermissionModal(false)}
                    onSuccess={() => fetchGroupData()}
                />
            )}
        </div>
    );
};

export default GroupView;
