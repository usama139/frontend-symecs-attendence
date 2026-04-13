import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import './index.css';

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--primary)' }}>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (roleRequired && user.role !== roleRequired) {
     if (user.role === 'Admin') return <Navigate to="/admin" />;
     if (user.role === 'Teacher') return <Navigate to="/teacher" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
