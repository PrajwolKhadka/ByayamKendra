import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { createAdminChallengeTable, createAdminWorkoutTable, createTrackTable, createUsersTable, createUserStateTable } from './db/db.js';
import trackerRoutes from './routes/trackerRoutes.js';
import statusRoutes from './routes/statusRoute.js';
import adminAddWorkout from './routes/adminRoute.js';
import adminChallenge from "./routes/challengesRoute.js"
import dashAdmin from './routes/dashRoute.js'
import helmet from 'helmet';
import xssClean from 'xss-clean';
import path from 'path';  // Import path to handle static files
import { fileURLToPath } from 'url';  // Import to use fileURLToPath
import { dirname } from 'path';  // Import to use dirname

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Initialize the database
createUsersTable();
createTrackTable();
createUserStateTable();
createAdminWorkoutTable();
createAdminChallengeTable();
// Serve static files from the 'uploads' directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log("Uploads directory:", uploadsPath);
app.use('/uploads', express.static(uploadsPath)); // This line serves the static files

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(xssClean());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', dashboardRoutes);
app.use('/api/protected/tracker', trackerRoutes);
app.use('/api/protected/status', statusRoutes);
app.use('/api/protected/admin', adminAddWorkout);
app.use('/api/protected/admin',adminChallenge);
app.use('/api/protected/dash',dashAdmin);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
  });

export default app;
