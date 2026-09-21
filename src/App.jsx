import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import DITRegistration from './pages/DITRegistration';
import './index.css';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--primary)' }}>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (roleRequired && user.role?.toLowerCase() !== roleRequired?.toLowerCase()) {
     if (user.role?.toLowerCase() === 'admin') return <Navigate to="/admin" />;
     if (user.role?.toLowerCase() === 'teacher') return <Navigate to="/teacher" />;
     return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dit-registration" element={<DITRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={
            <PrivateRoute roleRequired="Admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/teacher/*" element={
            <PrivateRoute roleRequired="Teacher">
              <TeacherDashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
