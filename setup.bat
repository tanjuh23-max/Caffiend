@echo off
title Caffiend Setup
echo.
echo  ============================================
echo   Caffiend - Setup
echo  ============================================
echo.

:: Check if Node.js is already installed
where node >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Node.js is already installed.
    node --version
    goto :install_deps
)

echo [*] Node.js not found. Installing via winget...
echo.
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] winget install failed.
    echo Please download Node.js manually from: https://nodejs.org
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo [OK] Node.js installed. Please close and reopen this window, then run setup.bat again.
echo.
pause
exit /b 0

:install_deps
echo.
echo [*] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

echo.
echo  ============================================
echo   Setup complete!
echo   Run  start.bat  to launch Caffiend.
echo  ============================================
echo.
pause
