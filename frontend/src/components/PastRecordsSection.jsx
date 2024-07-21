import React, { useState, useEffect } from 'react';
import { TextField, Box, CircularProgress, Typography, Card, CardContent, Grid, Collapse, IconButton } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

const PastRecordsSection = ({ serverUrl, token, notify }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pastRecords, setPastRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchPastRecords(selectedDate);
  }, [selectedDate]);

  const fetchPastRecords = async (date) => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const dateString = date.toISOString().split('T')[0];
      const response = await axios.get(`${serverUrl}/v1/dietrecords`, { params: { d: dateString }, ...config });
      setPastRecords(response.data.data);
    } catch (error) {
      notify('Failed to fetch records for the selected date', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleExpandClick = (id) => {
    setExpanded((prevExpanded) => ({ ...prevExpanded, [id]: !prevExpanded[id] }));
  };

  const renderNutritionalContent = (content) => (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="body2">Proteins: {content.proteins}</Typography>
        <Typography variant="body2">Carbs: {content.carbohydrates}</Typography>
        <Typography variant="body2">Fats: {content.fats}</Typography>
        <Typography variant="body2">Calories: {content.calories}</Typography>
        <Typography variant="body2">Fiber: {content.fiber}</Typography>
        <Typography variant="body2">Sugar: {content.sugar}</Typography>
      </Grid>
    </Grid>
  );

  const renderRecord = (record) => (
    <Card key={record.itemId} className="mb-2">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{record.response.total_nutritional_content.totalDishName}</Typography>
          <IconButton onClick={() => handleExpandClick(record.itemId)}>
            {expanded[record.itemId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        {renderNutritionalContent(record.response.total_nutritional_content)}
        <Collapse in={expanded[record.itemId]} timeout="auto" unmountOnExit>
          {record.response.food_items.map((item, index) => (
            <Box key={index} mt={2}>
              <Typography variant="subtitle1" color="primary">{item.name} - {item.quantity}</Typography>
              {renderNutritionalContent(item.nutritional_content)}
            </Box>
          ))}
        </Collapse>
      </CardContent>
    </Card>
  );

  return (
    <Box className="mt-4">
      <Typography variant="h5">View Past Records</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          disableFuture
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>
      {loading ? (
        <Box display="flex" justifyContent="center" className="mt-4">
          <CircularProgress />
        </Box>
      ) : (
        <Box className="mt-4">
          {pastRecords.length === 0 ? (
            <Typography>No records found for the selected date.</Typography>
          ) : (
            pastRecords.map((record) => renderRecord(record))
          )}
        </Box>
      )}
    </Box>
  );
};

export { PastRecordsSection };
