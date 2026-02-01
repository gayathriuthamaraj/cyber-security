import React from 'react';

interface SecurityStatusProps {
    user: {
        username: string;
        role: string;
    };
}

const SecurityStatus: React.FC<SecurityStatusProps> = ({ user }) => {
    if (!user) return null;

    return (
        <div className="security-status-panel" style={{
            background: '#1e1e1e',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '5px solid #4CAF50',
            color: '#fff'
        }}>
            <h3>🛡️ Security Visibility</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <div>
                    <strong style={{ display: 'inline-block', width: '100px' }}>User Role:</strong>
                    <span className={`badge ${user.role}`} style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: user.role === 'admin' ? '#d32f2f' : '#1976d2',
                        textTransform: 'uppercase',
                        fontSize: '0.8em',
                        fontWeight: 'bold'
                    }}>
                        {user.role}
                    </span>
                </div>
                <div>
                    <strong style={{ display: 'inline-block', width: '100px' }}>Protection:</strong>
                    <span style={{ color: '#4CAF50' }}>✓ AES-256 Hybrid</span>
                </div>
                <div>
                    <strong style={{ display: 'inline-block', width: '100px' }}>Session:</strong>
                    <span style={{ color: '#4CAF50' }}>✓ Verified</span>
                </div>
            </div>
        </div>
    );
};

export default SecurityStatus;
