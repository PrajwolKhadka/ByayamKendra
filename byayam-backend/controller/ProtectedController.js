export const getDashboard = (req, res) => {
    res.status(200).json({ message: `Welcome to the dashboard, user ${req.user.id}` });
  };
  