@echo off
setlocal enabledelayedexpansion
title Push ParikshaBank to GitHub

echo ========================================================
echo       PARIKSHABANK - GITHUB REPOSITORY DEPLOYER
echo ========================================================
echo.

:: Ensure portable Git is on PATH
if exist "%~dp0..\tools\git\cmd\git.exe" (
    set "PATH=%~dp0..\tools\git\cmd;%PATH%"
)

echo Step 1: Create a new repository on GitHub:
echo         1. Open https://github.com/new in your browser
echo         2. Enter repository name (e.g. "parikshabank" or "banking-exam-platform")
echo         3. Leave "Initialize with README" UNCHECKED
echo         4. Click "Create repository"
echo.
echo ========================================================
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/parikshabank.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL entered. Exiting.
    pause
    exit /b 1
)

echo.
echo Configuring remote origin to: %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo Pushing code to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo [NOTE] If you were prompted to sign in, please complete the authentication in your browser or enter your GitHub Personal Access Token.
) else (
    echo.
    echo ========================================================
    echo [SUCCESS] Code pushed to GitHub successfully!
    echo.
    echo TO ENABLE FREE 24/7 GITHUB PAGES HOSTING:
    echo 1. Go to your repository on GitHub
    echo 2. Click "Settings" -> "Pages" (in the left sidebar)
    echo 3. Under "Build and deployment" -> "Source", select:
    echo    "GitHub Actions"
    echo.
    echo The automated workflow (.github/workflows/deploy.yml) will
    echo build and publish your site at:
    echo https://^<your-username^>.github.io/^<repo-name^>/
    echo ========================================================
)

echo.
pause
