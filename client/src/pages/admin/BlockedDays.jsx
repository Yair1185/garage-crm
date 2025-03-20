// client/src/pages/admin/BlockedDays.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Form } from 'react-bootstrap';

const BlockedDays = () => {
  const [blockedDays, setBlockedDays] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchBlockedDays();
  }, []);

  const fetchBlockedDays = async () => {
    const res = await axios.get('http://localhost:5000/blockedDays');
    setBlockedDays(res.data);
  };

  const blockDay = async () => {
    await axios.post('http://localhost:5000/blockedDays/block', { date });
    setDate('');
    fetchBlockedDays();
  };

  const unblockDay = async (date) => {
    await axios.delete(`http://localhost:5000/blockedDays/unblock/${date}`);
    fetchBlockedDays();
  };

  return (
    <div>
      <h2>Manage Blocked Days</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Select Date</Form.Label>
          <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Form.Group>
        <Button onClick={blockDay}>Block Date</Button>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {blockedDays.map((day) => (
            <tr key={day.id}>
              <td>{day.date}</td>
              <td>
                <Button variant="danger" onClick={() => unblockDay(day.date)}>
                  Unblock
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BlockedDays;
