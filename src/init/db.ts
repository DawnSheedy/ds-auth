import mongoose from "mongoose";

// Connect to database
mongoose.connect(process.env.MONGO_URI ?? "");

// Log connection errors
mongoose.connection.on("error", (error) => {
  console.error("🥭 MongoDB Connection Error!", error);
});
