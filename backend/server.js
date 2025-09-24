import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';
import multer from 'multer';

// It **loads environment variables from a `.env` file into `process.env`**.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
/**
 * That means you’re trying to plug in the whole toolbox (multer package itself) into Express. 
 * Express doesn’t understand it → so it breaks things.
 */
// app.use(multer);

/**
 * We will create a static server to access the generated pdf,files,pictures etc.
 * Also, always use the relative path instead of absolute path because, for every user the absolute path is different'
 */
app.use(express.static("uploads"));

const startServer = async() =>{
    const connectDB = mongoose.connect(process.env.MONGO_DB_CREDS);

    app.listen(PORT , () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();


//models are used to put in the database data, which is then manipulated by controllers and routed by routes
//routes are used to route the requests to the controllers
//and these routes are used inside the main server.js file