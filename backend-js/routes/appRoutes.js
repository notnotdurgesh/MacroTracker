import express from 'express';
import generateResponse from '../LLM_APIS/gemini.js';
import { QueryResponse } from '../database/schema.js';
import { auth } from '../middleware/auth.js';
import { validateBody, validateQuery, generateSchema, dietRecordsSchema } from '../validations/zod.js';
import { limiter } from '../helper/helper.js';

const router = express.Router();

// Routes
router.post('/generate', limiter, auth, validateBody(generateSchema), async (req, res) => {
    const { query } = req.body;
    const userName = req.user.username;

    if (!userName) {
        return res.status(400).json({ success: false, error: 'User name is required' });
    }

    console.log('Incoming request with query:', query);

    try {
        const response = await generateResponse(query, userName);
        if (response.success) {
            res.json(response.text);
            console.log('Response generated and sent');
        } else {
            res.status(500).json(response);
            console.error('Error response generated:', response);
        }
    } catch (error) {
        console.error('Error in /generate endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/dietrecords', auth, validateQuery(dietRecordsSchema), async (req, res) => {
    const { d: dateQuery } = req.query;
    const userName = req.user.username;

    console.log('Date query:', dateQuery, 'User name:', userName);

    if (!userName) {
        return res.status(400).json({ success: false, error: 'User name is required.' });
    }

    try {
        const date = new Date(dateQuery);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ success: false, error: 'Invalid date format.' });
        }

        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const records = await QueryResponse.find({
            date: {
                $gte: startOfDay.toISOString(),
                $lte: endOfDay.toISOString()
            },
            userName: userName
        });

        if (records.length === 0) {
            return res.status(404).json({ success: false, message: 'No records found for the given date and user name.' });
        }

        const filteredRecords = records.map(record => ({
            query: record.query,
            itemId: record._id,
            response: {
                food_items: record.response.food_items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    foodType: item.foodType,
                    nutritional_content: item.nutritional_content
                })),
                total_nutritional_content: record.response.total_nutritional_content
            },
            mealType: record.mealType,
            date: record.date
        }));

        res.json({ success: true, data: filteredRecords });
    } catch (error) {
        console.error('Error in /dietrecords endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Delete record by itemId
router.delete('/record/:itemId', auth, async (req, res) => {
    const { itemId } = req.params;
    const userName = req.user.username;

    if (!userName) {
        return res.status(400).json({ success: false, error: 'User name is required' });
    }

    try {
        const record = await QueryResponse.findOneAndDelete({ _id: itemId, userName: userName });

        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found or user not authorized to delete this record' });
        }

        res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error in /record/:itemId endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


export default router;
