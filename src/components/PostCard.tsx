import React from 'react';

interface PostCardProps {
    title: string;
    content: string; // This is actually ciphertext but if decrypted maybe passed as clear?
    // For now assuming we display what we have, logic for decrypt/verify is outside or inside
    authorName: string;
    authorRoleLabel: string;
    timestamp: number;
    signature: string;
    isVerified: boolean;
    isEncrypted: boolean;
    onDecrypt?: () => void;
    decryptedContent?: string;
}

const PostCard: React.FC<PostCardProps> = ({
    title, content, authorName, authorRoleLabel, timestamp,
    isVerified, isEncrypted, onDecrypt, decryptedContent
}) => {

    return (
        <div className={`post-card ${authorRoleLabel === 'Admin' ? 'admin-post' : ''}`}>
            <div className="post-header">
                <span className="author-name">{authorName}</span>
                <span className="author-role">{authorRoleLabel}</span>
                <span className="timestamp">{new Date(timestamp).toLocaleString()}</span>
            </div>

            <div className="post-body">
                <h5>{title}</h5>
                {decryptedContent ? (
                    <div className="post-content decrypted">
                        {decryptedContent}
                        <div className="status-micro">🔓 Decrypted</div>
                    </div>
                ) : (
                    <div className="post-content encrypted">
                        <pre>{content.substring(0, 50)}...</pre>
                        {isEncrypted && (
                            <button onClick={onDecrypt} className="btn-small">
                                🔐 Decrypt Content
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="post-footer">
                {isVerified && <span className="verified-badge">✔ Verified Signature</span>}
            </div>
        </div>
    );
};

export default PostCard;
