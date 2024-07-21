import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// Define keyframes for animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Define styles for the component
const paperStyle = {
  animation: `${fadeIn} 0.5s ease-in-out`,
};

const NutritionalTotals = ({ totals }) => {
  return (
    <Paper
      className="mt-4 p-6 rounded-lg shadow-lg dark:bg-gray-900 bg-white"
      style={paperStyle}
    >
      <Typography
        variant="h5"
        gutterBottom
        className="text-primary dark:text-primary-light"
      >
        Today's Nutritional Totals
      </Typography>
      <Box className="grid grid-cols-2 gap-4">
        <Typography className="text-gray-700 dark:text-gray-300">
          Total Calories: <span className="font-bold">{totals.calories}</span>
        </Typography>
        <Typography className="text-gray-700 dark:text-gray-300">
          Total Protein: <span className="font-bold">{totals.protein}g</span>
        </Typography>
        <Typography className="text-gray-700 dark:text-gray-300">
          Total Carbs: <span className="font-bold">{totals.carbs}g</span>
        </Typography>
        <Typography className="text-gray-700 dark:text-gray-300">
          Total Sugar: <span className="font-bold">{totals.sugar}g</span>
        </Typography>
        <Typography className="text-gray-700 dark:text-gray-300">
          Total Quantity: <span className="font-bold">{totals.quantity}</span>
        </Typography>
      </Box>
    </Paper>
  );
};

export { NutritionalTotals };
