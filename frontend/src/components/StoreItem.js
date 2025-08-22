import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

const StoreItem = ({ store }) => {
  // Set the initial rating value to the user's previous rating, or 1 if none exists.
  const [rating, setRating] = useState(store.user_submitted_rating || 1);

  // This effect updates the rating in the form if the store prop changes
  useEffect(() => {
    setRating(store.user_submitted_rating || 1);
  }, [store.user_submitted_rating]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/stores/${store.id}/ratings`, { rating });
      alert('Thank you for your rating!');
      // Note: For a better user experience, you might want to refresh the store list
      // from the parent component here to show the updated average rating immediately.
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
        
        {/* Display the user's own rating if it exists */}
        {store.user_submitted_rating && (
          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
            Your Rating: {store.user_submitted_rating}
          </Typography>
        )}

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
          {/* Change button text based on whether a rating already exists */}
          <Button type="submit" variant="contained" size="medium">
            {store.user_submitted_rating ? 'Update Rating' : 'Rate'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoreItem;