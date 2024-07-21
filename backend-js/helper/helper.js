import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, 
    message: {
        success: false,
        error: 'Too many requests, please try again after 15 minutes.'
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

export function extractJsonBody(input) {
    const regex = /``` ?json\s*([^`]*)\s*```/i;
    const match = regex.exec(input);

    if (match && match[1]) {
        const jsonString = match[1].trim();
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            throw new Error('Failed to parse response as JSON.');
        }
    } else {
        throw new Error('JSON body not found or invalid format');
    }
}




export default {
    
    limiter,
    extractJsonBody,

};