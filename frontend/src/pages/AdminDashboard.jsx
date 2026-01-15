import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  })
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [updateForm, setUpdateForm] = useState({
    newStatus: '',
    adminComments: ''
  })

  useEffect(() => {
    fetchComplaints()
  }, [page, filters])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), size: '10' })
      if (filters.status) params.append('status', filters.status)
      if (filters.category) params.append('category', filters.category)
      if (filters.priority) params.append('priority', filters.priority)

      const response = await axios.get(`http://localhost:8080/api/admin/complaints?${params}`)
      setComplaints(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
    setPage(0)
  }

  const handleStatusUpdate = async (complaintId) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/complaints/${complaintId}/status`, updateForm)
      setSelectedComplaint(null)
      setUpdateForm({ newStatus: '', adminComments: '' })
      // Refresh the complaints list
      await fetchComplaints()
      alert('Status updated successfully!')
    } catch (err) {
      alert(err.response?.data || 'Failed to update status')
    }
  }

  if (loading) {
    return <div className="card">Loading...</div>
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="NEW">New</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="TECHNICAL">Technical</option>
              <option value="BILLING">Billing</option>
              <option value="SERVICE">Service</option>
              <option value="ACCOUNT">Account</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Priority</label>
            <select name="priority" value={filters.priority} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Update Status</h3>
          <div className="form-group">
            <label>New Status</label>
            <select
              value={updateForm.newStatus}
              onChange={(e) => setUpdateForm({ ...updateForm, newStatus: e.target.value })}
            >
              <option value="">Select Status</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>
          <div className="form-group">
            <label>Admin Comments</label>
            <textarea
              value={updateForm.adminComments}
              onChange={(e) => setUpdateForm({ ...updateForm, adminComments: e.target.value })}
              rows="3"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => handleStatusUpdate(selectedComplaint.id)}
              disabled={!updateForm.newStatus}
            >
              Update Status
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedComplaint(null)
                setUpdateForm({ newStatus: '', adminComments: '' })
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.trackingId}</td>
              <td>{complaint.title}</td>
              <td>{complaint.category}</td>
              <td><span className={`priority-badge priority-${complaint.priority}`}>{complaint.priority}</span></td>
              <td><span className={`status-badge status-${complaint.status}`}>{complaint.status}</span></td>
              <td>{new Date(complaint.createdAt).toLocaleString()}</td>
              <td>
                <Link to={`/track/${complaint.trackingId}`} style={{ marginRight: '10px' }}>View</Link>
                {complaint.status !== 'RESOLVED' && complaint.status !== 'ESCALATED' && (
                  <button
                    className="btn btn-primary"
                    style={{ padding: '4px 8px', fontSize: '14px' }}
                    onClick={() => {
                      setSelectedComplaint(complaint)
                      setUpdateForm({ newStatus: '', adminComments: '' })
                    }}
                  >
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span style={{ padding: '10px' }}>Page {page + 1} of {totalPages}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
