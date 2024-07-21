import React, { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function CollapsibleTable({ records, handleDelete }) {
  const [open, setOpen] = useState({});

  const handleToggle = (itemId) => {
    setOpen((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  return (
    <TableContainer component={Paper} className="mt-2 dark:bg-gray-800 dark:text-white">
      <Table aria-label="collapsible table" className="dark:bg-gray-900 dark:text-white">
        <TableHead className="dark:bg-gray-800 dark:text-white">
          <TableRow>
            <TableCell className="dark:text-white" />
            <TableCell className="dark:text-white">Main Dish</TableCell>
            <TableCell className="dark:text-white">Quantity</TableCell>
            <TableCell className="dark:text-white">Protein</TableCell>
            <TableCell className="dark:text-white">Carbs</TableCell>
            <TableCell className="dark:text-white">Fiber</TableCell>
            <TableCell className="dark:text-white">Sugar</TableCell>
            <TableCell className="dark:text-white">Calories</TableCell>
            <TableCell className="dark:text-white" />
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <React.Fragment key={record.itemId}>
              <TableRow className="dark:bg-gray-800 dark:text-white">
                <TableCell className="dark:text-white">
                  <IconButton aria-label="expand row" size="small" onClick={() => handleToggle(record.itemId)} className="dark:text-white">
                    {open[record.itemId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell className="dark:text-white">{record.response.total_nutritional_content.totalDishName}</TableCell>
                <TableCell className="dark:text-white">{record.response.total_nutritional_content.quantity}</TableCell>
                <TableCell className="dark:text-white">{record.response.total_nutritional_content.proteins}</TableCell>
                <TableCell className="dark:text-white">{record.response.total_nutritional_content.carbohydrates}</TableCell>
                <TableCell className="dark:text-white">{record.response.total_nutritional_content.fiber}</TableCell>
                <TableCell className="dark:text-white">{record.response.total_nutritional_content.sugar}</TableCell>
                <TableCell className="dark:text-white">{record.response.total_nutritional_content.calories}</TableCell>
                <TableCell className="dark:text-white">
                  <IconButton aria-label="delete" size="small" onClick={() => handleDelete(record.itemId)} className="dark:text-white">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow className="dark:bg-gray-800 dark:text-white">
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9} className="dark:text-white">
                  <Collapse in={open[record.itemId]} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="h6" gutterBottom component="div" className="dark:text-white">
                        Food Items
                      </Typography>
                      <Table size="small" aria-label="food items" className="dark:bg-gray-900 dark:text-white">
                        <TableHead className="dark:bg-gray-800 dark:text-white">
                          <TableRow>
                            <TableCell className="dark:text-white">Item Name</TableCell>
                            <TableCell className="dark:text-white">Quantity</TableCell>
                            <TableCell className="dark:text-white">Protein</TableCell>
                            <TableCell className="dark:text-white">Carbs</TableCell>
                            <TableCell className="dark:text-white">Fiber</TableCell>
                            <TableCell className="dark:text-white">Sugar</TableCell>
                            <TableCell className="dark:text-white">Calories</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {record.response.food_items.map((item, index) => (
                            <TableRow key={index} className="dark:bg-gray-800 dark:text-white">
                              <TableCell className="dark:text-white">{item.name}</TableCell>
                              <TableCell className="dark:text-white">{item.quantity}</TableCell>
                              <TableCell className="dark:text-white">{item.nutritional_content.proteins}</TableCell>
                              <TableCell className="dark:text-white">{item.nutritional_content.carbohydrates}</TableCell>
                              <TableCell className="dark:text-white">{item.nutritional_content.fiber}</TableCell>
                              <TableCell className="dark:text-white">{item.nutritional_content.sugar}</TableCell>
                              <TableCell className="dark:text-white">{item.nutritional_content.calories}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export { CollapsibleTable };
