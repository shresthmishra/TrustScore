import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

const SignupPage = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { register } = authContext;

  const [user, setUser] = useState({ name: '', email: '', password: '', address: '' });
  const { name, email, password, address } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    register({ name, email, password, address });
    alert('Signup successful! Please log in.');
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up for TrustScore
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="name" label="Name" name="name" value={name} onChange={onChange} autoFocus />
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" value={email} onChange={onChange} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={password} onChange={onChange} />
          <TextField margin="normal" fullWidth id="address" label="Address" name="address" value={address} onChange={onChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;