const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const exportDir = path.join(rootDir, 'exported-application');

console.log('=== ParikshaBank Desktop Application Exporter ===');
console.log(`Export destination: ${exportDir}`);

// Clean or create export directory
if (fs.existsSync(exportDir)) {
  fs.rmSync(exportDir, { recursive: true, force: true });
}
fs.mkdirSync(exportDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy dist (production frontend bundle)
console.log('1. Copying production frontend (dist)...');
if (fs.existsSync(path.join(rootDir, 'dist'))) {
  copyRecursive(path.join(rootDir, 'dist'), path.join(exportDir, 'dist'));
} else {
  console.warn('Warning: dist/ directory not found! Run "npm run build" first.');
}

// 2. Copy server (API & PDF processing backend)
console.log('2. Copying backend server...');
copyRecursive(path.join(rootDir, 'server'), path.join(exportDir, 'server'));

// 3. Copy Launchers & Shortcuts
console.log('3. Copying Desktop Launchers & Scripts...');
const launcherFiles = [
  'Launch-ParikshaBank.bat',
  'Launch-ParikshaBank-Silent.vbs',
  'Install-Desktop-Shortcut.bat',
  'package.json'
];

for (const f of launcherFiles) {
  const p = path.join(rootDir, f);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(exportDir, f));
  }
}

// 4. Create an informative README for the exported app
const readmeContent = `========================================================================
   PARIKSHABANK - INDIAN BANKING EXAM PLATFORM (DESKTOP APPLICATION)
========================================================================

Welcome to ParikshaBank Desktop!
This package is configured to run as a dedicated, standalone desktop application.

HOW TO RUN:
-----------
Method 1 (Recommended - Silent Desktop Window):
   Double-click "Launch-ParikshaBank-Silent.vbs".
   - The app opens directly in its own standalone window (no address bar or tabs).
   - The server runs silently in the background.

Method 2 (Standard Launcher):
   Double-click "Launch-ParikshaBank.bat".
   - Starts the backend server and automatically opens Microsoft Edge / Chrome in native app mode.

Method 3 (Desktop Shortcut):
   Double-click "Install-Desktop-Shortcut.bat".
   - Automatically places a 1-click "ParikshaBank" shortcut on your Windows Desktop!

REQUIREMENTS:
-------------
- Windows 10 or 11
- Node.js (v18+)
- Microsoft Edge or Google Chrome (already installed on Windows)

FEATURES INCLUDED:
------------------
- Full SBI / IBPS / RBI Prelims & Mains Mock Exams
- PDF Question Paper Extraction & AI Step-by-Step Solver
- High-Definition Visual DI Charts (Bar Graph, Pie Chart, Line Graph)
- Real-Time Question Timers & Pace Matrix
- Pause / Resume Exam Session Support
- Editorial Muted Sage & Charcoal Aesthetic (#FAF9F6, #DCE5D8, #262626)
========================================================================
`;

fs.writeFileSync(path.join(exportDir, 'README-DESKTOP.txt'), readmeContent);

console.log('\n[SUCCESS] Application successfully exported to:');
console.log(exportDir);
