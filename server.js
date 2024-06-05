import express from 'express';
import connectDB from './config/db.js';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import { config } from 'dotenv';
import  categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
// Password: J0mllyLvWpSkwYKy
const app = express();
import cors from 'cors';

config();
//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
//database config
connectDB();
//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)

app.get('/', (req, res) => {
    res.send("hello ecommerce");
});

// app.get('/register', (req, res) => {
//     res.send("register here");
// });

app.listen(5000, () => {
    console.log("server running on port 5000");
});
