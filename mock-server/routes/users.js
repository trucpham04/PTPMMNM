module.exports = (server, router) => {
  // Get user profile with preferences
  server.get("/users/:id/profile", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = router.db.get("users").find({ id: userId }).value();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get related data
    const orders = router.db.get("orders").filter({ userId }).value();

    res.json({
      ...user,
      orderCount: orders.length,
      recentActivity: "2025-03-25 15:04:00",
    });
  });

  server.get("/users", (req, res) => {
    const users = router.db.get("users").value();

    res.json(users);
  });
};
