import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { startupDatabase } from './database/mongo.js';
import userRoutes from './routes/userRoutes.js';
import appRoutes from './routes/appRoutes.js';
import helmet from 'helmet';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet())

const port = process.env.PORT || 3000;

startupDatabase();

app.use('/auth', userRoutes);

app.use('/v1', appRoutes);

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is alive' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
