import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  ClipboardList, 
  History, 
  LogOut, 
  Search, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  School, 
  Clock, 
  Check, 
  X, 
  ShieldCheck,
  Save,
  Menu
} from 'lucide-react';

const TeacherDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const [view, setView] = useState('mark'); // 'mark' | 'history'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [students, setStudents] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [markings, setMarkings] = useState({});
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  const fetchTeacherClasses = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/teacher/classes`, { headers });
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    if (view === 'history') {
      axios.get(`${apiUrl}/api/teacher/attendance`, { headers })
        .then(res => setAttendances(res.data))
        .catch(console.error);
    } else if (view === 'mark' && selectedClassId) {
      // Fetch students for selected class
      axios.get(`${apiUrl}/api/teacher/classes/${selectedClassId}/students`, { headers })
        .then(res => setStudents(res.data))
        .catch(console.error);
           
      // Fetch existing attendance marked today
      axios.get(`${apiUrl}/api/teacher/attendance`, { headers })
        .then(res => {
          const existing = res.data.filter(a => a.classId?._id === selectedClassId && a.date === date);
          const initialMarks = {};
          existing.forEach(a => {
            initialMarks[a.studentId?._id || a.studentId] = a.status;
          });
          setMarkings(initialMarks);
        })
        .catch(console.error);
    }
  }, [view, selectedClassId, date]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleMarkClick = (studentId, status) => {
    setMarkings(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status) => {
    const newMarks = {};
    students.forEach(s => {
      newMarks[s._id] = status;
    });
    setMarkings(newMarks);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId) {
      showMsg('error', 'Please select a class session to save attendance.');
      return;
    }

    const records = Object.keys(markings).map(studentId => ({
      studentId,
      status: markings[studentId]
    }));

    if (records.length === 0) {
      showMsg('error', 'Please mark attendance status for students first.');
      return;
    }

    setIsSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/teacher/attendance`, {
        classId: selectedClassId,
        date,
        records
      }, { headers });

      showMsg('success', `Attendance for ${selectedClassName} on ${date} saved to server!`);
    } catch (err) {
      showMsg('error', err.response?.data?.msg || 'Error saving attendance session');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredHistory = attendances.filter(record => {
    let match = true;
    if (filterClass && record.classId?._id !== filterClass) match = false;
    if (filterDate && record.date !== filterDate) match = false;
    return match;
  });

  const selectedClassName = classes.find(c => c._id === selectedClassId)?.name || 'Class Session';

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
            <span className="font-extrabold text-sm text-white">Faculty Desk</span>
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
              <h2 className="text-base font-extrabold text-white tracking-tight">SYMECS Faculty</h2>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold block">Teacher Desk</span>
            </div>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          <button
            onClick={() => { setView('mark'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'mark' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ClipboardList size={18} />
            <span>Mark Attendance</span>
          </button>

          <button
            onClick={() => { setView('history'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
              view === 'history' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History size={18} />
            <span>Attendance History</span>
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
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">
              {view === 'mark' ? 'Daily Attendance Session' : 'Faculty Attendance History'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <UserCheck size={16} className="text-cyan-400" />
              <span className="font-semibold text-white">{user?.name || 'Faculty Instructor'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold">Teacher</span>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Status Alert Notification */}
          {message.text && (
            <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
              message.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            }`}>
              {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* VIEW: MARK ATTENDANCE */}
          {view === 'mark' && (
            <div className="space-y-6">
              
              {/* Class & Date Controls Bar */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      1. Select Assigned Class / Batch:
                    </label>
                    <select
                      value={selectedClassId}
                      onChange={e => setSelectedClassId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      {classes.length === 0 ? (
                        <option value="">-- No Classes Assigned Yet --</option>
                      ) : (
                        classes.map(c => (
                          <option key={c._id} value={c._id}>{c.name} ({c.timing})</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      2. Session Date:
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Quick Action Buttons */}
                {selectedClassId && students.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMarkAll('Present')}
                        className="px-3.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition"
                      >
                        ✓ Mark All Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkAll('Absent')}
                        className="px-3.5 py-1.5 text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition"
                      >
                        ✕ Mark All Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarkings({})}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        Reset All
                      </button>
                    </div>

                    <span className="text-xs text-slate-400">
                      Enrolled: <strong className="text-cyan-300">{students.length} Students</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Students Marking Table */}
              {!selectedClassId && (
                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
                  Please select a class above to load enrolled students.
                </div>
              )}

              {selectedClassId && students.length === 0 && (
                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
                  No students are enrolled in <strong className="text-white">{selectedClassName}</strong> yet. Admin can assign students to this class in the Admin Panel.
                </div>
              )}

              {selectedClassId && students.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">S.No</th>
                          <th className="py-3 px-4">Student Name</th>
                          <th className="py-3 px-4">Father's Name</th>
                          <th className="py-3 px-4 text-center">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                        {students.map((student, idx) => {
                          const currentMark = markings[student._id];
                          return (
                            <tr key={student._id} className="hover:bg-slate-800/40 transition">
                              <td className="py-3.5 px-4 text-slate-400 font-bold">{idx + 1}</td>
                              <td className="py-3.5 px-4 font-bold text-white">{student.name}</td>
                              <td className="py-3.5 px-4 text-slate-300">{student.fatherName || 'N/A'}</td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center justify-center gap-3">
                                  
                                  {/* Present */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkClick(student._id, 'Present')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                      currentMark === 'Present'
                                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                        : 'bg-slate-950 text-slate-400 hover:text-emerald-300 border border-slate-800'
                                    }`}
                                  >
                                    <Check size={14} />
                                    <span>Present</span>
                                  </button>

                                  {/* Absent */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkClick(student._id, 'Absent')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                      currentMark === 'Absent'
                                        ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                        : 'bg-slate-950 text-slate-400 hover:text-red-300 border border-slate-800'
                                    }`}
                                  >
                                    <X size={14} />
                                    <span>Absent</span>
                                  </button>

                                  {/* Late */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkClick(student._id, 'Late')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                      currentMark === 'Late'
                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                        : 'bg-slate-950 text-slate-400 hover:text-amber-300 border border-slate-800'
                                    }`}
                                  >
                                    <Clock size={14} />
                                    <span>Late</span>
                                  </button>

                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Save Footer Action */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                      Marked: <strong className="text-cyan-300">{Object.keys(markings).length} / {students.length}</strong> students
                    </p>

                    <button
                      onClick={handleSaveAttendance}
                      disabled={isSaving}
                      className="px-8 py-3.5 font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-xl shadow-lg shadow-cyan-500/25 hover:opacity-95 transition flex items-center gap-2"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Attendance Session</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* VIEW: ATTENDANCE HISTORY */}
          {view === 'history' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white">Class Session Logs & History</h3>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Filter by Class</label>
                    <select
                      value={filterClass}
                      onChange={e => setFilterClass(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">-- All Assigned Classes --</option>
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

                {/* History Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4">Session Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                      {filteredHistory.map((rec, idx) => (
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

        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
