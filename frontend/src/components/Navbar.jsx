import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#eee' }}>
      <h3>Store Rating App</h3>
      <div>
        <span style={{ marginRight: '15px' }}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;