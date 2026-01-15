import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    priority: 'MEDIUM'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Use authenticated endpoint if user is logged in, otherwise anonymous
      const endpoint = isAuthenticated 
        ? 'http://localhost:8080/api/complaints'
        : 'http://localhost:8080/api/complaints/submit'
      
      const response = await axios.post(endpoint, formData)
      setSuccess(`Complaint submitted successfully! Your tracking ID is: ${response.data.trackingId}`)
      setFormData({
        title: '',
        description: '',
        category: 'TECHNICAL',
        priority: 'MEDIUM'
      })
      
      // Redirect authenticated users to their complaints, anonymous to tracking page
      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/')
        } else {
          navigate(`/track/${response.data.trackingId}`)
        }
      }, 2000)
    } catch (err) {
      setError(err.response?.data || 'Failed to submit complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
        <h2 style={{ marginBottom: '24px' }}>
          {isAuthenticated ? 'Submit Complaint' : 'Submit Anonymous Complaint'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="TECHNICAL">Technical</option>
              <option value="BILLING">Billing</option>
              <option value="SERVICE">Service</option>
              <option value="ACCOUNT">Account</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default SubmitComplaint
