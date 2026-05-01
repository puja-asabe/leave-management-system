@echo off
setlocal
cd /d "%~dp0frontend"

where npm >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js and npm are required to run the frontend.
  exit /b 1
)

if not exist node_modules (
  call npm install
  if %errorlevel% neq 0 exit /b %errorlevel%
)

call npm start
