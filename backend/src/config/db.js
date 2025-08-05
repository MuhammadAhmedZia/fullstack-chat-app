import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

export const connection  = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`db connected:  ${conn.connection.host}`);
        } catch (error) {
        console.log('db failed',error);
        
    }
}