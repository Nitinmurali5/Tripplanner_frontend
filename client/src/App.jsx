import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTrip from './pages/CreateTrip';
import TripDetail from './pages/TripDetail';
import ExpenseManager from './pages/ExpenseManager';
import Collaborators from './pages/Collaborators';
import AdminDashboard from './pages/AdminDashboard';
import OurVision from './pages/OurVision';
import Destinations from './pages/Destinations';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="vision" element={<OurVision />} />
            <Route path="destinations" element={<Destinations />} />
            
            {/* Protected Client Routes */}
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="trips/new" 
              element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="trips/:id" 
              element={
                <ProtectedRoute>
                  <TripDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="trips/:id/expenses" 
              element={
                <ProtectedRoute>
                  <ExpenseManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="trips/:id/collaborators" 
              element={
                <ProtectedRoute>
                  <Collaborators />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
