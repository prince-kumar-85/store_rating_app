import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      alert('Signup successful');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.log(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <br /><br />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <br /><br />

        <label>Select Role:</label>
        <br />

        <input
          type="radio"
          name="role"
          value="admin"
          checked={form.role === 'admin'}
          onChange={handleChange}
        /> Admin

        <input
          type="radio"
          name="role"
          value="user"
          checked={form.role === 'user'}
          onChange={handleChange}
          style={{ marginLeft: 10 }}
        /> User

        <input
          type="radio"
          name="role"
          value="owner"
          checked={form.role === 'owner'}
          onChange={handleChange}
          style={{ marginLeft: 10 }}
        /> Store Owner

        <br /><br />

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;