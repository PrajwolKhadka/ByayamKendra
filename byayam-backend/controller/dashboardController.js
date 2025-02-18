import { getDashboardData } from '../model/dashboard.js'; 

export const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardData();
    res.json(data); // Send the response with dashboard data
  } catch (err) {
    console.error("Error fetching dashboard data", err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
