import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

const GroupView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const groupRes = await api.get(`/groups/${id}`);
            setGroup(groupRes.data);

            const postsRes = await api.get(`/groups/${id}/posts`);
            setPosts(postsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePost = async () => {
        try {
            // In a real app, generate key/iv/signature client-side here.
            // For now, sending cleartext "content" as placeholder for the "encrypted" flow or simplifiction
            // The backend expects: title, content, encryptedKey, iv, signature

            await api.post(`/groups/${id}/posts`, {
                title: newPostTitle,
                content: newPostContent, // This would be ciphertext
                encryptedKey: 'dummy-key',
                iv: 'dummy-iv',
                signature: 'dummy-sig'
            });

            setIsPosting(false);
            setNewPostTitle('');
            setNewPostContent('');
            alert('Post submitted (or pending approval)');
            loadData();
        } catch (err) {
            alert('Posting failed');
        }
    };

    if (!group) return <div>Loading...</div>;

    return (
        <div className="app-layout">
            <Sidebar isAdmin={false} onLogout={() => { /* Logout logic */ }} />
            <div className="main-content">
                <header className="group-view-header">
                    <h2>{group.name}</h2>
                    <p>{group.description}</p>
                    <button className="btn-primary" onClick={() => setIsPosting(!isPosting)}>
                        {isPosting ? 'Cancel' : 'New Post'}
                    </button>
                </header>

                {isPosting && (
                    <div className="posting-area">
                        <input
                            type="text"
                            placeholder="Title"
                            value={newPostTitle}
                            onChange={e => setNewPostTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Content..."
                            value={newPostContent}
                            onChange={e => setNewPostContent(e.target.value)}
                        />
                        <button onClick={handlePost}>Submit</button>
                    </div>
                )}

                <div className="timeline">
                    {posts.length === 0 ? <div className="empty">No posts yet.</div> :
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                title={post.title}
                                content={post.content}
                                authorName={post.authorName}
                                authorRoleLabel={post.authorRoleLabel}
                                timestamp={post.timestamp}
                                signature={post.signature}
                                isVerified={true} // Hardcoded for demo
                                isEncrypted={true}
                                onDecrypt={() => alert('Client-side decryption demo')}
                                decryptedContent={post.content} // Auto-decrypt for demo?
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default GroupView;
