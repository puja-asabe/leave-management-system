@echo off
setlocal
cd /d "%~dp0backend"

if exist mvnw.cmd (
  call mvnw.cmd spring-boot:run
  exit /b %errorlevel%
)

where mvn >nul 2>nul
if %errorlevel% neq 0 (
  echo Maven is not installed or not on PATH.
  echo Install Maven or add mvnw.cmd to the backend folder.
  exit /b 1
)

call mvn spring-boot:run
