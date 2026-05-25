import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected!");
    });

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    })
  } catch (error) {
    console.log(error);
  }
}
