const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// Function to generate a timestamped position update
const generateMessage = () => {
  const timestamp = new Date().toLocaleString("en-US", { hour12: true }); // Format: "MM/DD/YYYY HH:MM:SS"
  const randomPosition = Math.floor(Math.random() * 10) + 1; // 1-10
  return { ts: timestamp, pos: randomPosition };
};

// Broadcast a message every 10 seconds
setInterval(() => {
  const message = generateMessage();
  io.emit("position_update", message);
  console.log("Sent:", message);
}, 10000);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log(`User disconnected | Active connections: ${io.engine.clientsCount}`); 
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
