import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await API.get(`/user/stores?name=${name}&address=${address}`);
      setStores(res.data);
    } catch (error) {
      alert('Failed to load stores',error);
    }
  };
  const handleRate = async (storeId, rating) => {
    try {
      await API.post('/user/rate-store', { store_id: storeId, rating: Number(rating) });
      alert('Rating submitted');
      fetchStores();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to rate store');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>User Dashboard</h2>
        <input placeholder="Search by name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Search by address" value={address} onChange={(e) => setAddress(e.target.value)} style={{ marginLeft: 10 }} />
        <button onClick={fetchStores} style={{ marginLeft: 10 }}>Search</button>
         <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Submit / Modify</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.overall_rating || 'No ratings'}</td>
                <td>{store.user_rating || 'Not rated'}</td>
                <td>
                  <select defaultValue={store.user_rating || ''} onChange={(e) => handleRate(store.id, e.target.value)}>
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
          </div>
  );
}
export default UserDashboard;