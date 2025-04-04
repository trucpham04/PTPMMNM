// routes/index.js
const authRoutes = require("./auth");
const userRoutes = require("./users");
const albumRoutes = require("./albums");
const artistRoutes = require("./artists");
const trackRoutes = require("./tracks");
const userSavedAlbumsRoutes = require("./user-saved-albums");

module.exports = (server, router) => {
  // Initialize all route modules by passing the server instance
  authRoutes(server, router);
  userRoutes(server, router);
  albumRoutes(server, router);
  artistRoutes(server, router);
  trackRoutes(server, router);
  userSavedAlbumsRoutes(server, router);

  // You can also define general routes here if needed
  server.get("/health", (req, res) => {
    res.json({ status: "ok", time: "2025-03-25 15:12:41" });
  });
};
