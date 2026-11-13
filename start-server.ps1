$env:PATH = "C:\Users\vicky\.gemini\antigravity\scratch\tools\node-v20.18.0-win-x64;$env:PATH"
Set-Location -Path $PSScriptRoot
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting ParikshaBank Examination Platform on port 5000..." -ForegroundColor Green
Write-Host "Navigate to http://localhost:5000 in your browser." -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
node server/index.js
