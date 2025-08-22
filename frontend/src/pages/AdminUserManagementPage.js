import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'Normal User',
  });
  const [filter, setFilter] = useState('');

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch users when the component first loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply the filter whenever the filter text or the main user list changes
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, users]);

  const { name, email, password, address, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/users', formData);
      alert('User created successfully!');
      fetchUsers(); // Refresh the user list after adding a new user
      // Clear the form
      setFormData({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    } catch (err) {
      alert('Error creating user. The email may already be in use.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add New User</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
        <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
        <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        <input type="text" placeholder="Address" name="address" value={address} onChange={onChange} />
        <select name="role" value={role} onChange={onChange}>
          <option value="Normal User">Normal User</option>
          <option value="Store Owner">Store Owner</option>
          <option value="System Administrator">System Administrator</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <hr />

      <h2>Existing Users</h2>
      <input
        type="text"
        placeholder="Filter by name or email..."
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredUsers.map((user) => (
          <li key={user.id} style={{ border: '1px solid #ddd', margin: '5px', padding: '5px' }}>
            <strong>{user.name}</strong> ({user.email})<br />
            Role: {user.role}<br />
            Address: {user.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUserManagementPage;