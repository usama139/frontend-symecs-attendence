import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ClipboardList, History, LogOut, Search, Bell, Settings } from 'lucide-react';

const TeacherDashboard = () => {
    const { logout } = useContext(AuthContext);
    const [view, setView] = useState('mark'); // mark, history
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [markings, setMarkings] = useState({});
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState('');

    const [filterClass, setFilterClass] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/classes`, { headers })
             .then(res => setClasses(res.data))
             .catch(console.error);
    }, []);

    useEffect(() => {
        if (view === 'history') {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/attendance`, { headers })
                 .then(res => setAttendances(res.data))
                 .catch(console.error);
        } else if (view === 'mark' && selectedClassId) {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/classes/${selectedClassId}/students`, { headers })
                 .then(res => setStudents(res.data))
                 .catch(console.error);
                 
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/attendance`, { headers })
                 .then(res => {
                     const existing = res.data.filter(a => a.classId?._id === selectedClassId && a.date === date);
                     const initialMarks = {};
                     existing.forEach(a => initialMarks[a.studentId?._id] = a.status);
                     setMarkings(initialMarks);
                 })
                 .catch(console.error);
        }
    }, [view, selectedClassId, date]);

    const handleMarkClick = (studentId, status) => {
        setMarkings(prev => ({ ...prev, [studentId]: status }));
    };

    const submitAllAttendance = async () => {
        if (Object.keys(markings).length === 0) {
            setMessage('No attendance marked!');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const records = Object.keys(markings).map(studentId => ({
                studentId,
                status: markings[studentId]
            }));

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/teacher/attendance`, { 
                classId: selectedClassId, 
                date,
                records 
            }, { headers });
            
            setMessage('All Attendance Saved Successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to record attendance');
        }
    };

    const filteredHistory = attendances.filter(record => {
        let match = true;
        if (filterClass && record.classId?._id !== filterClass) match = false;
        if (filterDate && record.date !== filterDate) match = false;
        return match;
    });

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <img src="/institute_logo.jpg" alt="Logo" />
                    <h2>Symecs Faculty</h2>
                </div>
                
                <div className={`nav-item ${view==='mark'?'active':''}`} onClick={()=>setView('mark')}><ClipboardList size={20}/> <span>Mark Attendance</span></div>
                <div className={`nav-item ${view==='history'?'active':''}`} onClick={()=>setView('history')}><History size={20}/> <span>Attendance History</span></div>
                
                <div style={{marginTop: 'auto'}}>
                    <div className="nav-item" onClick={logout} style={{color: 'var(--danger-text)'}}><LogOut size={20}/> <span>Logout</span></div>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <div className="search-bar">
                        <Search size={18} color="var(--text-muted)" />
                        <input type="text" placeholder="Search anything..." />
                    </div>
                    <div className="flex items-center gap-4">
                        <Settings size={20} color="var(--text-muted)" style={{cursor:'pointer'}} />
                        <Bell size={20} color="var(--text-muted)" style={{cursor:'pointer'}} />
                        <div className="flex items-center gap-2">
                            <div style={{width: '35px', height:'35px', borderRadius:'50%', background:'var(--primary-text)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>FD</div>
                            <div>
                                <p style={{fontSize:'0.85rem', fontWeight:'bold', margin:0}}>Faculty Desk</p>
                                <p style={{fontSize:'0.75rem', color:'var(--text-muted)', margin:0}}>Teacher</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{padding: '2rem'}}>
                    {message && <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{message}</div>}

                    {view === 'mark' && (
                        <div className="card w-full">
                            <h1 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>Mark Session Attendance</h1>
                            <div className="flex gap-4" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <div className="flex flex-col">
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom:'0.25rem' }}>1. Select Class</label>
                                    <select className="input-field" style={{ marginBottom: 0, width: '250px' }} value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                                        <option value="">-- Choose Class --</option>
                                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom:'0.25rem' }}>2. Document Date</label>
                                    <input type="date" className="input-field" style={{ marginBottom: 0, width: '200px' }} value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                            </div>

                            {!selectedClassId && <p style={{ color: 'var(--text-muted)' }}>Please select a class to view enrolled students.</p>}
                            {selectedClassId && students.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No students enrolled in this class.</p>}

                            {selectedClassId && students.length > 0 && (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="beautiful-table" style={{ marginBottom: '2rem' }}>
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Student Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, index) => (
                                                <tr key={student._id}>
                                                    <td style={{fontWeight: '600', color: 'var(--text-main)'}}>{index + 1}</td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div style={{width: '30px', height:'30px', borderRadius:'50%', background:'var(--secondary)', color:'var(--secondary-text)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'0.75rem'}}>{student.name[0]}</div>
                                                            <div>
                                                                <div style={{fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem'}}>{student.name}</div>
                                                                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>D/S of {student.fatherName || 'Unknown'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex gap-4">
                                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--success-text)', fontWeight: 'bold' }}>
                                                                <input type="radio" name={`att-${student._id}`} checked={markings[student._id] === 'Present'} onChange={() => handleMarkClick(student._id, 'Present')} style={{ width: '1.25rem', height: '1.25rem' }} /> Present
                                                            </label>
                                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--danger-text)', fontWeight: 'bold' }}>
                                                                <input type="radio" name={`att-${student._id}`} checked={markings[student._id] === 'Absent'} onChange={() => handleMarkClick(student._id, 'Absent')} style={{ width: '1.25rem', height: '1.25rem' }} /> Absent
                                                            </label>
                                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--warning-text)', fontWeight: 'bold' }}>
                                                                <input type="radio" name={`att-${student._id}`} checked={markings[student._id] === 'Late'} onChange={() => handleMarkClick(student._id, 'Late')} style={{ width: '1.25rem', height: '1.25rem' }} /> Late
                                                            </label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex justify-between" style={{ alignItems: 'center' }}>
                                        <p style={{ color: 'var(--text-muted)' }}>Make sure to click Save below when you are finished!</p>
                                        <button onClick={submitAllAttendance} className="btn" style={{ padding: '1rem 3rem', background: '#1e293b', fontSize: '1.1rem', color: 'white' }}>Save Attendance</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'history' && (
                        <div className="card w-full">
                            <h1 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>Class Attendance History</h1>
                            <div className="flex gap-4" style={{ marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="flex flex-col" style={{ width: '250px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom:'0.25rem' }}>Filter by Class</label>
                                    <select className="input-field" value={filterClass} onChange={e=>setFilterClass(e.target.value)} style={{ margin: 0 }}>
                                        <option value="">All My Classes</option>
                                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col" style={{ width: '200px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom:'0.25rem' }}>Filter by Date</label>
                                    <input type="date" className="input-field" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{ margin: 0 }} />
                                </div>
                                {(filterClass || filterDate) && (
                                    <span style={{cursor:'pointer', color:'var(--danger-text)', fontSize:'0.85rem', fontWeight:'600', marginTop:'1.5rem'}} onClick={() => { setFilterClass(''); setFilterDate(''); }}>Clear Filters</span>
                                )}
                            </div>
                            
                            {filteredHistory.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No records match your filters.</p>}

                            {filteredHistory.length > 0 && (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="beautiful-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Class</th>
                                                <th>Student</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistory.map(record => (
                                                <tr key={record._id}>
                                                    <td style={{fontWeight:'500'}}>{record.date}</td>
                                                    <td>{record.classId?.name}</td>
                                                    <td>{record.studentId?.name}</td>
                                                    <td>
                                                        <span className="status-badge" style={{ 
                                                            background: record.status === 'Present' ? 'var(--success-bg)' : record.status === 'Absent' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                                                            color: record.status === 'Present' ? 'var(--success-text)' : record.status === 'Absent' ? 'var(--danger-text)' : 'var(--warning-text)'
                                                        }}>{record.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <footer className="footer">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--nav-active-bg)', padding: '0.75rem 2rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', fontSize: '1rem' }}>
                            <span style={{ color: 'var(--nav-active-text)' }}>✨</span> Built by Usama Ali <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>| HOD Computer Symecs</span>
                        </div>
                        
                        <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', opacity: 0.5 }}></div>

                        <div className="flex justify-between items-center w-full" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                            <p style={{ margin: 0, fontWeight: '500' }}>Copyright © 2026 Symecs. All rights reserved.</p>
                            <div className="flex gap-4 footer-links" style={{ fontWeight: '600', color: 'var(--secondary-text)' }}>
                                <span style={{cursor:'pointer'}}>Privacy Policy</span>
                                <span style={{cursor:'pointer'}}>Terms</span>
                                <span style={{cursor:'pointer'}}>Contact</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default TeacherDashboard;
