import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function MyComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchComplaints()
  }, [page])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8080/api/complaints/my-complaints?page=${page}&size=10`)
      setComplaints(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch complaints')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="card">Loading...</div>
  }

  return (
    <div>
      <h2>My Complaints</h2>
      {error && <div className="error">{error}</div>}
      {complaints.length === 0 ? (
        <div className="card">
          <p>No complaints found. <Link to="/submit">Submit a complaint</Link></p>
        </div>
      ) : (
        <>
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
                    <Link to={`/track/${complaint.trackingId}`}>View</Link>
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
        </>
      )}
    </div>
  )
}

export default MyComplaints
