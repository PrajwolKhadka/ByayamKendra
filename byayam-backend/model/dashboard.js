import { pool } from '../db/db.js';

export const getDashboardData = async () => {
  try {
    const usersQuery = 'SELECT COUNT(*) FROM users WHERE role != $1';
    const workoutsQuery = 'SELECT COUNT(*) FROM adminworkouts';
    const challengesQuery = 'SELECT COUNT(*) FROM challenges';

    // Fetching the data concurrently
    const [usersRes, workoutsRes, challengesRes] = await Promise.all([
      pool.query(usersQuery,['admin']),
      pool.query(workoutsQuery),
      pool.query(challengesQuery),
    ]);

    return {
      totalUsers: usersRes.rows[0].count,
      totalWorkouts: workoutsRes.rows[0].count,
      totalChallenges: challengesRes.rows[0].count,
    };
  } catch (err) {
    console.error("Error fetching dashboard data", err);
    throw err; 
  }
};
