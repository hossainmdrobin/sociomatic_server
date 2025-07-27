// give me a code to connect mongoDB with mongoose
import mongoose from 'mongoose';
import agenda from '../agendaConfig';
import defineFacebookJob from '../jobs/postToFacebook'

const MONGO_URI = process.env.MONGODB_URI || '';
console.log(MONGO_URI)

export const connectDB = async (): Promise<void> => {
    console.log("mongoDB connection started", MONGO_URI);
    // defineFacebookJob(agenda);
    try {
        if (!MONGO_URI) {
            throw new Error('❌ MongoDB URI is not defined in environment variables');
        }
        await mongoose.connect(MONGO_URI);
        console.log('✅MongoDB connected');
        // await agenda.start();
        // console.log('✅ Agenda started');
        // agenda.on('ready', () => console.log('Agenda is ready'));
        // agenda.on('error', (err: Error) => console.error('❌ Agenda error:', err));

    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit the app on DB connection failure
    }
};