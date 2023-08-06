import mongoose from "mongoose";

export const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI!, {
            dbName: 'auth-db',
        });
        let connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connection was successful!");
        });

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is connected!');
            process.exit();
        });
    } catch (error) {
        console.log('Something went wrong while connecting to MongoDB!');
        console.error(error);
    }
}