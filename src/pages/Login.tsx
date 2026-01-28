import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const Login = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    // Flow States
    const [regStep, setRegStep] = useState(1); // 1: Details, 2: Verification
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError(false);

        try {
            const res = await authService.login(username, password);

            if (res.token) {
                // Direct Success (e.g. Admin)
                localStorage.setItem('user', JSON.stringify({ username: res.username, role: res.role }));
                setMessage('Login Successful! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 500);
            } else if (res.message === 'OTP sent to email') {
                navigate('/verify-otp', { state: { username, email: res.email } });
            } else {
                setMessage(res.message); setError(true);
            }
        } catch (err) {
            setMessage('Login failed'); setError(true);
        }
    };

    const handleRegisterInit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError(false);

        try {
            const res = await authService.initRegister(username, email, password);
            if (res.message.includes('OTP sent')) {
                setRegStep(2);
                setMessage('OTP sent to your email. Please verify.'); setError(false);
            } else {
                setMessage(res.message); setError(true);
            }
        } catch (err) {
            setMessage('Registration failed'); setError(true);
        }
    };

    const handleRegisterComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError(false);

        try {
            const res = await authService.completeRegister(email, otp);
            if (res.message === 'User registered successfully') {
                setMessage('Account created! Please login.'); setError(false);
                setRegStep(1);
                setActiveTab('login');
                // Clear fields
                setPassword(''); setOtp('');
            } else {
                setMessage(res.message); setError(true);
            }
        } catch (err) {
            setMessage('Verification failed'); setError(true);
        }
    };

    return (
        <div className="auth-container">
            <h2>Secure Portal</h2>

            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('login'); setMessage(''); }}
                >
                    Login
                </div>
                <div
                    className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('register'); setMessage(''); }}
                >
                    Sign Up
                </div>
            </div>

            {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="input-group">
                    <input
                        type="text" placeholder="Username"
                        value={username} onChange={e => setUsername(e.target.value)} required
                    />
                    <input
                        type="password" placeholder="Password"
                        value={password} onChange={e => setPassword(e.target.value)} required
                    />
                    <button type="submit">Sign In</button>
                </form>
            )}

            {activeTab === 'register' && regStep === 1 && (
                <form onSubmit={handleRegisterInit} className="input-group">
                    <input
                        type="text" placeholder="Username"
                        value={username} onChange={e => setUsername(e.target.value)} required
                    />
                    <input
                        type="email" placeholder="Email Address"
                        value={email} onChange={e => setEmail(e.target.value)} required
                    />
                    <input
                        type="password" placeholder="Password"
                        value={password} onChange={e => setPassword(e.target.value)} required
                    />
                    <button type="submit">Send Verification Code</button>
                </form>
            )}

            {activeTab === 'register' && regStep === 2 && (
                <form onSubmit={handleRegisterComplete} className="input-group">
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        We sent a code to <br /><b style={{ color: 'white' }}>{email}</b>
                    </p>
                    <input
                        type="text" placeholder="Enter Registration OTP"
                        value={otp} onChange={e => setOtp(e.target.value)} required
                    />
                    <button type="submit">Verify & Create Account</button>
                    <div
                        style={{ fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px', color: '#38bdf8' }}
                        onClick={() => setRegStep(1)}
                    >
                        Back to details
                    </div>
                </form>
            )}

            {message && (
                <div className={`message ${error ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Login;
