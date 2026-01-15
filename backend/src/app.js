//create server
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';
import cors from 'cors';
const app = express()

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use('/api/v1', authRoutes);
app.use('/api/v1/food', foodRoutes);


export default app;