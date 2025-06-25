const jsonServer = require("json-server");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json"); // Point to db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get("/clients/active", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading db.json:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const db = JSON.parse(data);
      const clients = db.clients || [];

      const activeClients = clients.filter(
        (client) => client.is_active === true
      ).length;
      const inactiveClients = clients.filter(
        (client) => client.is_active === false
      ).length;

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

server.use(router);

const httpServer = http.createServer(server);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const dbPath = path.join(__dirname, "db.json");

fs.watch(dbPath, (eventType, filename) => {
  if (filename && eventType === "change") {
    clearTimeout(server.dbWatchTimeout);
    server.dbWatchTimeout = setTimeout(() => {
      console.log(`db.json changed, emitting 'dataUpdated' event`);
      io.emit("dataUpdated");
    }, 50);
  }
});

io.on("connection", (socket) => {
  console.log("A client connected via WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

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
