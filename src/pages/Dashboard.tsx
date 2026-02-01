import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/auth.service';

interface User {
    username: string;
    role: 'admin' | 'faculty' | 'student';
}

interface Group {
    id: string;
    name: string;
    adminIds: string[];
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    authorName: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Forms
    const [newGroupName, setNewGroupName] = useState('');
    const [annTitle, setAnnTitle] = useState('');
    const [annContent, setAnnContent] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadGroups(parsedUser.username);
    }, [navigate]);

    const loadGroups = async (username: string) => {
        try {
            const data = await dataService.getGroups(username);
            setGroups(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadAnnouncements = async (groupId: string) => {
        if (!user) return;
        try {
            const data = await dataService.getAnnouncements(user.username, groupId);
            setAnnouncements(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        await dataService.createGroup(user.username, newGroupName);
        setNewGroupName('');
        loadGroups(user.username);
    };

    const handleCreateAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedGroup) return;
        await dataService.createAnnouncement(user.username, selectedGroup.id, annTitle, annContent);
        setAnnTitle(''); setAnnContent('');
        loadAnnouncements(selectedGroup.id);
    };

    const selectGroup = (group: Group) => {
        setSelectedGroup(group);
        if (user) loadAnnouncements(group.id);
    };

    if (!user) return <div>Loading...</div>;

    const roleColor = user.role === 'admin' ? '#ef4444' : user.role === 'faculty' ? '#f59e0b' : '#3b82f6';

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>University Dashboard</h1>
                <div style={{ textAlign: 'right' }}>
                    <h3>{user.username}</h3>
                    <span style={{
                        background: roleColor,
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                        {user.role.toUpperCase()}
                    </span>
                    <button
                        onClick={() => { localStorage.clear(); navigate('/'); }}
                        style={{ display: 'block', marginTop: '0.5rem', background: 'transparent', border: '1px solid white', padding: '4px 8px' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                {/* LEFT: Groups List */}
                <div className="auth-container" style={{ textAlign: 'left', padding: '1.5rem', height: 'fit-content' }}>
                    <h3>Groups</h3>

                    {user.role === 'admin' && (
                        <form onSubmit={handleCreateGroup} style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            <input
                                placeholder="New Group Name"
                                value={newGroupName}
                                onChange={e => setNewGroupName(e.target.value)}
                                style={{ width: '100%', marginBottom: '0.5rem' }}
                            />
                            <button type="submit" style={{ width: '100%' }}>+ Create Group</button>
                        </form>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {groups.map(g => (
                            <div
                                key={g.id}
                                onClick={() => selectGroup(g)}
                                style={{
                                    padding: '10px',
                                    background: selectedGroup?.id === g.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                    color: selectedGroup?.id === g.id ? '#0f172a' : 'white',
                                    borderRadius: '8px', cursor: 'pointer'
                                }}
                            >
                                {g.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Content Area */}
                <div className="auth-container" style={{ textAlign: 'left', padding: '2rem', minHeight: '400px' }}>
                    {!selectedGroup ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                            Select a group to view announcements
                        </div>
                    ) : (
                        <>
                            <h2 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                {selectedGroup.name}
                            </h2>

                            {/* Post Announcement: ADMIN or FACULTY */}
                            {(user.role === 'admin' || user.role === 'faculty') && (
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                                    <h4>Post Announcement (Encrypted)</h4>
                                    <form onSubmit={handleCreateAnnouncement}>
                                        <input
                                            placeholder="Title"
                                            value={annTitle} onChange={e => setAnnTitle(e.target.value)}
                                            style={{ width: '100%', marginBottom: '0.5rem' }}
                                        />
                                        <textarea
                                            placeholder="Content..."
                                            value={annContent} onChange={e => setAnnContent(e.target.value)}
                                            style={{
                                                width: '100%', minHeight: '80px', marginBottom: '0.5rem',
                                                background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px', padding: '12px', color: 'white'
                                            }}
                                        />
                                        <button type="submit">Post</button>
                                    </form>
                                </div>
                            )}

                            {/* Announcements List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {announcements.length === 0 && <p style={{ color: '#94a3b8' }}>No announcements yet.</p>}
                                {announcements.map(a => (
                                    <div key={a.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{a.title}</h4>

                                            {/* DELETE Button: ADMIN ONLY */}
                                            {user.role === 'admin' && (
                                                <button style={{
                                                    padding: '2px 8px', fontSize: '0.7rem', background: '#ef4444',
                                                    marginLeft: '10px', height: 'fit-content'
                                                }}>
                                                    Delete
                                                </button>
                                            )}

                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto' }}>
                                                {new Date(a.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{a.content}</p>
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                            Posted by {a.authorName} {a.content === '[Decryption Failed]' ? '(Error)' : '🔒'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
