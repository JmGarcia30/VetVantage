import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import OwnerDashboard from './pages/OwnerDashboard'; // New import
import StaffDashboard from './pages/StaffDashboard'; // New import

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading VetVantage...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 text-white shadow-md bg-primary">
        <h1 className="text-2xl font-bold tracking-wide">VetVantage</h1>
        {user && <span className="text-sm font-medium">Logged in as: {user.role}</span>}
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {/* Dynamically render the dashboard based on the user's database role */}
                {user?.role === 'staff' || user?.role === 'admin' ? <StaffDashboard /> : <OwnerDashboard />}
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;