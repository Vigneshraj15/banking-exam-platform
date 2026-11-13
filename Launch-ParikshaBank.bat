@echo off
setlocal enabledelayedexpansion
title ParikshaBank - Desktop Application Launcher

echo ========================================================
echo    PARIKSHABANK - INDIAN BANKING EXAM PLATFORM
echo          Launching Desktop Application...
echo ========================================================

:: 1. Ensure Node.js is on PATH
if exist "%~dp0..\tools\node-v20.18.0-win-x64\node.exe" (
    set "PATH=%~dp0..\tools\node-v20.18.0-win-x64;%PATH%"
)

:: 2. Check if the server is already running on port 5000
netstat -ano | findstr :5000 >nul 2>&1
if errorlevel 1 (
    echo [1/3] Starting backend exam server on port 5000...
    start /b "" node "%~dp0server\index.js" >nul 2>&1
    :: Wait up to 5 seconds for server to respond
    for /l %%i in (1,1,10) do (
        timeout /t 1 /nobreak >nul 2>&1
        netstat -ano | findstr :5000 >nul 2>&1
        if not errorlevel 1 goto :server_ready
    )
) else (
    echo [1/3] Backend server is already active on port 5000.
)

:server_ready
echo [2/3] Server verified at http://localhost:5000

:: 3. Detect Native App Runtime: Microsoft Edge or Google Chrome (in --app mode)
set "APP_URL=http://localhost:5000"
set "APP_LAUNCHED=0"

:: Check Microsoft Edge (Default on Windows 10/11)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    echo [3/3] Opening ParikshaBank in dedicated Desktop App Window (Edge Engine)...
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=%APP_URL% --window-size=1366,850 --name="ParikshaBank"
    set "APP_LAUNCHED=1"
    goto :done
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    echo [3/3] Opening ParikshaBank in dedicated Desktop App Window (Edge Engine)...
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app=%APP_URL% --window-size=1366,850 --name="ParikshaBank"
    set "APP_LAUNCHED=1"
    goto :done
)

:: Check Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    echo [3/3] Opening ParikshaBank in dedicated Desktop App Window (Chrome Engine)...
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=%APP_URL% --window-size=1366,850 --name="ParikshaBank"
    set "APP_LAUNCHED=1"
    goto :done
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    echo [3/3] Opening ParikshaBank in dedicated Desktop App Window (Chrome Engine)...
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=%APP_URL% --window-size=1366,850 --name="ParikshaBank"
    set "APP_LAUNCHED=1"
    goto :done
)

:: Fallback: Default Browser
if "%APP_LAUNCHED%"=="0" (
    echo [3/3] Opening ParikshaBank in your default web browser...
    start "" %APP_URL%
)

:done
echo.
echo Application successfully launched!
echo You may close this window.
timeout /t 3 >nul
exit
