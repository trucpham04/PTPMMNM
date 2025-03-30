module.exports = (server, router) => {
  // Login endpoint
  server.post("/login", (req, res) => {
    const { username, password } = req.body;
    const users = router.db.get("users").value();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    // Simple hardcoded authentication for demo
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return res.json({
        message: "Login successful",
        user: userWithoutPassword,
      });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  });
};
