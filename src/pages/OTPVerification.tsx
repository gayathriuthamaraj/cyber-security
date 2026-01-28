import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const { username, email } = location.state || {};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError(false);

        try {
            const res = await authService.verifyOTP(username, otp);
            if (res.token) {
                setMessage('Login Successful! Redirecting...');
                // Simulate redirect to dashboard
                setTimeout(() => alert('Welcome to the Secure Dashboard!'), 500);
            } else {
                setMessage(res.message); setError(true);
            }
        } catch (err) {
            setMessage('Verification failed'); setError(true);
        }
    };

    if (!username) {
        return (
            <div className="auth-container">
                <p>Invalid session.</p>
                <button onClick={() => navigate('/')}>Back to Login</button>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h2>Two-Factor Auth</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                Enter the code sent to <br /><b style={{ color: 'white' }}>{email}</b>
            </p>

            <form onSubmit={handleSubmit} className="input-group">
                <input
                    type="text"
                    placeholder="6-Digit Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{ letterSpacing: '0.2rem', textAlign: 'center', fontSize: '1.2rem' }}
                />
                <button type="submit">Verify Login</button>
            </form>

            {message && (
                <div className={`message ${error ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default OTPVerification;
