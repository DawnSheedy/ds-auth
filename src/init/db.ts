import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;

// Connect to database
if (mongoURI) {
  mongoose.connect(mongoURI);

  // Log connection errors
  mongoose.connection.on("error", (error) => {
    console.error("🥭 MongoDB Connection Error!", error);
  });
} else {
  console.error("🥭 MONGO_URI not defined in env.");
}
