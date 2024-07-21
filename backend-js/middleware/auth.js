import jwt from 'jsonwebtoken';
import { User } from '../database/user.js'; 

export const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ success: false, error: 'Access Denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded._id);
        if (!user) {
            console.log("User not found with ID: ", decoded.id);
            throw new Error('Invalid User');
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Auth error in middleware: ", error);
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

export default auth;
