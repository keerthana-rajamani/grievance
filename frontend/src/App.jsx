import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import SubmitComplaint from './pages/SubmitComplaint'
import TrackComplaint from './pages/TrackComplaint'
import AdminDashboard from './pages/AdminDashboard'
import Reports from './pages/Reports'
import MyComplaints from './pages/MyComplaints'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './context/AuthContext'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" />
  if (!user?.roles?.includes('ADMIN')) return <Navigate to="/" />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/submit" element={<SubmitComplaint />} />
      <Route path="/track/:trackingId" element={<TrackComplaint />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <MyComplaints />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <AdminRoute>
            <Layout>
              <Reports />
            </Layout>
          </AdminRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
