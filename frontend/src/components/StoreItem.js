import React, { useState } from 'react';
import api from '../utils/api';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

const StoreItem = ({ store }) => {
  const [rating, setRating] = useState(1);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/stores/${store.id}/ratings`, { rating });
      alert('Thank you for your rating!');
    } catch (err) {
      console.error('Error submitting rating', err);
      alert('Failed to submit rating.');
    }
  };

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {store.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {store.address}
        </Typography>
        <Typography variant="body2">
          Average Rating: {Number(store.average_rating).toFixed(1)}
        </Typography>
        <Box component="form" onSubmit={handleRatingSubmit} sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Your Rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            inputProps={{ min: 1, max: 5 }}
            size="small"
            sx={{ mr: 1, width: '100px' }}
            required
          />
          <Button type="submit" variant="contained" size="medium">Rate</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoreItem;