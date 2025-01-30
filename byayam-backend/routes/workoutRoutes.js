const express = require('express');
const router = express.Router();
const { getWorkouts, getFilteredWorkouts } = require('../controllers/workoutController');

router.get('/workouts', getWorkouts);
router.post('/workouts/filter', getFilteredWorkouts);

module.exports = router;