@echo off
TITLE TNEA College Predictor Launcher
CLS

ECHO ======================================================
ECHO      UniGuide Ai - Application Launcher
ECHO ======================================================
ECHO.

:: 1. Check MongoDB
ECHO [*] Checking MongoDB status...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
IF "%ERRORLEVEL%"=="0" (
    ECHO [OK] MongoDB is running.
) ELSE (
    ECHO [!] MongoDB is NOT running.
    ECHO     Attempting to start MongoDB...
    start "MongoDB" mongod
    timeout /t 5
)

:: 2. Import Data (Optional check, but good to run to be safe)
ECHO.
ECHO [*] Checking for Data...
ECHO     Do you want to re-import the Excel data? (Y/N)
SET /P IMPORT_CHOICE="> "

IF /I "%IMPORT_CHOICE%"=="Y" (
    ECHO [*] Running Data Import...
    cd server
    call npm run import
    cd ..
)

:: 3. Start Server
ECHO.
ECHO [*] Starting Backend Server...
start "TNEA Backend" /D "server" npm start

:: 4. Start Client
ECHO.
ECHO [*] Starting Frontend Client...
start "UniGuide Ai" /D "client" npm run dev

ECHO.
ECHO ======================================================
ECHO [SUCCESS] Application launched!
ECHO.
ECHO Backend: http://localhost:5000
ECHO Frontend: http://localhost:5173
ECHO.
ECHO Press any key to exit this launcher (Servers will keep running).
PAUSE >NUL
