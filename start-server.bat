@echo off
set "PATH=C:\Users\vicky\.gemini\antigravity\scratch\tools\node-v20.18.0-win-x64;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo Starting ParikshaBank Examination Platform on port 5000...
echo Open http://localhost:5000 in your browser.
echo ========================================================
node server/index.js
pause
