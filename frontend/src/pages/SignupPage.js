import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';

const SignupPage = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { register } = authContext;

  const [user, setUser] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState(''); // State to hold error messages

  const { name, email, password, address } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {

      register({ name, email, password, address });
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {

      const errorMsg = err.response?.data?.errors?.[0]?.msg || 'An error occurred during signup.';
      setError(errorMsg);
    }
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
          {/* Display error message if it exists */}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={name}
            onChange={onChange}
            autoFocus
            // Add HTML5 validation attributes
            inputProps={{ minLength: 20, maxLength: 60 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email" // Use type="email" for standard email validation
            value={email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={onChange}
            // Add pattern for password validation
            inputProps={{
              minLength: 8,
              maxLength: 16,
              pattern: "^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$",
            }}
            helperText="8-16 characters, must include an uppercase letter and a special character (!@#$&*)."
          />
          <TextField
            margin="normal"
            fullWidth
            id="address"
            label="Address"
            name="address"
            value={address}
            onChange={onChange}
            inputProps={{ maxLength: 400 }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;