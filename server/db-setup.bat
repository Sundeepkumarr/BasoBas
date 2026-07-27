@echo off
echo.
echo ========================================
echo  Basobas Database Setup Script
echo ========================================
echo.

REM Check if psql is available
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] PostgreSQL not found in PATH.
    echo     Try adding: C:\Program Files\PostgreSQL\16\bin
    echo     to your system PATH and re-run this script.
    echo.
    pause
    exit /b 1
)

echo [1] Creating database 'basobas'...
psql -U postgres -c "CREATE DATABASE basobas;" 2>nul
if %errorlevel% neq 0 (
    echo     Database may already exist - continuing...
)

echo.
echo [2] Running Prisma migrations...
cd /d "%~dp0"
call npx prisma migrate dev --name init

echo.
echo [3] Seeding database...
call npm run db:seed

echo.
echo ==========================================
echo  Setup complete!
echo  Run 'npm run dev' to start the server.
echo ==========================================
pause
