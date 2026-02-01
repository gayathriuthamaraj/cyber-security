import React, { useEffect, useState } from 'react';

interface LogEntry {
    raw: string;
}

const AuditLog: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/data/logs', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="audit-log-widget" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '500px',
            marginTop: '20px',
            border: '1px solid #333',
            borderRadius: '8px',
            background: '#111',
            overflow: 'hidden'
        }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px',
                    cursor: 'pointer',
                    background: '#222',
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#aaa',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <h4 style={{ margin: 0 }}>📝 Live Audit Log</h4>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px', fontFamily: 'monospace', fontSize: '0.85em', color: '#0f0', textAlign: 'left' }}>
                    {loading && logs.length === 0 && <div style={{ color: '#888' }}>Refreshing...</div>}
                    {logs.length === 0 && !loading && <div style={{ color: '#888' }}>No logs found.</div>}
                    {logs.map((log, index) => (
                        <div key={index} style={{ marginBottom: '8px', borderBottom: '1px solid #222', paddingBottom: '4px', whiteSpace: 'pre-wrap' }}>
                            {log.raw}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuditLog;
