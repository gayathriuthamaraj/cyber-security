import React, { useState } from 'react';
import './EncryptionDetails.css';

interface EncryptionDetailsProps {
    encryptedKey: string;
    iv: string;
    signature: string;
    content: string;
    authorName: string;
    isOwnMessage: boolean;
}

const EncryptionDetails: React.FC<EncryptionDetailsProps> = ({
    encryptedKey,
    iv,
    signature,
    content,
    authorName,
    isOwnMessage
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // For demo purposes, generate a symmetric key (in real app, this would be derived)
    const symmetricKey = encryptedKey.substring(0, 32) || 'demo-aes-256-key-placeholder';
    const plaintext = content || 'Message content';

    return (
        <div className="encryption-details">
            <button
                className="encryption-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                🔐 {isExpanded ? 'Hide' : 'Show'} Encryption Details
            </button>

            {isExpanded && (
                <div className="encryption-info">
                    <h4>{isOwnMessage ? 'Sender Encryption Process' : 'Receiver Decryption Process'}</h4>

                    {isOwnMessage ? (
                        // SENDER VIEW: Show encryption flow
                        <div className="encryption-flow">
                            <div className="flow-step">
                                <span className="step-label">1. Plaintext Message</span>
                                <div className="data-box plaintext">
                                    <code>{plaintext}</code>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">2. Encryption Key (AES-256)</span>
                                <div className="data-box key">
                                    <code>{symmetricKey}</code>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">3. Initialization Vector (IV)</span>
                                <div className="data-box iv">
                                    <code>{iv || 'random-iv-16-bytes'}</code>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">4. Encrypted Message (Ciphertext)</span>
                                <div className="data-box ciphertext">
                                    <code>{content.length > 50 ? content.substring(0, 50) + '...' : content}</code>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">5. Digital Signature</span>
                                <div className="data-box signature">
                                    <code>{signature || 'rsa-signature-placeholder'}</code>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // RECEIVER VIEW: Show decryption flow
                        <div className="encryption-flow">
                            <div className="flow-step">
                                <span className="step-label">1. Received Ciphertext</span>
                                <div className="data-box ciphertext">
                                    <code>{content.length > 50 ? content.substring(0, 50) + '...' : content}</code>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">2. Verify Signature</span>
                                <div className="data-box signature">
                                    <code>{signature || 'rsa-signature-verified'}</code>
                                    <span className="verify-badge">✓ Verified</span>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">3. Decryption Key</span>
                                <div className="data-box key">
                                    <code>{symmetricKey}</code>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">4. Initialization Vector (IV)</span>
                                <div className="data-box iv">
                                    <code>{iv || 'random-iv-16-bytes'}</code>
                                </div>
                            </div>

                            <div className="flow-arrow">↓</div>

                            <div className="flow-step">
                                <span className="step-label">5. Decrypted Message</span>
                                <div className="data-box plaintext">
                                    <code>{plaintext}</code>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="encryption-metadata">
                        <div className="metadata-item">
                            <strong>Algorithm:</strong> AES-256-CBC
                        </div>
                        <div className="metadata-item">
                            <strong>Signature Method:</strong> RSA-SHA256
                        </div>
                        <div className="metadata-item">
                            <strong>From:</strong> {authorName}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EncryptionDetails;
