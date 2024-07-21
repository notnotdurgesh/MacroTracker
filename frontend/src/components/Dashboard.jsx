import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Snackbar, Alert, CircularProgress,
  Container, Box, CssBaseline
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DailyMealsSection } from './DailyMealsSection';
import { NutritionalTotals } from './NutritionalTotals';
import { PastRecordsSection } from './PastRecordsSection';

const Dashboard = ({ notify }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [dailyRecords, setDailyRecords] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, sugar: 0, quantity: 0 });
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const theme = useTheme();

  useEffect(() => {
    fetchDailyRecords();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [dailyRecords]);

  const fetchDailyRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const date = new Date().toISOString().split('T')[0];
      const serverResponse = await axios.get(`${serverUrl}/v1/dietrecords`, { params: { d: date }, ...config });
      setDailyRecords(serverResponse.data.data);
    } catch (error) {
      console.error('Error fetching daily records:', error);
    }
  };

  const calculateTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalSugar = 0;
    let totalQuantity = 0;

    dailyRecords.forEach(record => {
      const { total_nutritional_content } = record.response;
      
      // Ensure numerical values and handle missing data
      totalCalories += parseInt(total_nutritional_content.calories) || 0;
      totalProtein += parseInt(total_nutritional_content.proteins) || 0;
      totalCarbs += parseInt(total_nutritional_content.carbohydrates) || 0;
      totalSugar += parseInt(total_nutritional_content.sugar) || 0;
      totalQuantity += parseInt(total_nutritional_content.quantity) || 0;
    });

    setTotals({
      calories: totalCalories + " kcal",
      protein: totalProtein,
      carbs: totalCarbs,
      sugar: totalSugar,
      quantity: (totalQuantity ) + " g"  // Convert grams to kilograms
    });
  };

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const serverResponse = await axios.post(`${serverUrl}/v1/generate`, { query }, config);
      setResponse(serverResponse.data);
      notify('Query generated successfully', 'success');
      fetchDailyRecords(); // Refresh daily records after generating a new one
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate query';
      setNotification({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const serverResponse = await axios.delete(`${serverUrl}/v1/record/${itemId}`, config);
      if (serverResponse.data.success) {
        notify('Food item deleted successfully', 'success');
        setDailyRecords(prevRecords => prevRecords.filter(record => record.itemId !== itemId));
      } else {
        notify(serverResponse.data.message, 'error');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete food item';
      notify(errorMessage, 'error');
    }
  };

  const handleNotificationClose = () => setNotification({ ...notification, open: false });

  return (
    <Container className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <CssBaseline />
      <Box className="mb-4">
        <TextField
          fullWidth
          label="Enter your query"
          variant="outlined"
          value={query}
          onChange={handleQueryChange}
          InputLabelProps={{ style: { color: 'inherit' } }}
          InputProps={{ style: { color: 'inherit' } }}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? <CircularProgress size={24} /> : 'Record'}
      </Button>
      <NutritionalTotals totals={totals} />
      <DailyMealsSection records={dailyRecords} refreshRecords={fetchDailyRecords} handleDelete={handleDelete} />
       {/* <PastRecordsSection serverUrl={serverUrl} token={localStorage.getItem('token')} notify={notify} /> */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export { Dashboard };
