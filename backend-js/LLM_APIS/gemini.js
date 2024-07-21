import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from '@google/generative-ai';
import prompt from './prompt.js';
import { saveQueryResponse } from '../database/mongo.js';
import { extractJsonBody } from '../helper/helper.js';
import { responseSchema } from '../validations/zod.js';

// Function to generate response from Google Generative AI
export const generateResponse = async (query, userName) => {
    const geminiApiKey = process.env.API_KEY;
    const googleAI = new GoogleGenerativeAI(geminiApiKey);

    const geminiConfig = {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 4096,
    };

    const geminiModel = googleAI.getGenerativeModel({
        model: 'gemini-pro',
        geminiConfig,
    });

    const generateContent = async (promptText, userName) => {
        try {
            const result = await geminiModel.generateContent(promptText);
            let text = result.response.text();
            console.log('Response Generated: ', text);
            if ((text.startsWith('```json')) || (text.startsWith('``` json')) || (text.startsWith('``` JSON')) || (text.startsWith('```JSON'))) {
                try {
                    text = extractJsonBody(text); // Extract JSON from format
                    responseSchema.parse(text); // Validate the JSON response
                    await saveQueryResponse(query, text, userName);
                    return { success: true, text };
                } catch (error) {
                    console.log("Error validating or parsing the JSON", error.message);
                    return { success: false, error: "Query not Understood" };
                }
            } else {
                try {
                    text = JSON.parse(text); 
                    responseSchema.parse(text); // Validate the JSON response
                    await saveQueryResponse(query, text, userName);
                    return { success: true, text };
                } catch (error) {
                    console.log("Error validating or parsing the JSON", error);
                    return { success: false, error: "Query not Understood" };
                }
            }
        } catch (error) {
            console.error('Error in generateContent function:', error);
            if (error instanceof GoogleGenerativeAIFetchError) {
                console.error("bad API key or API is BAD")
                return { success: false, error: 'Sorry from Backend' };
            } else {
                return { success: false, error: 'Please be respectful or be banned forever!' };
            }
        }
    };

    const promptText = prompt + query.trim();
    return await generateContent(promptText, userName);
};

export default generateResponse;