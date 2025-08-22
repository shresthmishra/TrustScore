import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';


const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getStats();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Total Users: {stats.users}</h2>
        <h2>Total Stores: {stats.stores}</h2>
        <h2>Total Ratings: {stats.ratings}</h2>
      </div>
      <hr />
      <nav>
        <Link to="/admin/users" style={{ marginRight: '10px' }}>Manage Users</Link>
        <Link to="/admin/stores">Manage Stores</Link>
      </nav>
    </div>
  );
};


export default AdminDashboardPage;