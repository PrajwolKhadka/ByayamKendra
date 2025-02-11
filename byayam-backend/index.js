import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { createAdminWorkoutTable, createTrackTable, createUsersTable, createUserStateTable } from './db/db.js';
import trackerRoutes from './routes/trackerRoutes.js'
import statusRoutes from './routes/statusRoute.js'
import adminAddWorkout from './routes/adminRoute.js'
dotenv.config();
const app = express();

// Initialize the database
createUsersTable();
createTrackTable();
createUserStateTable();
createAdminWorkoutTable();
// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', dashboardRoutes);
app.use('/api/protected/tracker', trackerRoutes);
app.use('/api/protected/status',statusRoutes);
app.use('/api/protected/admin',adminAddWorkout);

export default app;
