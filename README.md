WebSocket Position Tracker
-This is a simple proof-of-concept app for tracking positions in real-time using WebSockets. It lets users move names around a board while keeping everything synced across clients.

Features
-Uses Socket.io to send and receive real-time position updates.
-Prevents unnecessary re-renders so only the changed positions update.
-Handles cases where two names try to take the same spot.

How to Run It

1. Clone this repo:
git clone https://github.com/your-username/websocket-positions.git
cd websocket-positions

2. Install dependencies:
npm install

3. Start the backend:
cd server
node server/index.js

4. Start the frontend:
cd ..
cd client
npm start

5. Open http://localhost:3000 in your browser.

Tech Stack
-React with Recoil for managing state.
-Socket.io for real-time updates.
-Express for the server.

Notes
-This was built as a quick technical assignment to demonstrate WebSockets and state management. Let me know if you’d like any changes or additions!