import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  School, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ClipboardList,
  ShieldCheck,
  UserPlus,
  BookOpen,
  Menu,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const [view, setView] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [ditRegistrations, setDitRegistrations] = useState([]);

  // Form states - classForm timing is now manual text input
  const [classForm, setClassForm] = useState({ name: '', timing: '10:00 AM - 11:30 AM' });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: '', assignedClasses: [] });
  const [studentForm, setStudentForm] = useState({ name: '', fatherName: '', email: '', password: '', assignedClass: '' });

  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const [cRes, tRes, sRes, aRes, dRes] = await Promise.all([
        axios.get(`${apiUrl}/api/admin/classes`, { headers }),
        axios.get(`${apiUrl}/api/admin/teachers`, { headers }),
        axios.get(`${apiUrl}/api/admin/students`, { headers }),
        axios.get(`${apiUrl}/api/admin/attendance`, { headers }),
        axios.get(`${apiUrl}/api/admin/dit-registrations`, { headers })
      ]);
      setClasses(cRes.data);
      setTeachers(tRes.data);
      setStudents(sRes.data);
      setAttendances(aRes.data);
      setDitRegistrations(dRes.data);
    } catch (err) {
      console.error(err);
      showMsg('error', 'Failed to fetch dashboard data');
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // --- Add Class ---
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/admin/classes`, classForm, { headers });
      showMsg('success', `Class "${classForm.name}" added successfully!`);
      setClassForm({ name: '', timing: '10:00 AM - 11:30 AM' });
      fetchData();
    } catch (err) {
      showMsg('error', err.response?.data?.msg || 'Error adding class');
    }
  };

  // --- Teacher Add/Update ---
  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (editingTeacherId) {
        await axios.put(`${apiUrl}/api/admin/teachers/${editingTeacherId}`, teacherForm, { headers });
        showMsg('success', 'Teacher profile updated!');
      } else {
        await axios.post(`${apiUrl}/api/admin/teachers`, teacherForm, { headers });
        showMsg('success', 'New teacher onboarded successfully!');
      }
      setTeacherForm({ name: '', email: '', password: '', assignedClasses: [] });
      setEditingTeacherId(null);
      fetchData();
    } catch (err) {
      showMsg('error', err.response?.data?.msg || 'Error saving teacher');
    }
  };

  const handleEditTeacher = (t) => {
    setEditingTeacherId(t._id);
    setTeacherForm({
      name: t.name,
      email: t.email,
      password: '',
      assignedClasses: t.assignedClasses ? t.assignedClasses.map(c => c._id || c) : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to remove this teacher?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/admin/teachers/${id}`, { headers });
      showMsg('success', 'Teacher removed');
      fetchData();
    } catch (err) {
      showMsg('error', 'Error removing teacher');
    }
  };

  const handleTeacherClassToggle = (classId) => {
    setTeacherForm(prev => {
      const exists = prev.assignedClasses.includes(classId);
      if (exists) {
        return { ...prev, assignedClasses: prev.assignedClasses.filter(id => id !== classId) };
      } else {
        return { ...prev, assignedClasses: [...prev.assignedClasses, classId] };
      }
    });
  };

  // --- Student Add/Update ---
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const payload = { ...studentForm };
      
      if (!editingStudentId) {
        if (!payload.email) {
          if (payload.fatherName) {
            payload.email = `${studentForm.name.replace(/\s+/g, '').toLowerCase()}_${studentForm.fatherName.replace(/\s+/g, '').toLowerCase()}@student.symecs.edu`;
          } else {
            payload.email = `${studentForm.name.replace(/\s+/g, '').toLowerCase()}_${Date.now()}@student.symecs.edu`;
          }
        }
        if (!payload.password) {
          payload.password = 'Student123!';
        }
      }

      if (editingStudentId) {
        await axios.put(`${apiUrl}/api/admin/students/${editingStudentId}`, payload, { headers });
        showMsg('success', 'Student record updated!');
      } else {
        await axios.post(`${apiUrl}/api/admin/students`, payload, { headers });
        showMsg('success', 'Student enrolled successfully!');
      }
      setStudentForm({ name: '', fatherName: '', email: '', password: '', assignedClass: '' });
      setEditingStudentId(null);
      fetchData();
    } catch (err) {
      showMsg('error', err.response?.data?.msg || 'Error saving student');
    }
  };

  const handleEditStudent = (s) => {
    setEditingStudentId(s._id);
    setStudentForm({
      name: s.name,
      fatherName: s.fatherName || '',
      email: s.email,
      password: '',
      assignedClass: s.assignedClass?._id || s.assignedClass || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/admin/students/${id}`, { headers });
      showMsg('success', 'Student removed');
      fetchData();
    } catch (err) {
      showMsg('error', 'Error removing student');
    }
  };

  const handleDeleteDITRegistration = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the online application for "${name}"?`)) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/admin/dit-registrations/${id}`, { headers });
      showMsg('success', 'Online application deleted successfully!');
      fetchData();
    } catch (err) {
      showMsg('error', 'Error deleting application');
    }
  };

  // --- Clear Attendance History By Selected Class ---
  const handleClearAttendanceHistory = async () => {
    const selectedClassName = classes.find(c => c._id === filterClass)?.name || 'All Classes';
    
    if (!window.confirm(`WARNING: Are you sure you want to PERMANENTLY DELETE all attendance history for "${selectedClassName}" from the database? This action cannot be undone.`)) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/admin/clear-attendance`, { classId: filterClass }, { headers });
      showMsg('success', res.data?.msg || `Attendance history for "${selectedClassName}" cleared successfully!`);
      fetchData();
    } catch (err) {
      showMsg('error', err.response?.data?.msg || 'Failed to clear attendance history.');
    }
  };

  const handleExportCSV = () => {
    if (filteredAttendances.length === 0) {
      showMsg('error', 'No attendance records available to export.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,S.No,Student Name,Class,Date,Status,Marked By\n";
    filteredAttendances.forEach((rec, idx) => {
      const row = `${idx + 1},"${rec.studentId?.name || 'N/A'}","${rec.classId?.name || 'N/A'}",${rec.date},${rec.status},"${rec.markedBy?.name || 'Faculty'}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SYMECS_Attendance_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredAttendances = attendances.filter(record => {
    let match = true;
    if (filterClass && record.classId?._id !== filterClass) match = false;
    if (filterDate && record.date !== filterDate) match = false;
    return match;
  });

  const filteredStudentsList = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-hidden">
      
      {/* Mobile Top Sticky Bar */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl border border-slate-700 focus:outline-none"
          >
            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <img src="/institute_logo.jpg" alt="SYMECS Logo" className="w-8 h-8 rounded-full border border-cyan-400/40" />
            <span className="font-extrabold text-sm text-white">SYMECS Admin</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition border border-red-500/20"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Backdrop for Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
        isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <img src="/institute_logo.jpg" alt="SYMECS Logo" className="w-10 h-10 rounded-full border border-cyan-400/40" />
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">SYMECS Admin</h2>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold block">Control Center</span>
            </div>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          <button
            onClick={() => { setView('dashboard'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => { setView('classes'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'classes' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <School size={18} />
            <span>Classes & Batches</span>
          </button>

          <button
            onClick={() => { setView('teachers'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'teachers' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users size={18} />
            <span>Manage Teachers</span>
          </button>

          <button
            onClick={() => { setView('students'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'students' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap size={18} />
            <span>Manage Students</span>
          </button>

          <button
            onClick={() => { setView('attendance'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'attendance' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CalendarCheck size={18} />
            <span>Attendance Tracker</span>
          </button>

          <button
            onClick={() => { setView('dit-registrations'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'dit-registrations' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ClipboardList size={18} />
            <span>Online Applications</span>
          </button>
        </nav>

        <div className="pt-4 border-t border-slate-800 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Sticky Header */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm sm:text-lg font-bold text-white uppercase tracking-wider truncate">
              {view === 'dashboard' && 'Dashboard Overview'}
              {view === 'classes' && 'Classes & Batches'}
              {view === 'teachers' && 'Teachers Directory'}
              {view === 'students' && 'Students Directory'}
              {view === 'attendance' && 'Attendance Tracker'}
              {view === 'dit-registrations' && 'Online Applications'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span className="font-semibold text-white hidden sm:inline">{user?.name || 'Super Admin'}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold">Admin</span>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* Status Alert Notification */}
          {message.text && (
            <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
              message.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            }`}>
              {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* VIEW: DASHBOARD OVERVIEW */}
          {view === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Students</p>
                    <h3 className="text-3xl font-black text-white mt-1">{students.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                    <GraduationCap size={26} />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Faculty</p>
                    <h3 className="text-3xl font-black text-white mt-1">{teachers.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                    <Users size={26} />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Classes</p>
                    <h3 className="text-3xl font-black text-white mt-1">{classes.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <School size={26} />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logs Tracked</p>
                    <h3 className="text-3xl font-black text-white mt-1">{attendances.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                    <CalendarCheck size={26} />
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <School size={18} className="text-cyan-400" />
                    <span>Quick Create Class</span>
                  </h3>
                  <form onSubmit={handleCreateClass} className="space-y-3">
                    <input
                      type="text"
                      placeholder="e.g. DIT Batch 36"
                      value={classForm.name}
                      onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Enter Class Timing (e.g. 10:00 AM - 11:30 AM)"
                      value={classForm.timing}
                      onChange={e => setClassForm({ ...classForm, timing: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      required
                    />
                    <button type="submit" className="w-full py-2.5 font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md">
                      Add New Class
                    </button>
                  </form>
                </div>

                {/* Class Student Breakdown List */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-4">Classes & Enrollment Overview</h3>
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                    {classes.map(c => (
                      <div key={c._id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[11px] text-slate-400">{c.timing}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                          {c.totalStudents || 0} Students
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW: CLASSES MANAGEMENT */}
          {view === 'classes' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4">Add New Class / Batch</h3>
                <form onSubmit={handleCreateClass} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Class Name (e.g. AI Batch 1)"
                    value={classForm.name}
                    onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                    className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Enter Timing (e.g. 03:00 PM - 04:30 PM)"
                    value={classForm.timing}
                    onChange={e => setClassForm({ ...classForm, timing: e.target.value })}
                    className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <button type="submit" className="py-3 font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md">
                    + Add Class
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <h3 className="text-lg font-bold text-white mb-4">Existing Classes</h3>
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Class Name</th>
                      <th className="py-3 px-4">Timing</th>
                      <th className="py-3 px-4">Enrolled Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                    {classes.map((c, idx) => (
                      <tr key={c._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                        <td className="py-3.5 px-4 text-slate-300">{c.timing}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-bold">
                            {c.totalStudents || 0} Students
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: TEACHERS MANAGEMENT */}
          {view === 'teachers' && (
            <div className="space-y-6">
              
              {/* Form */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4">
                  {editingTeacherId ? 'Edit Teacher & Class Assignment' : 'Add New Teacher & Assign Classes'}
                </h3>
                <form onSubmit={handleSaveTeacher} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Teacher Name (e.g. Usama Ali)"
                      value={teacherForm.name}
                      onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                      className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email (e.g. usamaali@gmail.com)"
                      value={teacherForm.email}
                      onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                      className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                    <input
                      type="password"
                      placeholder={editingTeacherId ? 'Password (leave blank to keep same)' : 'Security Password'}
                      value={teacherForm.password}
                      onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                      className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      required={!editingTeacherId}
                    />
                  </div>

                  {/* Assign Classes Multi-Select */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Assign Classes to this Teacher (Teacher-to-Class Mapping):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      {classes.map(c => {
                        const isChecked = teacherForm.assignedClasses.includes(c._id);
                        return (
                          <label key={c._id} className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTeacherForm(prev => ({ ...prev, assignedClasses: [...prev.assignedClasses, c._id] }));
                                } else {
                                  setTeacherForm(prev => ({ ...prev, assignedClasses: prev.assignedClasses.filter(id => id !== c._id) }));
                                }
                              }}
                              className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20 bg-slate-900"
                            />
                            <span>{c.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {editingTeacherId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeacherId(null);
                          setTeacherForm({ name: '', email: '', password: '', assignedClasses: [] });
                        }}
                        className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="px-6 py-2.5 font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md">
                      {editingTeacherId ? 'Save Teacher Changes' : '+ Add Teacher'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Teacher Directory Table */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <h3 className="text-lg font-bold text-white mb-4">Faculty & Teachers List</h3>
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Teacher Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Assigned Classes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                    {teachers.map((t, idx) => (
                      <tr key={t._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{t.name}</td>
                        <td className="py-3.5 px-4 text-cyan-300">{t.email}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {t.assignedClasses && t.assignedClasses.length > 0 ? (
                              t.assignedClasses.map((c, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-500/20">
                                  {c.name || 'Class'}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500 text-[11px]">No classes assigned</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditTeacher(t)}
                              className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition"
                              title="Edit Teacher"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(t._id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                              title="Delete Teacher"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* VIEW: STUDENTS MANAGEMENT */}
          {view === 'students' && (
            <div className="space-y-6">
              
              {/* Add Student Form */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4">
                  {editingStudentId ? 'Edit Student & Class Enrollment' : 'Enroll New Student'}
                </h3>
                <form onSubmit={handleSaveStudent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Student Full Name"
                      value={studentForm.name}
                      onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                      className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Father's Name"
                      value={studentForm.fatherName}
                      onChange={e => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                      className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <select
                      value={studentForm.assignedClass}
                      onChange={e => setStudentForm({ ...studentForm, assignedClass: e.target.value })}
                      className="px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      required
                    >
                      <option value="">-- Assign to Class / Batch --</option>
                      {classes.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {editingStudentId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStudentId(null);
                          setStudentForm({ name: '', fatherName: '', email: '', password: '', assignedClass: '' });
                        }}
                        className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="px-6 py-2.5 font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md">
                      {editingStudentId ? 'Save Student Changes' : '+ Enroll Student'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Search & Student Directory */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-white">Enrolled Students Directory</h3>
                  <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by student name..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Father's Name</th>
                        <th className="py-3 px-4">Enrolled Class</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                      {filteredStudentsList.map((s, idx) => (
                        <tr key={s._id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{s.name}</td>
                          <td className="py-3.5 px-4 text-slate-300">{s.fatherName || 'N/A'}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                              {s.assignedClass?.name || 'Unassigned'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditStudent(s)}
                                className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition"
                                title="Edit Student"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(s._id)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                title="Delete Student"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* VIEW: MASTER ATTENDANCE TRACKER */}
          {view === 'attendance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">System Attendance Logs</h3>
                    <p className="text-xs text-slate-400">View, filter, export, or clear attendance history records by class</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearAttendanceHistory}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition"
                    >
                      <Trash2 size={16} />
                      <span>Clear Selected Class History</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
                    >
                      <Download size={16} className="text-cyan-400" />
                      <span>Export CSV Report</span>
                    </button>
                  </div>
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Select Class to View / Clear</label>
                    <select
                      value={filterClass}
                      onChange={e => setFilterClass(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">-- All Classes (Select specific class to clear) --</option>
                      {classes.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Filter by Date</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                      {filteredAttendances.map((rec, idx) => (
                        <tr key={rec._id || idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{rec.studentId?.name || 'Student'}</td>
                          <td className="py-3.5 px-4">{rec.classId?.name || 'Class'}</td>
                          <td className="py-3.5 px-4 text-slate-300">{rec.date}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              rec.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              rec.status === 'Absent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ONLINE DIT REGISTRATIONS */}
          {view === 'dit-registrations' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Website Online Admission Applications</h3>
                  <p className="text-xs text-slate-400">View real-time course applications submitted by students on the portal</p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  Total Applications: {ditRegistrations.length}
                </div>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Father's Name</th>
                      <th className="py-3 px-4">Applied Course</th>
                      <th className="py-3 px-4">Contact (WhatsApp)</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                    {ditRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-8 text-center text-slate-500 text-xs">
                          No online applications received yet.
                        </td>
                      </tr>
                    ) : (
                      ditRegistrations.map((reg, idx) => {
                        const formattedDate = reg.createdAt 
                          ? new Date(reg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'N/A';

                        return (
                          <tr key={reg._id || idx} className="hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4">{idx + 1}</td>
                            <td className="py-3.5 px-4 text-slate-400 font-medium whitespace-nowrap">
                              {formattedDate}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{reg.name}</td>
                            <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">{reg.fatherName || 'N/A'}</td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px]">
                                {reg.course || 'DIT (Diploma in Information Technology) - 1 Year'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-emerald-400 font-bold whitespace-nowrap">{reg.contactNumber}</td>
                            <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{reg.address || 'Mirpurkhas'}</td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteDITRegistration(reg._id, reg.name)}
                                className="inline-flex items-center justify-center p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition"
                                title="Delete Application"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
