import express from 'express';
import morgan from 'morgan';
import usersRoutes from './routes/users.route.js'
const app = express();

// Middlewares
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/users', usersRoutes)

export default app;
