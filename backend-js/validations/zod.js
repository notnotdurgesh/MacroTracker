import { z } from 'zod';

// Define Zod schemas
export const registerSchema = z.object({
    username: z.string().min(1, 'Username is required').max(100),
    password: z.string().min(6, 'Password must be at least 6 characters long').max(100),
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required').max(100),
    password: z.string().min(1, 'Password is required').max(100),
});


// Zod schemas
export const generateSchema = z.object({
    query: z.string().min(1, {message:"Query is required"})
});

export const dietRecordsSchema = z.object({
    d: z.string().date().min(1, {message:"Date is required in the format YYYY-MM-DD"})
});

// Define the Zod schema for food items
export const foodItemSchema = z.object({
    name: z.string().nullable(),
    quantity: z.string().nullable(),
    foodType: z.enum(['JunkFood', 'GoodFood']).nullable(),
    nutritional_content: z.object({
        carbohydrates: z.string().nullable(),
        proteins: z.string().nullable(),
        fats: z.string().nullable(),
        calories: z.string().nullable(),
        fiber: z.string().nullable(),
        sugar: z.string().nullable(),
        cholesterol: z.string().nullable(),
        sodium: z.string().nullable(),
        extra: z.array(z.object({
            name: z.string().nullable(),
            value: z.string().nullable()
        })).default([]) // Set default to an empty array
    }).nullable()
});

// Define the Zod schema for the response
export const responseSchema = z.object({
    food_items: z.array(foodItemSchema).nullable(),
    total_nutritional_content: z.object({
        totalDishName: z.string().nullable(),
        quantity: z.string().nullable(),
        carbohydrates: z.string().nullable(),
        proteins: z.string().nullable(),
        fats: z.string().nullable(),
        calories: z.string().nullable(),
        fiber: z.string().nullable(),
        sugar: z.string().nullable(),
        cholesterol: z.string().nullable(),
        sodium: z.string().nullable(),
        extra: z.array(z.object({
            name: z.string().nullable(),
            value: z.string().nullable()
        })).default([]) // Set default to an empty array
    }).nullable(),
    comment: z.string().nullable() // Allow comment to be null
});



// Validation middleware
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (e) {
        console.log("error while authentication in Endpoint", e)
        res.status(400).send({ success: false, error: 'Invalid request data.' });
    }
};


// Validation middleware
export const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        // Log the detailed error on the server for debugging
        console.error("Error occurred while Zod validation of body", result.error.errors);
        
        // Send a generic error message to the client
        return res.status(400).json({ success: false, message: "Invalid request data" });
    }
    req.body = result.data;
    next();
};

export const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        // Log the detailed error on the server for debugging
        console.error("Error occurred while Zod validation of query", result.error.errors);
        
        // Send a generic error message to the client
        return res.status(400).json({ success: false, message: "Invalid query parameters" });
    }
    req.query = result.data;
    next();
};

export default {
    generateSchema,
    dietRecordsSchema,
    foodItemSchema,
    responseSchema,
    registerSchema,
    loginSchema,
    validate,
    validateBody,
    validateQuery,


}