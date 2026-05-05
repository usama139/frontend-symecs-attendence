import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, User, Phone, MapPin, GraduationCap, AlertCircle } from 'lucide-react';
import './DITRegistration.css'; // We'll create this CSS file next

const DITRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        contactNumber: '',
        address: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/registration/dit`, formData);
            setStatus({ type: 'success', msg: 'Registration successful! Welcome to Batch 36.' });
            setFormData({ name: '', fatherName: '', contactNumber: '', address: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.msg || 'Error submitting registration.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-page">
            <div className="registration-container">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} /> Back to Home
                </button>
                
                <div className="registration-header">
                    <div className="icon-wrapper">
                        <GraduationCap size={40} color="var(--primary)" />
                    </div>
                    <h2>DIT Admission Form</h2>
                    <p>Batch 36 Registrations are now open. Secure your seat today!</p>
                </div>

                {status.msg && (
                    <div className={`status-message ${status.type}`}>
                        {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <span>{status.msg}</span>
                    </div>
                )}

                <form className="registration-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Student Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Enter your full name" 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label>Father's Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input 
                                type="text" 
                                name="fatherName" 
                                value={formData.fatherName} 
                                onChange={handleChange} 
                                placeholder="Enter father's name" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Contact Number</label>
                        <div className="input-wrapper">
                            <Phone size={18} className="input-icon" />
                            <input 
                                type="tel" 
                                name="contactNumber" 
                                value={formData.contactNumber} 
                                onChange={handleChange} 
                                placeholder="e.g. 0300-1234567" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Home Address</label>
                        <div className="input-wrapper textarea-wrapper">
                            <MapPin size={18} className="input-icon" />
                            <textarea 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                placeholder="Enter your complete residential address" 
                                required 
                                rows="3"
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
            
            {/* Decorative background elements */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
        </div>
    );
};

export default DITRegistration;
