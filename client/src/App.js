import React, { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useRecoilState } from 'recoil';
import { positionsState } from './state';

const socket = io("http://localhost:4000", {
  reconnection: true,   // Allow automatic reconnection
  reconnectionAttempts: 5, // Limit to 5 attempts
  reconnectionDelay: 1000, // Wait 1 second before retrying
});

const App = () => {
  const [positions, setPositions] = useRecoilState(positionsState);

  useEffect(() => {
    const handleUpdate = (newPositions) => {
      setPositions((prevPositions) => {
        if (JSON.stringify(prevPositions) === JSON.stringify(newPositions)) {
          console.log("No state change detected. Skipping update.");
          return prevPositions; // Prevents unnecessary renders
        }
        return newPositions;
      });
    };
  
    socket.on("update_positions", handleUpdate);
  
    return () => {
      console.log("Cleaning up socket listener.");
      socket.off("update_positions", handleUpdate);
    };
  }, [setPositions]);
  
  
  const sendUpdate = useCallback(() => {
    const names = ["Eva", "Mike"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPosition = Math.floor(Math.random() * 10) + 1;
    // console.log(`Sending update: ${randomName} -> ${randomPosition}`);
    socket.emit("update_position", { [randomName]: randomPosition });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>WebSocket Positions</h2>
       {/* Loop from 1 to 10 to create position slots */}
      {[...Array(10)].map((_, index) => (
        <Position key={index + 1} position={index + 1} name={positions[index + 1] || ""} />
      ))}
      {/* Button to randomly move "Eva" to a new position */}
      <button onClick={sendUpdate}
      style={{
        padding: "12px", 
        margin: "20px",
      }}>
        Move Someone
      </button>
    </div>
  );
};

const positionStyle = {
  border: "1px solid #333",
  padding: "10px",
  margin: "15px",
  transition: "background-color 0.3s ease-in-out",
};

const Position = React.memo(({ position, name }) => {
  // console.log(`Rendering position ${position} - Name: ${name || "Empty"}`); 
  return (
    <div style={{ ...positionStyle, backgroundColor: name ? "#e0e0e0" : "#fff" }}>
      {position} - {name}
    </div>
  );
});


export default App;
