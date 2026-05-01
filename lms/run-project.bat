@echo off
setlocal
cd /d "%~dp0"

start "LMS Backend" cmd /k "%~dp0run-backend.bat"
start "LMS Frontend" cmd /k "%~dp0run-frontend.bat"
