import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

// It **loads environment variables from a `.env` file into `process.env`**.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

// Enable CORS for all origins (update origin in production)
app.use(cors({
  origin: "*", // or "https://your-frontend-domain.com" in production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

/**
 * That means you’re trying to plug in the whole toolbox (multer package itself) into Express. 
 * Express doesn’t understand it → so it breaks things.
 */
// app.use(multer);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use(postRoutes);
app.use(userRoutes);

/**
 * We will create a static server to access the generated pdf,files,pictures etc.
 * Also, always use the relative path instead of absolute path because, for every user the absolute path is different'
 */
// Serve static files from "uploads" folder
app.use(express.static("uploads"));

// Connect to MongoDB with proper TLS for Node 20+
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CREDS, {
      tls: true, // ensures Node 20+ can connect
      // tlsAllowInvalidCertificates: true, // only for testing, not production
    });
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();
//models are used to put in the database data, which is then manipulated by controllers and routed by routes
//routes are used to route the requests to the controllers
//and these routes are used inside the main server.js file
