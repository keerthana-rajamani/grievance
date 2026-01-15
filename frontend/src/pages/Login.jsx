import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.message || 'Login failed')
    }
  }

  return (
    <Layout>
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ marginBottom: '24px' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p style={{ marginTop: '8px', textAlign: 'center' }}>
          <Link to="/submit">Submit Anonymous Complaint</Link>
        </p>
      </div>
    </Layout>
  )
}

export default Login
