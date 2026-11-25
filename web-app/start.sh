#!/bin/bash
# Start both server and client in development mode

echo "Starting PBI Lifecycle Web Application..."
echo ""

# Start backend
cd web-app/server
echo "Installing server dependencies..."
npm install
echo "Starting backend server on http://localhost:3001..."
npm start &
SERVER_PID=$!

sleep 2

# Start frontend
cd ../client
echo "Installing client dependencies..."
npm install
echo "Starting frontend on http://localhost:3000..."
npm start &
CLIENT_PID=$!

echo ""
echo "✅ Both servers started!"
echo "   Backend: http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
