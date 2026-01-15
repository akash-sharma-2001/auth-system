import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Mongodb Database connected successfully"))
    await mongoose.connect(`${process.env.MONGODB_URI}/authSystem`)
}

export default connectDB;