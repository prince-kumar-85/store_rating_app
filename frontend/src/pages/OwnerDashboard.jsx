import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';

function OwnerDashboard() {
  const [data, setData] = useState({ averageRating: null, users: [], store: null });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/owner/dashboard');
      setData(res.data);
    } catch (error) {
      alert('Failed to load owner dashboard',error);
    }
  };
  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Store Owner Dashboard</h2>
        <p>Store: {data.store?.name || 'No store assigned'}</p>
        <p>Average Rating: {data.averageRating || 'No ratings yet'}</p>

        <h3>Users Who Rated Your Store</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OwnerDashboard;