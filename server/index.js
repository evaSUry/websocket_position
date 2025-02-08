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

// Initialize positions to ensure Eva & Mike always start on the board
// Store data in two objects for O(1) lookups
let positions = { 1: "Mike", 2: "Eva" }; // Position → Name
let nameToPosition = { Mike: 1, Eva: 2 }; // Name → Position

// function to find a random empty position
const findRandomEmptyPosition = () => {
  const emptyPositions = [];
  for (let i = 1; i <= 10; i++) {
    if (!positions[i]) emptyPositions.push(i);
  }
  if (emptyPositions.length === 0) return null; // No empty spots available
  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]; // Pick a random available spot
};

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the initial positions when a client connects
  socket.emit("update_positions", positions);


  socket.on("update_position", (data) => {
    console.log("Received update:", data);

    // Extract the name and new position from the update
    const [movingName, newPosition] = Object.entries(data)[0];

    if (typeof newPosition !== "number" || newPosition < 1 || newPosition > 10) {
      console.error("Invalid position received:", data);
      return;
    }
    // prevent redundant moves, checking if old position still exists
    if (nameToPosition[movingName] === newPosition) {
      console.log(`${movingName} is already at position ${newPosition}. Ignoring update.`);
      return;
    }
    // Check if the new position is already occupied
    if (positions[newPosition]) {
      const currentOccupant = positions[newPosition];

      if (currentOccupant !== movingName) {
        console.log(`${movingName} wants to move to ${newPosition}, but ${currentOccupant} is already there.`);

        // Find a random empty position for the displaced player
        const newRandomSpot = findRandomEmptyPosition();

        if (newRandomSpot) {
          console.log(`Bumping ${currentOccupant} to random position ${newRandomSpot}`);
          positions[newRandomSpot] = currentOccupant;
          nameToPosition[currentOccupant] = newRandomSpot;
        } else {
          console.log(`No empty positions available. ${currentOccupant} remains in place.`);
        }
      }
    }

    // Remove the old position of the moving player
    if (nameToPosition[movingName] !== undefined) {
      delete positions[nameToPosition[movingName]];
    }

    // Assign the moving player to the new position
    positions[newPosition] = movingName;
    nameToPosition[movingName] = newPosition;

    console.log("Updated positions:", positions);

    // Send the updated positions to all clients
    io.emit("update_positions", { ...positions });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected | Active connections: ${io.engine.clientsCount}`); 
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
