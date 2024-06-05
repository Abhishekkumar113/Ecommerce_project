import mongoose from 'mongoose';

// MongoDB connection URI (replace with your actual URI)

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

export default connectDB;
