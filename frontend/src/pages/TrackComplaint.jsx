import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'

function TrackComplaint() {
  const { trackingId } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8080/api/complaints/track/${trackingId}`)
        setComplaint(response.data)
        setError('')
      } catch (err) {
        setError(err.response?.data || 'Complaint not found')
        setComplaint(null)
      } finally {
        setLoading(false)
      }
    }

    if (trackingId) {
      fetchComplaint()
    }
  }, [trackingId])

  if (loading) {
    return (
      <Layout>
        <div className="card">Loading...</div>
      </Layout>
    )
  }

  if (error || !complaint) {
    return (
      <Layout>
        <div className="card">
          <div className="error">{error || 'Complaint not found'}</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="card">
        <h2>Complaint Status</h2>
        <p><strong>Tracking ID:</strong> {complaint.trackingId}</p>
        <p><strong>Title:</strong> {complaint.title}</p>
        <p><strong>Description:</strong> {complaint.description}</p>
        <p><strong>Category:</strong> {complaint.category}</p>
        <p><strong>Priority:</strong> <span className={`priority-badge priority-${complaint.priority}`}>{complaint.priority}</span></p>
        <p><strong>Status:</strong> <span className={`status-badge status-${complaint.status}`}>{complaint.status}</span></p>
        <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>

        <h3 style={{ marginTop: '24px' }}>Timeline</h3>
        <div style={{ marginTop: '16px' }}>
          {complaint.timeline && complaint.timeline.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Old Status</th>
                  <th>New Status</th>
                  <th>Comments</th>
                  <th>Updated By</th>
                </tr>
              </thead>
              <tbody>
                {complaint.timeline.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>{item.oldStatus || 'N/A'}</td>
                    <td><span className={`status-badge status-${item.newStatus}`}>{item.newStatus}</span></td>
                    <td>{item.adminComments || '-'}</td>
                    <td>{item.updatedByName || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No timeline entries</p>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default TrackComplaint
