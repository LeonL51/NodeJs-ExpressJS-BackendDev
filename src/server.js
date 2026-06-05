import express from "express"; 
import { config } from "dotenv"; 
import { connectDB, disconnectDB } from "./config/db.js";

// Import Routes
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';

// Import middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

config(); 
connectDB(); 

const app = express();

// Body parsing middlewares 
app.use(express.json());
// Parse data from HTML form submission to access from req.body 
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/movies", movieRoutes); 
app.use("/auth", authRoutes);  
app.use("/watchlist", watchlistRoutes); 

// Catch requests to routes that do not exist
app.use(notFound);

// Global error handler - must be registered after all routes
app.use(errorHandler);

// Run on a port where no app is running 
const PORT = 5001; 
const server = app.listen(PORT, () => { 
    console.log(`Server running on PORT ${PORT}`); 
});

// Handle unhandled promise rejections (e.g. db connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1); 
    });
});

// Handle uncaught exceptions 
process.on("uncaughtException", async (err) => {
    console.error("Unhandled Exception:", err);
    await disconnectDB();
    process.exit(1); 
});

// Graceful shutdown 
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0); 
    });
});

// GET, POST, PUT, DELETE 
// http://localhost:5001/ 

// AUTH - signup/signin
// MOVIE - Get all movies
// USER - Profile
// Watchlist 