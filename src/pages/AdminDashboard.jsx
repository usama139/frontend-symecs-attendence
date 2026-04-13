import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LayoutDashboard, Users, GraduationCap, CalendarCheck, School, LogOut, Search, Bell, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const mockPerformance = [
  { name: 'Jul', G7: 65, G8: 80, G9: 90 },
  { name: 'Aug', G7: 59, G8: 72, G9: 85 },
  { name: 'Sep', G7: 80, G8: 91, G9: 76 },
  { name: 'Oct', G7: 81, G8: 85, G9: 92 },
  { name: 'Nov', G7: 76, G8: 88, G9: 95 },
  { name: 'Dec', G7: 85, G8: 92, G9: 100 },
];

const mockTrends = [
  { year: '2030', val: 5000 },
  { year: '2031', val: 6200 },
  { year: '2032', val: 7100 },
  { year: '2033', val: 8015 },
  { year: '2034', val: 7800 },
  { year: '2035', val: 9500 },
];

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const [view, setView] = useState('dashboard');
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);

    const [classForm, setClassForm] = useState({ name: '', timing: '' });
    const [form, setForm] = useState({ name: '', fatherName: '', email: '', password: '', assignedClass: '', assignedClasses: [] });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    const [filterClass, setFilterClass] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    useEffect(() => {
        fetchData();
        if (view === 'teachers' || view === 'students' || view === 'attendance') {
            setForm({ name: '', fatherName: '', email: '', password: '', assignedClass: '', assignedClasses: [] });
            setEditingId(null);
        }
    }, [view]);

    const fetchData = async () => {
        try {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/classes`, { headers }).then(res => setClasses(res.data));
            if (view === 'teachers' || view === 'dashboard') {
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/teachers`, { headers }).then(res => setTeachers(res.data));
            }
            if (view === 'students' || view === 'dashboard') {
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/students`, { headers }).then(res => setStudents(res.data));
            }
            if (view === 'attendance' || view === 'dashboard') {
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/attendance`, { headers }).then(res => setAttendances(res.data));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/classes`, classForm, { headers });
            setMessage('Class added!');
            setClassForm({ name: '', timing: '' });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { setMessage('Error adding class'); }
    };

    const handleCreateOrUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const endpoint = view === 'teachers' ? 'teachers' : 'students';
            const payload = { ...form };
            
            if (view === 'students' && !editingId) {
                 payload.email = `${form.name.replace(/\s+/g, '').toLowerCase()}_${Date.now()}@student.symecs.edu`;
                 payload.password = 'StudentSecure123!';
            }

            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/${endpoint}/${editingId}`, payload, { headers });
                setMessage(`Updated successfully!`);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/${endpoint}`, payload, { headers });
                setMessage(`Added successfully!`);
            }
            setForm({ name: '', fatherName: '', email: '', password: '', assignedClass: '', assignedClasses: [] });
            setEditingId(null);
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { setMessage(err.response?.data?.msg || 'Error saving user'); }
    };

    const handleEditUser = (user) => {
        setEditingId(user._id);
        setForm({
            name: user.name,
            fatherName: user.fatherName || '',
            email: user.email, 
            password: '', 
            assignedClass: user.assignedClass?._id || '',
            assignedClasses: user.assignedClasses?.map(c => c._id) || []
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteUser = async (id, endpoint) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/${endpoint}/${id}`, { headers });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleArchive = async () => {
        if (!window.confirm("WARNING: This will download a CSV of ALL attendance logs older than this month and PERMANENTLY delete them from the cloud framework to save free space! Proceed?")) return;
        try {
            setMessage('Packaging global databases for Archive. Please wait...');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/archive-attendance`, { headers, responseType: 'blob' });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const currentMonth = new Date().toISOString().slice(0, 7);
            link.setAttribute('download', `Symecs_Attendance_Archive_Before_${currentMonth}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            fetchData();
            setTimeout(() => setMessage('Database Pruning Complete! Live cloud limits refreshed and local download initiated successfully.'), 1000);
            setTimeout(() => setMessage(''), 8000);
        } catch (err) {
            setMessage('Archive Aborted: Your server has no old monthly records to archive at this time!');
            setTimeout(() => setMessage(''), 4000);
        }
    };

    const filteredAttendances = attendances.filter(record => {
        let match = true;
        if (filterClass && record.classId?._id !== filterClass) match = false;
        if (filterDate && record.date !== filterDate) match = false;
        return match;
    });

    const getPerformanceParams = (studentId) => {
        const studentRecords = attendances.filter(r => r.studentId?._id === studentId);
        if (studentRecords.length === 0) return { dots: '#9ca3af', text: 'No Data' };
        
        const presentCount = studentRecords.filter(r => r.status === 'Present').length;
        const ratio = presentCount / studentRecords.length;

        if (ratio >= 0.75) return { dots: '#10b981', text: 'Good' };
        if (ratio >= 0.50) return { dots: '#f59e0b', text: 'Average' };
        return { dots: '#ef4444', text: 'Poor' };
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <img src="/institute_logo.jpg" alt="Logo" />
                    <h2>Symecs Admin</h2>
                </div>
                
                <div className={`nav-item ${view==='dashboard'?'active':''}`} onClick={()=>setView('dashboard')}><LayoutDashboard size={20}/> <span>Dashboard</span></div>
                <div className={`nav-item ${view==='students'?'active':''}`} onClick={()=>setView('students')}><GraduationCap size={20}/> <span>Students</span></div>
                <div className={`nav-item ${view==='teachers'?'active':''}`} onClick={()=>setView('teachers')}><Users size={20}/> <span>Teachers</span></div>
                <div className={`nav-item ${view==='classes'?'active':''}`} onClick={()=>setView('classes')}><School size={20}/> <span>Classes</span></div>
                <div className={`nav-item ${view==='attendance'?'active':''}`} onClick={()=>setView('attendance')}><CalendarCheck size={20}/> <span>Attendance Tracker</span></div>
                
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
                            <div style={{width: '35px', height:'35px', borderRadius:'50%', background:'var(--nav-active-text)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>UA</div>
                            <div>
                                <p style={{fontSize:'0.85rem', fontWeight:'bold', margin:0}}>Usama Ali</p>
                                <p style={{fontSize:'0.75rem', color:'var(--text-muted)', margin:0}}>HOD Computer</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{padding: '2rem'}}>
                    {message && <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>{message}</div>}

                    {view === 'dashboard' && (
                        <>
                            <div className="flex justify-between items-center" style={{marginBottom: '1rem'}}>
                                <h1 style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)'}}>Dashboard <span style={{fontSize:'1rem', color:'var(--text-muted)', fontWeight:'500'}}>Overview</span></h1>
                            </div>

                            <div className="dash-grid">
                                <div className="card metric-card" style={{background: 'var(--secondary)'}}>
                                    <Users size={30} color="var(--secondary-text)" style={{marginBottom: '1rem'}}/>
                                    <h3 style={{color: 'var(--secondary-text)'}}>{students.length}</h3>
                                    <p style={{color: 'var(--secondary-text)'}}>Total Students</p>
                                </div>
                                <div className="card metric-card" style={{background: 'var(--nav-active-bg)'}}>
                                    <GraduationCap size={30} color="var(--nav-active-text)" style={{marginBottom: '1rem'}}/>
                                    <h3 style={{color: 'var(--nav-active-text)'}}>{teachers.length}</h3>
                                    <p style={{color: 'var(--nav-active-text)'}}>Total Teachers</p>
                                </div>
                                <div className="card metric-card" style={{border: '1px solid var(--border-color)', background: 'var(--panel-bg)'}}>
                                    <School size={30} color="var(--text-main)" style={{marginBottom: '1rem'}}/>
                                    <h3>{classes.length}</h3>
                                    <p>Active Classes</p>
                                </div>
                                <div className="card metric-card" style={{background: 'var(--warning-bg)'}}>
                                    <CalendarCheck size={30} color="var(--warning-text)" style={{marginBottom: '1rem'}}/>
                                    <h3 style={{color: 'var(--warning-text)'}}>{attendances.length}</h3>
                                    <p style={{color: 'var(--warning-text)'}}>Attendance Logs</p>
                                </div>
                            </div>

                            <div className="flex gap-4 flex-col lg:flex-row" style={{marginBottom: '1.5rem'}}>
                                <div className="card flex-1" style={{minWidth: '0'}}>
                                    <div className="flex justify-between items-center" style={{marginBottom: '1.5rem'}}>
                                        <h3 style={{fontWeight: '700'}}>Academic Performance</h3>
                                    </div>
                                    <div style={{height: '250px'}}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={mockPerformance}>
                                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{fill: '#f4f7fe'}} />
                                                <Bar dataKey="G7" fill="#cbd5e1" radius={[4,4,0,0]} barSize={12} />
                                                <Bar dataKey="G8" fill="#1f2937" radius={[4,4,0,0]} barSize={12} />
                                                <Bar dataKey="G9" fill="#fbcfe8" radius={[4,4,0,0]} barSize={12} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                                <div className="card" style={{width: '400px'}}>
                                    <div className="flex justify-between items-center" style={{marginBottom: '1.5rem'}}>
                                        <h3 style={{fontWeight: '700'}}>Enrollment Trends</h3>
                                    </div>
                                    <div style={{height: '250px'}}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={mockTrends}>
                                                <XAxis dataKey="year" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                                <YAxis hide={true} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="val" stroke="#1f2937" strokeWidth={3} dot={{r:4, fill:'#1f2937'}} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {view === 'students' && (
                        <div className="card w-full">
                            <div className="flex justify-between items-center" style={{marginBottom: '1.5rem'}}>
                                <h1 style={{fontSize: '1.5rem', fontWeight: '700'}}>Students Management</h1>
                                <button className="btn btn-primary" onClick={() => {setEditingId(null); window.scrollTo(0, document.body.scrollHeight)}}>+ Add Student</button>
                            </div>
                            
                            <div style={{overflowX: 'auto'}}>
                                <table className="beautiful-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Class</th>
                                            <th>Performance</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(s => {
                                            const perf = getPerformanceParams(s._id);
                                            return (
                                            <tr key={s._id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div style={{width: '30px', height:'30px', borderRadius:'50%', background:'var(--primary)', color:'var(--primary-text)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'0.75rem'}}>{s.name[0]}</div>
                                                        <div>
                                                            <div style={{fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem'}}>{s.name}</div>
                                                            <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>D/S of {s.fatherName || 'Unknown'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{s.assignedClass?.name || 'None'}</td>
                                                <td>
                                                    <div style={{display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem'}}>
                                                        <div style={{width:'8px', height:'8px', borderRadius:'50%', background: perf.dots}}></div>
                                                        <span style={{fontWeight: '600', color: 'var(--text-main)'}}>{perf.text}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <span style={{cursor:'pointer', fontSize:'0.85rem', color:'var(--secondary-text)'}} onClick={()=>handleEditUser(s)}>Edit</span>
                                                        <span style={{cursor:'pointer', fontSize:'0.85rem', color:'var(--danger-text)'}} onClick={()=>handleDeleteUser(s._id, 'students')}>Delete</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>

                            <h3 style={{marginTop: '3rem', marginBottom: '1rem'}}>{editingId ? 'Edit Student' : 'Add New Student'}</h3>
                            <form onSubmit={handleCreateOrUpdateUser} className="flex flex-col max-w-sm">
                                <input className="input-field" type="text" placeholder="Student Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required/>
                                <input className="input-field" type="text" placeholder="Father's Name" value={form.fatherName} onChange={e=>setForm({...form, fatherName: e.target.value})} required/>
                                
                                <select className="input-field" value={form.assignedClass} onChange={e=>setForm({...form, assignedClass: e.target.value})} required>
                                    <option value="" disabled>Select Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>

                                <div className="flex gap-2">
                                    <button type="submit" className="btn btn-primary w-full">{editingId ? 'Update' : 'Add'}</button>
                                    {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({name:'', fatherName:'', email:'', password:'', assignedClass:'', assignedClasses:[]})}} className="btn w-full" style={{background:'var(--border-color)', color:'var(--text-main)'}}>Cancel</button>}
                                </div>
                            </form>
                        </div>
                    )}

                    {view === 'teachers' && (
                        <div className="card w-full">
                            <h1 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>Teachers Management</h1>
                            <div style={{overflowX: 'auto'}}>
                                <table className="beautiful-table">
                                    <thead>
                                        <tr>
                                            <th>Teacher Name</th>
                                            <th>Email Address</th>
                                            <th>Assigned Classes</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teachers.map(t => (
                                            <tr key={t._id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div style={{width: '30px', height:'30px', borderRadius:'50%', background:'var(--nav-active-bg)', color:'var(--nav-active-text)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'0.75rem'}}>{t.name[0]}</div>
                                                        <div style={{fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem'}}>{t.name}</div>
                                                    </div>
                                                </td>
                                                <td>{t.email}</td>
                                                <td>{t.assignedClasses?.map(c=>c.name).join(', ') || 'Unassigned'}</td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <span style={{cursor:'pointer', fontSize:'0.85rem', color:'var(--secondary-text)'}} onClick={()=>handleEditUser(t)}>Edit</span>
                                                        <span style={{cursor:'pointer', fontSize:'0.85rem', color:'var(--danger-text)'}} onClick={()=>handleDeleteUser(t._id, 'teachers')}>Delete</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h3 style={{marginTop: '3rem', marginBottom: '1rem'}}>{editingId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
                            <form onSubmit={handleCreateOrUpdateUser} className="flex flex-col max-w-sm">
                                <input className="input-field" type="text" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required/>
                                <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required/>
                                <input className="input-field" type="password" placeholder={editingId?"Leave blank to keep password":"Password"} value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required={!editingId}/>
                                
                                <div style={{ marginBottom: '1rem', background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize:'0.85rem' }}>Assign Classes:</p>
                                    <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {classes.map(c => (
                                            <label key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                <input type="checkbox" checked={form.assignedClasses.includes(c._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setForm({...form, assignedClasses: [...form.assignedClasses, c._id]});
                                                        else setForm({...form, assignedClasses: form.assignedClasses.filter(id => id !== c._id)});
                                                    }}
                                                />
                                                {c.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button type="submit" className="btn btn-primary w-full">{editingId ? 'Update' : 'Add'}</button>
                                    {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({name:'', fatherName:'', email:'', password:'', assignedClass:'', assignedClasses:[]})}} className="btn w-full" style={{background:'var(--border-color)', color:'var(--text-main)'}}>Cancel</button>}
                                </div>
                            </form>
                        </div>
                    )}

                    {view === 'classes' && (
                        <div className="card w-full">
                            <h1 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>Class Administration</h1>
                            
                            <div style={{overflowX: 'auto'}}>
                                <table className="beautiful-table">
                                    <thead>
                                        <tr>
                                            <th>Class Name</th>
                                            <th>Timing</th>
                                            <th>Enrolled Students</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classes.map(cls => (
                                            <tr key={cls._id}>
                                                <td style={{fontWeight: '600'}}>{cls.name}</td>
                                                <td>{cls.timing}</td>
                                                <td>{cls.totalStudents} Students</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h3 style={{marginTop: '3rem', marginBottom: '1rem'}}>Create Fast Class</h3>
                            <form onSubmit={handleCreateClass} className="flex flex-col max-w-sm">
                                <input className="input-field" type="text" placeholder="Class Name" value={classForm.name} onChange={e=>setClassForm({...classForm, name: e.target.value})} required/>
                                <input className="input-field" type="text" placeholder="Class Timing (e.g. 10:00 AM)" value={classForm.timing} onChange={e=>setClassForm({...classForm, timing: e.target.value})} required/>
                                <button type="submit" className="btn btn-primary w-full">Add Class</button>
                            </form>
                        </div>
                    )}

                    {view === 'attendance' && (
                        <div className="card w-full">
                            <h1 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>Global Attendance Logs</h1>
                            
                            <div style={{ background: 'var(--danger-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--danger-text)', marginBottom: '2rem' }}>
                                <h3 style={{ color: 'var(--danger-text)', margin: '0 0 0.5rem 0', fontWeight: '800' }}>Storage Optimization Engine</h3>
                                <p style={{ color: 'var(--danger-text)', margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.9 }}>Running this framework strictly isolates completely all chronological attendance variables that are older than the ongoing current month, translates their relational parameters into a singular CSV offline file, forcefully routes the local download directly straight to your active client device, and irrevocably shreds the raw data metrics synchronously originating across your independent cloud MongoDB cluster nodes to dynamically restore absolute maximum capacity on your localized Free Tier account variables.</p>
                                <button className="btn" style={{ background: 'var(--danger-text)', color: 'white', fontWeight: 'bold' }} onClick={handleArchive}>Initialize Monthly Auto-Archive (Download + Shred Cloud Storage)</button>
                            </div>

                            <div className="flex gap-4" style={{ marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="flex flex-col" style={{ width: '250px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom:'0.25rem' }}>Filter by Class</label>
                                    <select className="input-field" value={filterClass} onChange={e=>setFilterClass(e.target.value)} style={{ margin: 0 }}>
                                        <option value="">All Classes</option>
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
                            
                            {filteredAttendances.length === 0 && <p style={{ color: 'var(--text-muted)', padding:'1rem 0' }}>No records match your filters.</p>}
                            
                            {filteredAttendances.length > 0 && (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="beautiful-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Student</th>
                                                <th>Class</th>
                                                <th>Teacher</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAttendances.map(record => (
                                                <tr key={record._id}>
                                                    <td style={{fontWeight:'500'}}>{record.date}</td>
                                                    <td>{record.studentId?.name}</td>
                                                    <td>{record.classId?.name}</td>
                                                    <td>{record.teacherId?.name}</td>
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

export default AdminDashboard;
