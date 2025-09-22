import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.routes.js';

// It **loads environment variables from a `.env` file into `process.env`**.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());
app.use(postRoutes);

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