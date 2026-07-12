import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Feed from './pages/Feed';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={
        <ProtectedRoute>
          <Feed />
        </ProtectedRoute>
      }
      />
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
