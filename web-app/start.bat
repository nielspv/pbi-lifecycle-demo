@echo off
REM Start both server and client in development mode

echo Starting PBI Lifecycle Web Application...
echo.

REM Start backend
cd web-app\server
echo Installing server dependencies...
call npm install
echo Starting backend server on http://localhost:3001...
start cmd /k "npm start"

timeout /t 2

REM Start frontend
cd ..\client
echo Installing client dependencies...
call npm install
echo Starting frontend on http://localhost:3000...
start cmd /k "npm start"

echo.
echo Servers starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop
