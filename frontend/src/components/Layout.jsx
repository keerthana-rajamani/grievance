import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div>
            <Link to="/">Grievance Portal</Link>
          </div>
          <div>
            {isAuthenticated ? (
              <>
                <Link to="/">My Complaints</Link>
                {user?.roles?.includes('ADMIN') && (
                  <>
                    <Link to="/admin">Admin Dashboard</Link>
                    <Link to="/reports">Reports</Link>
                  </>
                )}
                <span style={{ marginLeft: '20px' }}>
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ marginLeft: '20px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/submit">Submit Complaint</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="container">{children}</div>
    </div>
  )
}

export default Layout
