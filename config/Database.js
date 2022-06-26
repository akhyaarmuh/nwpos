import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
  mongoose.connect(process.env.MONGODB_URI);
  console.log("Database Connected");
} catch (error) {
  if (error) {
    console.log(error);
  }
}

// export default mongoose.connection;
