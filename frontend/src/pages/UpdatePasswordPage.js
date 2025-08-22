import React, { useState } from 'react';
import api from '../utils/api';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

const UpdatePasswordPage = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });

  const { currentPassword, newPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/api/users/password', formData);
      alert(res.data.msg);
    } catch (err) {
      alert(err.response.data.msg || 'Error updating password.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Update Your Password
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth name="currentPassword" label="Current Password" type="password" value={currentPassword} onChange={onChange} />
          <TextField margin="normal" required fullWidth name="newPassword" label="New Password" type="password" value={newPassword} onChange={onChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Update Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdatePasswordPage;