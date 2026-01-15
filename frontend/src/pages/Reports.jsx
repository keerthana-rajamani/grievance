import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import axios from 'axios'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Reports() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/dashboard/stats')
      setStats(response.data)
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="card">Loading...</div>
  }

  if (error || !stats) {
    return <div className="card"><div className="error">{error || 'Failed to load statistics'}</div></div>
  }

  const statusData = {
    labels: ['New', 'Under Review', 'Resolved', 'Escalated'],
    datasets: [
      {
        label: 'Complaints by Status',
        data: [
          stats.newComplaints,
          stats.underReviewComplaints,
          stats.resolvedComplaints,
          stats.escalatedComplaints
        ],
        backgroundColor: [
          'rgba(0, 123, 255, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(220, 53, 69, 0.8)'
        ]
      }
    ]
  }

  const categoryData = {
    labels: Object.keys(stats.complaintsByCategory || {}),
    datasets: [
      {
        label: 'Complaints by Category',
        data: Object.values(stats.complaintsByCategory || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ]
      }
    ]
  }

  const priorityData = {
    labels: Object.keys(stats.complaintsByPriority || {}),
    datasets: [
      {
        label: 'Complaints by Priority',
        data: Object.values(stats.complaintsByPriority || {}),
        backgroundColor: [
          'rgba(108, 117, 125, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)'
        ]
      }
    ]
  }

  return (
    <div>
      <h2>Reports & Analytics</h2>
      
      <div className="card">
        <h3>Summary Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div>
            <strong>Total Complaints:</strong> {stats.totalComplaints}
          </div>
          <div>
            <strong>New:</strong> {stats.newComplaints}
          </div>
          <div>
            <strong>Under Review:</strong> {stats.underReviewComplaints}
          </div>
          <div>
            <strong>Resolved:</strong> {stats.resolvedComplaints}
          </div>
          <div>
            <strong>Escalated:</strong> {stats.escalatedComplaints}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <h3>Complaints by Status</h3>
          <Bar data={statusData} options={{ responsive: true }} />
        </div>

        <div className="card">
          <h3>Complaints by Category</h3>
          <Doughnut data={categoryData} options={{ responsive: true }} />
        </div>

        <div className="card">
          <h3>Complaints by Priority</h3>
          <Doughnut data={priorityData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  )
}

export default Reports
