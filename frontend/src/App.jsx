import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Import all your pages
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Calendar from './pages/Calendar';
import Billing from './pages/Billing';
import MedicalRecords from './pages/MedicalRecords'; // Your new page!
import ProtectedRoute from './components/ProtectedRoute';
import Inventory from './pages/Inventory';

function App() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading VetVantage...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Master Navigation Bar */}
      <header className="flex items-center justify-between p-4 text-white shadow-md bg-primary">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-wide">VetVantage</h1>

          {/* Links only show if the user is logged in */}
          {user && (
            <nav className="hidden gap-6 md:flex font-medium">
              <Link to="/dashboard" className="transition hover:text-green-200">Dashboard</Link>
              <Link to="/calendar" className="transition hover:text-green-200">Appointments</Link>

              {/* Staff-Only Links */}
              {(user.role === 'staff' || user.role === 'admin') && (
                <>
                  <Link to="/records" className="transition hover:text-green-200">Medical Records</Link>
                  <Link to="/billing" className="transition hover:text-green-200">Billing</Link>
                  <Link to="/inventory" className="transition hover:text-green-200">Inventory</Link>
                </>
              )}
            </nav>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">Logged in as: <span className="font-bold">{user.role}</span></span>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm bg-red-500 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

          {/* Dashboard Route (Splits based on role) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'staff' || user?.role === 'admin' ? <StaffDashboard /> : <OwnerDashboard />}
              </ProtectedRoute>
            }
          />

          {/* Shared Route */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />

          {/* Staff-Only Routes */}
          <Route
            path="/records"
            element={
              <ProtectedRoute requireStaff={true}>
                <MedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute requireStaff={true}>
                <Billing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute requireStaff={true}>
                <Inventory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;