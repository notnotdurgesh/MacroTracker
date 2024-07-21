import mongoose from 'mongoose';
import { QueryResponse } from './schema.js';

export function startupDatabase() {
    const mongoUri = process.env.MONGO_URI; // MongoDB Atlas URI
    mongoose.connect(mongoUri);
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}

// Function to save query and response to MongoDB
export const saveQueryResponse = async (query, response, userName) => {
    const mealType = determineMealType();
    const readableDate = formatDate(new Date());
    const queryResponse = new QueryResponse({
        query,
        response,
        mealType,
        readableDate,
        userName
    });

    try {
        await queryResponse.save();
        console.log('Saved query and response to MongoDB:', { query });
    } catch (error) {
        console.error('Error saving query response:', error);
    }
};



// function for readability
function formatDate(date) {
    // Ensure date is valid
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error('Invalid date');
    }

    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    const dtf = new Intl.DateTimeFormat('en-GB', options);
    const [{ value: day }, , { value: month }, , { value: year }, , { value: hour }, , { value: minute }] = dtf.formatToParts(date);

    let suffix = 'th';
    if (day === '1' || day === '21' || day === '31') {
        suffix = 'st';
    } else if (day === '2' || day === '22') {
        suffix = 'nd';
    } else if (day === '3' || day === '23') {
        suffix = 'rd';
    }

    return `${day}${suffix} ${month} ${year}, ${hour}:${minute}`;
}

// Function to determine meal type based on current time
const determineMealType = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
        return 'breakfast';
    } else if (hour >= 12 && hour < 18) {
        return 'lunch';
    } else {
        return 'dinner';
    }
};

export default {

    startupDatabase,
    saveQueryResponse,
    QueryResponse,

};
