import React from 'react';
import { Paper, Typography, IconButton, Divider } from '@mui/material';
import { CollapsibleTable } from './CollapsibleTable';
import { motion } from 'framer-motion';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const categorizeRecords = (records) => {
  const categories = {
    breakfast: [],
    lunch: [],
    dinner: []
  };

  records.forEach(record => {
    categories[record.mealType]?.push(record);
  });

  return categories;
};

const DailyMealsSection = ({ records, refreshRecords, handleDelete }) => {
  const categorizedRecords = categorizeRecords(records);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshRecords();
    setTimeout(() => setIsRefreshing(false), 1000); // simulate refresh time
  };

  return (
    <Paper className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <Typography variant="h5" gutterBottom>
          Today's Meals
        </Typography>
        <IconButton
          aria-label="refresh"
          onClick={handleRefresh}
          className="transition-transform transform"
          style={{ color: isRefreshing ? '#1976d2' : 'inherit' }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <RefreshIcon />
          </motion.div>
        </IconButton>
      </div>
      {['breakfast', 'lunch', 'dinner'].map((mealType) => (
        <div key={mealType} className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" className="capitalize font-semibold">
              {mealType}
            </Typography>
            {categorizedRecords[mealType].length > 0 ? (
              <CollapsibleTable
                records={categorizedRecords[mealType]}
                handleDelete={handleDelete}
              />
            ) : (
              <Typography className="mt-2 text-sm text-gray-500 dark:text-gray-400">No records for {mealType}</Typography>
            )}
          </motion.div>
          {mealType !== 'dinner' && <Divider className="my-4" />}
        </div>
      ))}
    </Paper>
  );
};

export { DailyMealsSection };
