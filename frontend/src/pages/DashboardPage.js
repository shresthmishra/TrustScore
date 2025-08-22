import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import StoreItem from '../components/StoreItem';
import { Grid, TextField, Box, Typography } from '@mui/material';

const DashboardPage = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addressFilter, setAddressFilter] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/api/stores');
        setStores(res.data);
      } catch (err) {
        console.error('Error fetching stores', err);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      store.address.toLowerCase().includes(addressFilter.toLowerCase())
  );

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Stores
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Search by store name..."
          variant="outlined"
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          label="Filter by address..."
          variant="outlined"
          fullWidth
          onChange={(e) => setAddressFilter(e.target.value)}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <Grid item xs={12} sm={6} md={4} key={store.id}>
              <StoreItem store={store} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No stores match your search.</Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default DashboardPage;