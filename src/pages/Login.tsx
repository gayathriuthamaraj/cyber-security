import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const [loginStep, setLoginStep] = useState(1); // 1: Creds, 2: OTP
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError(false);

        try {
            const res = await authService.login(username, password);

            if (res.token && res.user) {
                // Direct Success (e.g. Admin or legacy SFA)
                authLogin(res.user, res.token);
                setMessage('Login Successful! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 500);
            } else if (res.step === 'MFA_REQUIRED') {
                // Step 2: Show OTP Input
                setLoginStep(2);
                setMessage(res.message || 'Enter the code sent to your email.');
                setError(false);
            } else {
                setMessage(res.message); setError(true);
            }
        } catch (err) {
            setMessage('Login failed'); setError(true);
        }
    };

    const handleLoginVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError(false);

        try {
            const res = await authService.verifyOTP(username, otp);

            if (res.token && res.user) {
                authLogin(res.user, res.token);
                setMessage('MFA Verified! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 500);
            } else {
                setMessage(res.message || 'Invalid OTP'); setError(true);
            }
        } catch (err) {
            setMessage('Verification failed'); setError(true);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); setError(false);

        try {
            const res = await authService.register(username, email, password);
            if (res.id) { // User created
                setMessage('Account created! Please login.'); setError(false);
                setActiveTab('login');
                setPassword('');
            } else {
                setMessage(res.message); setError(true);
            }
        } catch (err) {
            setMessage('Registration failed'); setError(true);
        }
    };

    return (
        <div className="auth-container">
            <h2>Secure Portal</h2>

            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('login'); setMessage(''); setLoginStep(1); }}
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

            {activeTab === 'login' && loginStep === 1 && (
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

            {activeTab === 'login' && loginStep === 2 && (
                <form onSubmit={handleLoginVerifyOtp} className="input-group">
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        Enter 2FA Code
                    </p>
                    <input
                        type="text" placeholder="6-digit OTP"
                        value={otp} onChange={e => setOtp(e.target.value)} required autoFocus
                    />
                    <button type="submit">Verify Login</button>
                    <div
                        style={{ fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px', color: '#38bdf8' }}
                        onClick={() => { setLoginStep(1); setOtp(''); }}
                    >
                        Back to Credentials
                    </div>
                </form>
            )}

            {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="input-group">
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
                    <button type="submit">Create Account</button>
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
