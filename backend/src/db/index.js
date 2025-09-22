import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );

    console.log(
      `\n MongoDB connected ! DB host ${connectionInstance.connection.host}`
    );

    // console.log("✅ MongoDB connected");
    // console.log(`Host: ${connectionInstance.connection.host}`);
    // console.log(`Database: ${connectionInstance.connection.name}`);
    // console.log(`Port: ${connectionInstance.connection.port}`);
  } catch (error) {
    console.log("mongodb connection Failed", error);
    process.exit(1);
  }
};
export { connectDB };
