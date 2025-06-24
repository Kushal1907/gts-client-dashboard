// server.js
const jsonServer = require("json-server");
const http = require("http"); // Import Node.js HTTP module
const { Server } = require("socket.io"); // Import Server class from socket.io
const fs = require("fs"); // Node.js File System module
const path = require("path"); // Node.js Path module

const server = jsonServer.create();
const router = jsonServer.router("db.json"); // Point to your db.json
const middlewares = jsonServer.defaults();

// Use default JSON Server middlewares (logger, static, cors, etc.)
server.use(middlewares);

// --- CRITICAL CHANGE STARTS HERE ---
// Define custom routes BEFORE mounting the main JSON Server router.
// This ensures your custom route takes precedence.
server.get("/clients/active", (req, res) => {
  // Read db.json content directly as router.db might not be instantly updated
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const db = JSON.parse(data);
      const clients = db.clients || []; // Get the clients array

      const activeClients = clients.filter(
        (client) => client.is_active === true
      ).length;
      const inactiveClients = clients.filter(
        (client) => client.is_active === false
      ).length;

      // Send the custom response
      res.json({
        activeClients: activeClients,
        inactiveClients: inactiveClients,
      });
    } catch (parseError) {
      console.error("Error parsing db.json:", parseError);
      res
        .status(500)
        .json({ error: "Internal Server Error - Invalid db.json" });
    }
  });
});

// Now, mount the default JSON Server router for other endpoints (like /clients, /clients?name_like=etc.)
server.use(router);
// --- CRITICAL CHANGE ENDS HERE ---

// Create a standard HTTP server and pass the JSON Server app to it
// This allows us to attach socket.io to the same HTTP server
const httpServer = http.createServer(server);

// Initialize socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow your React app to connect
    methods: ["GET", "POST"], // Allowed HTTP methods for CORS preflight
  },
});

// Path to your db.json file
const dbPath = path.join(__dirname, "db.json");

// Watch db.json for changes and emit a WebSocket event
// Note: fs.watch can be finicky and might trigger multiple times on a single save
// For a production app, you'd use a more robust file watcher or integrate with your ORM/DB changes.
fs.watch(dbPath, (eventType, filename) => {
  if (filename && eventType === "change") {
    // A small debounce to prevent multiple rapid emissions for a single save
    clearTimeout(server.dbWatchTimeout);
    server.dbWatchTimeout = setTimeout(() => {
      console.log(`db.json changed, emitting 'dataUpdated' event`);
      io.emit("dataUpdated"); // Emit the event to all connected WebSocket clients
    }, 50); // Debounce for 50ms
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A client connected via WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the HTTP server (which includes both JSON Server and Socket.io)
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(
    `Custom JSON Server with WebSockets is running on http://localhost:${PORT}`
  );
  console.log(`Access REST API endpoints at http://localhost:${PORT}/clients`);
  console.log(
    `Access custom active/inactive endpoint at http://localhost:${PORT}/clients/active`
  );
});
