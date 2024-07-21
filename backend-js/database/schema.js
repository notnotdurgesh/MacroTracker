import mongoose from 'mongoose';

const queryResponseSchema = new mongoose.Schema({
    query: { type: String, required: true },
    response: { type: mongoose.Schema.Types.Mixed, required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    date: { type: Date, required: true, default: Date.now },
    readableDate: { type: String, required: true },
    userName: { type: String, required: true }
});

export const QueryResponse = mongoose.model('QueryResponse', queryResponseSchema);

export default { QueryResponse };
