import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'Admin') navigate('/admin');
            else if (user.role === 'Teacher') navigate('/teacher');
            else navigate('/');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', padding: '4rem 1rem', background: 'var(--bg-color)', width: '100%', overflowY: 'auto' }}>
            <div style={{ margin: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeIn 0.8s ease-out forwards', width: '100%' }}>
                    <img src="/institute_logo.jpg" alt="Institute Logo" style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', marginBottom: '1.5rem', display: 'inline-block' }} />
                    <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--text-main)', maxWidth: '850px', margin: '0 auto', lineHeight: '1.3' }}>Sardar Yaseen Malik Institute of Information Technology, Mirpurkhas</h1>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: '600', fontSize: '1rem' }}>Developed by Usama Ali <span style={{opacity:0.5}}>|</span> HOD Computer Symecs</p>
                </div>

                <div className="card" style={{ padding: '3rem', width: '100%', maxWidth: '550px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: '800', fontSize: '1.6rem', color: 'var(--text-main)' }}>Secure Access Portal</h2>
                    {error && <div style={{ color: 'var(--danger-text)', background: 'var(--danger-bg)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontWeight:'600', fontSize:'0.9rem' }}>{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="user@symecs.edu" 
                                className="input-field"
                                style={{ margin: 0, padding: '1rem', fontSize: '1rem', textAlign: 'center' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <label style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter your security password" 
                                className="input-field"
                                style={{ margin: 0, padding: '1rem', fontSize: '1rem', textAlign: 'center' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full" style={{ padding: '1.2rem', marginTop: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>Login to Dashboard</button>
                    </form>
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                    <p>Copyright © 2026 Symecs. All rights reserved.</p>
                </div>
            
            </div>
        </div>
    );
};

export default Login;
