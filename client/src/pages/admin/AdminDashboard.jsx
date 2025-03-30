// ✅ AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null); // נו, נו... אין יותר undefined.map()

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/dashboard', { withCredentials: true });

        setStats(res.data.stats || {});
        setCustomers(res.data.customers || []);
        setVehicles(res.data.vehicles || []);
      } catch (err) {
        setError('😵‍💫 שגיאה בטעינת נתוני הניהול');
      }
    };
    fetchAdminData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/appointments-per-day', { withCredentials: true });

        const labels = res.data.map(item => item.date);
        const data = res.data.map(item => parseInt(item.count));

        setChartData({
          labels,
          datasets: [{
            label: 'מספר תורים',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        });
      } catch (err) {
        console.error('📉 שגיאה בטעינת נתוני הגרף');
      }
    };
    fetchChartData();
  }, []);

  const handleLogout = () => {
    navigate('/admin-login');
  };

  const handleNewAdmin = () => {
    alert('🚧 בקרוב תוכל להוסיף מנהל חדש. בינתיים - תשתה מים 💧');
  };

  return (
    <div className="container text-end">
      <h2 className="fw-bold mt-4 mb-4">שלום, מנהל 👋</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* כרטיסי מידע */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>לקוחות</Card.Title>
              <Card.Text>{stats.totalCustomers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>רכבים</Card.Title>
              <Card.Text>{stats.totalVehicles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>סה"כ תורים</Card.Title>
              <Card.Text>{stats.totalAppointments}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>שירות פופולרי</Card.Title>
              <Card.Text>{stats.mostCommonService || '—'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* טבלת לקוחות */}
      {Array.isArray(customers) && customers.length > 0 && (
        <>
          <h4 className="mt-4">לקוחות רשומים</h4>
          <Table striped bordered hover responsive className="text-end">
            <thead>
              <tr>
                <th>שם</th>
                <th>טלפון</th>
                <th>אימייל</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* טבלת רכבים */}
      {Array.isArray(vehicles) && vehicles.length > 0 && (
        <>
          <h4 className="mt-4">רכבים במערכת</h4>
          <Table striped bordered hover responsive className="text-end">
            <thead>
              <tr>
                <th>דגם</th>
                <th>לוחית</th>
                <th>לקוח</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.model}</td>
                  <td>{v.plate}</td>
                  <td>{v.customer_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* גרף תורים */}
      <h4 className="mt-5">עומסים בשבוע הקרוב</h4>
      {chartData && (
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      )}

      {/* כפתורים */}
      <div className="d-flex gap-3 mt-4">
        <Button variant="primary" onClick={handleNewAdmin}>➕ הוסף מנהל חדש</Button>
        <Button variant="danger" onClick={handleLogout}>🚪 התנתק</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
