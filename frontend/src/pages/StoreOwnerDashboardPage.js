import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const StoreOwnerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({ averageRating: 0, ratings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/owner/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>My Store Dashboard</h1>
      <h2>Average Rating: {Number(dashboardData.averageRating).toFixed(2)}</h2>
      <hr />
      <h3>Ratings Submitted by Users:</h3>
      {dashboardData.ratings.length > 0 ? (
        <ul>
          {dashboardData.ratings.map((rating, index) => (
            <li key={index}>
              <strong>{rating.name}</strong> ({rating.email}) gave a rating of <strong>{rating.rating}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ratings have been submitted for your store yet.</p>
      )}
    </div>
  );
};

export default StoreOwnerDashboardPage;