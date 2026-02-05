import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import GroupView from './pages/GroupView';
import AdminPanel from './pages/AdminPanel';
import MyRequests from './pages/MyRequests';
import ManagedGroups from './pages/ManagedGroups';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/managed-groups" element={<ManagedGroups />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/groups/:id" element={<GroupView />} />
          <Route path="/admin" element={<AdminPanel />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
