import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { createTrackTable, createUsersTable, createUserStateTable } from './db/db.js';
import trackerRoutes from './routes/trackerRoutes.js'
import statusRoutes from './routes/statusRoute.js'
dotenv.config();
const app = express();

// Initialize the database
createUsersTable();
createTrackTable();
createUserStateTable();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', dashboardRoutes);
app.use('/api/protected/tracker', trackerRoutes);
app.use('/api/protected/status',statusRoutes);

export default app;
