import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminStoreManagementPage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
  });

  // Fetch stores when the component loads
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/api/stores');
        setStores(res.data);
        setFilteredStores(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStores();
  }, []);

  // Apply filters when filter text or the main store list changes
  useEffect(() => {
    let result = stores;
    result = result.filter((store) =>
      store.name.toLowerCase().includes(filters.name.toLowerCase())
    );
    result = result.filter((store) =>
      store.email.toLowerCase().includes(filters.email.toLowerCase())
    );
    result = result.filter((store) =>
      store.address.toLowerCase().includes(filters.address.toLowerCase())
    );
    setFilteredStores(result);
  }, [filters, stores]);

  const onChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Store Management</h2>
      <div>
        <input
          type="text"
          placeholder="Filter by name..."
          name="name"
          onChange={onChange}
        />
        <input
          type="text"
          placeholder="Filter by email..."
          name="email"
          onChange={onChange}
        />
        <input
          type="text"
          placeholder="Filter by address..."
          name="address"
          onChange={onChange}
        />
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredStores.map((store) => (
          <li key={store.id} style={{ border: '1px solid #ddd', margin: '5px', padding: '5px' }}>
            <strong>{store.name}</strong> ({store.email})<br />
            Address: {store.address}<br />
            Average Rating: {Number(store.average_rating).toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminStoreManagementPage;