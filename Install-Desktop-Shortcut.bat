@echo off
setlocal enabledelayedexpansion
title Install ParikshaBank Desktop Shortcut

echo ========================================================
echo       PARIKSHABANK - DESKTOP SHORTCUT INSTALLER
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$desktop = [Environment]::GetFolderPath('Desktop'); " ^
    "$target = Join-Path '%~dp0' 'Launch-ParikshaBank-Silent.vbs'; " ^
    "$shortcutPath = Join-Path $desktop 'ParikshaBank.lnk'; " ^
    "try { " ^
    "  $ws = New-Object -ComObject WScript.Shell; " ^
    "  $s = $ws.CreateShortcut($shortcutPath); " ^
    "  $s.TargetPath = 'wscript.exe'; " ^
    "  $s.Arguments = '\"' + $target + '\"'; " ^
    "  $s.WorkingDirectory = '%~dp0'; " ^
    "  $s.Description = 'ParikshaBank - Indian Banking Examination Platform'; " ^
    "  $s.Save(); " ^
    "  Write-Host '[SUCCESS] ParikshaBank shortcut placed directly on your Desktop!' -ForegroundColor Green; " ^
    "} catch { " ^
    "  Write-Host '[WARNING] Could not automatically write to Desktop folder. You can directly double-click \"Launch-ParikshaBank.bat\" inside this folder!' -ForegroundColor Yellow; " ^
    "}"

echo.
echo ========================================================
echo You can now launch ParikshaBank directly from your Desktop!
echo ========================================================
echo.
pause
