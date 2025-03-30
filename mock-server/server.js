// server.js
const jsonServer = require("json-server");
const server = jsonServer.create(); // This creates the Express server
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ static: "./uploads" });
const port = process.env.PORT || 3001;

// Import routes file
const routes = require("./routes");

// Set default middlewares
server.use(middlewares);

// Enable CORS for Vite
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});

// Parse JSON request body
server.use(jsonServer.bodyParser);

// Add timestamps and user info to requests
server.use((req, res, next) => {
  const now = new Date().toISOString();
  if (req.method === "POST") {
    req.body.createdAt = now;
    req.body.createdBy = "trucpham04";
  }
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    req.body.updatedAt = now;
    req.body.updatedBy = "trucpham04";
  }
  next();
});

// Apply custom routes - IMPORTANT: This is where we pass the server instance
routes(server, router);

// Use default router (must be after custom routes)
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`Server started at: http://localhost:${port}`);
});
