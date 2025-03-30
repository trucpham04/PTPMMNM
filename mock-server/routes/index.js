// routes/index.js
const authRoutes = require("./auth");
const userRoutes = require("./users");

module.exports = (server, router) => {
  // Initialize all route modules by passing the server instance
  authRoutes(server, router);
  userRoutes(server, router);

  // You can also define general routes here if needed
  server.get("/health", (req, res) => {
    res.json({ status: "ok", time: "2025-03-25 15:12:41" });
  });
};
