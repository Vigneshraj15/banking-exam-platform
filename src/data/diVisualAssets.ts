/**
 * Visual Data Interpretation Vector Assets (SVGs)
 * Matches the official Chart-Based Data Interpretation exam papers:
 * 1. Bar Graph: Units sold (Product A & Product B, 2018-2022)
 * 2. Pie Chart: 5,000 University Students Course Distribution
 * 3. Line Graph: Corporate Income & Expenditure (2018-2022)
 */

export const barGraphSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 360" width="100%" height="100%" className="w-full">
  <rect width="650" height="360" fill="#ffffff" rx="8" />
  
  <!-- Title / Subtext -->
  <text x="325" y="24" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="#1e293b">
    Units Sold in Thousands (2018 - 2022)
  </text>
  
  <!-- Legend -->
  <rect x="480" y="38" width="14" height="14" fill="#3b82f6" rx="2" />
  <text x="500" y="50" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#334155">Product A</text>
  <rect x="480" y="58" width="14" height="14" fill="#10b981" rx="2" />
  <text x="500" y="70" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#334155">Product B</text>

  <!-- Grid lines and Y-axis labels (scale 0 to 100, height = 200px from y=280 to y=80) -->
  <!-- 100 -->
  <line x1="80" y1="80" x2="600" y2="80" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="84" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">100</text>
  
  <!-- 75 -->
  <line x1="80" y1="130" x2="600" y2="130" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="134" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">75</text>
  
  <!-- 50 -->
  <line x1="80" y1="180" x2="600" y2="180" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="184" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">50</text>
  
  <!-- 25 -->
  <line x1="80" y1="230" x2="600" y2="230" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="234" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">25</text>
  
  <!-- 0 Base Axis -->
  <line x1="80" y1="280" x2="600" y2="280" stroke="#334155" stroke-width="1.5" />
  <text x="65" y="284" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">0</text>

  <!-- 2018: A=40 (h=80, y=200), B=30 (h=60, y=220) -->
  <g transform="translate(100, 0)">
    <rect x="15" y="200" width="22" height="80" fill="#3b82f6" rx="2" />
    <text x="26" y="194" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">40</text>
    <rect x="40" y="220" width="22" height="60" fill="#10b981" rx="2" />
    <text x="51" y="214" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">30</text>
    <text x="38" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2018</text>
  </g>

  <!-- 2019: A=50 (h=100, y=180), B=45 (h=90, y=190) -->
  <g transform="translate(200, 0)">
    <rect x="15" y="180" width="22" height="100" fill="#3b82f6" rx="2" />
    <text x="26" y="174" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">50</text>
    <rect x="40" y="190" width="22" height="90" fill="#10b981" rx="2" />
    <text x="51" y="184" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">45</text>
    <text x="38" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2019</text>
  </g>

  <!-- 2020: A=60 (h=120, y=160), B=65 (h=130, y=150) -->
  <g transform="translate(300, 0)">
    <rect x="15" y="160" width="22" height="120" fill="#3b82f6" rx="2" />
    <text x="26" y="154" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">60</text>
    <rect x="40" y="150" width="22" height="130" fill="#10b981" rx="2" />
    <text x="51" y="144" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">65</text>
    <text x="38" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2020</text>
  </g>

  <!-- 2021: A=70 (h=140, y=140), B=55 (h=110, y=170) -->
  <g transform="translate(400, 0)">
    <rect x="15" y="140" width="22" height="140" fill="#3b82f6" rx="2" />
    <text x="26" y="134" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">70</text>
    <rect x="40" y="170" width="22" height="110" fill="#10b981" rx="2" />
    <text x="51" y="164" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">55</text>
    <text x="38" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2021</text>
  </g>

  <!-- 2022: A=80 (h=160, y=120), B=90 (h=180, y=100) -->
  <g transform="translate(500, 0)">
    <rect x="15" y="120" width="22" height="160" fill="#3b82f6" rx="2" />
    <text x="26" y="114" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">80</text>
    <rect x="40" y="100" width="22" height="180" fill="#10b981" rx="2" />
    <text x="51" y="94" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">90</text>
    <text x="38" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2022</text>
  </g>
</svg>`;

export const pieChartSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 360" width="100%" height="100%" className="w-full">
  <rect width="650" height="360" fill="#ffffff" rx="8" />

  <text x="325" y="24" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="#1e293b">
    Percentage Distribution of 5,000 Students Across Academic Courses
  </text>

  <!-- Pie Chart Center: (220, 190), Radius: 125 -->
  <!-- 1. Engineering 30% = 108 deg (0 to 108) -->
  <path d="M 220 190 L 345 190 A 125 125 0 0 1 181.38 308.88 Z" fill="#ef4444" />
  
  <!-- 2. Medical 20% = 72 deg (108 to 180) -->
  <path d="M 220 190 L 181.38 308.88 A 125 125 0 0 1 95 190 Z" fill="#3b82f6" />
  
  <!-- 3. Commerce 25% = 90 deg (180 to 270) -->
  <path d="M 220 190 L 95 190 A 125 125 0 0 1 220 65 Z" fill="#10b981" />
  
  <!-- 4. Arts 15% = 54 deg (270 to 324) -->
  <path d="M 220 190 L 220 65 A 125 125 0 0 1 321.12 116.53 Z" fill="#f59e0b" />
  
  <!-- 5. Law 10% = 36 deg (324 to 360) -->
  <path d="M 220 190 L 321.12 116.53 A 125 125 0 0 1 345 190 Z" fill="#8b5cf6" />

  <!-- Center divider subtle outline -->
  <circle cx="220" cy="190" r="125" fill="none" stroke="#ffffff" stroke-width="2" />

  <!-- Legend with Swatches and Counts -->
  <g transform="translate(420, 85)">
    <!-- Engineering -->
    <rect x="0" y="0" width="16" height="16" fill="#ef4444" rx="3" />
    <text x="26" y="13" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Engineering (30%)</text>
    <text x="26" y="27" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#64748b">1,500 Students</text>

    <!-- Medical -->
    <rect x="0" y="45" width="16" height="16" fill="#3b82f6" rx="3" />
    <text x="26" y="58" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Medical (20%)</text>
    <text x="26" y="72" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#64748b">1,000 Students</text>

    <!-- Commerce -->
    <rect x="0" y="90" width="16" height="16" fill="#10b981" rx="3" />
    <text x="26" y="103" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Commerce (25%)</text>
    <text x="26" y="117" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#64748b">1,250 Students</text>

    <!-- Arts -->
    <rect x="0" y="135" width="16" height="16" fill="#f59e0b" rx="3" />
    <text x="26" y="148" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Arts (15%)</text>
    <text x="26" y="162" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#64748b">750 Students</text>

    <!-- Law -->
    <rect x="0" y="180" width="16" height="16" fill="#8b5cf6" rx="3" />
    <text x="26" y="193" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Law (10%)</text>
    <text x="26" y="207" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#64748b">500 Students</text>
  </g>
</svg>`;

export const lineGraphSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 360" width="100%" height="100%" className="w-full">
  <rect width="650" height="360" fill="#ffffff" rx="8" />

  <text x="325" y="24" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="700" fill="#1e293b">
    Corporate Income &amp; Expenditure in Lakh Rupees (2018 - 2022)
  </text>
  <text x="325" y="40" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#64748b">
    Note: Profit = Income - Expenditure
  </text>

  <!-- Legend -->
  <g transform="translate(470, 48)">
    <circle cx="8" cy="8" r="5" fill="#3b82f6" />
    <line x1="0" y1="8" x2="16" y2="8" stroke="#3b82f6" stroke-width="2" />
    <text x="24" y="12" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#334155">Income</text>

    <rect x="3" y="24" width="10" height="10" fill="#ef4444" />
    <line x1="0" y1="29" x2="16" y2="29" stroke="#ef4444" stroke-width="2" stroke-dasharray="3" />
    <text x="24" y="33" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#334155">Expenditure</text>
  </g>

  <!-- Grid lines and Y-axis labels -->
  <!-- 100 -->
  <line x1="80" y1="80" x2="600" y2="80" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="84" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">100</text>
  
  <!-- 75 -->
  <line x1="80" y1="130" x2="600" y2="130" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="134" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">75</text>
  
  <!-- 50 -->
  <line x1="80" y1="180" x2="600" y2="180" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="184" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">50</text>
  
  <!-- 25 -->
  <line x1="80" y1="230" x2="600" y2="230" stroke="#e2e8f0" stroke-dasharray="4" />
  <text x="65" y="234" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">25</text>
  
  <!-- 0 Base Axis -->
  <line x1="80" y1="280" x2="600" y2="280" stroke="#334155" stroke-width="1.5" />
  <text x="65" y="284" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="end">0</text>

  <!-- X-Axis Labels: 2018 (x=130), 2019 (x=235), 2020 (x=340), 2021 (x=445), 2022 (x=550) -->
  <text x="130" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2018</text>
  <text x="235" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2019</text>
  <text x="340" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2020</text>
  <text x="445" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2021</text>
  <text x="550" y="302" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" fill="#1e293b" text-anchor="middle">2022</text>

  <!-- Expenditure (Red Dashed Line)
       2018: 40 (y=200)
       2019: 55 (y=170)
       2020: 60 (y=160)
       2021: 65 (y=150)
       2022: 80 (y=120) -->
  <polyline points="130,200 235,170 340,160 445,150 550,120" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="5,4" />
  
  <!-- Income (Blue Solid Line)
       2018: 50 (y=180)
       2019: 60 (y=160)
       2020: 75 (y=130)
       2021: 70 (y=140)
       2022: 90 (y=100) -->
  <polyline points="130,180 235,160 340,130 445,140 550,100" fill="none" stroke="#3b82f6" stroke-width="3.5" />

  <!-- Expenditure Square Markers and Labels -->
  <rect x="125" y="195" width="10" height="10" fill="#ef4444" />
  <text x="130" y="218" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#b91c1c" text-anchor="middle">40</text>

  <rect x="230" y="165" width="10" height="10" fill="#ef4444" />
  <text x="235" y="188" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#b91c1c" text-anchor="middle">55</text>

  <rect x="335" y="155" width="10" height="10" fill="#ef4444" />
  <text x="340" y="178" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#b91c1c" text-anchor="middle">60</text>

  <rect x="440" y="145" width="10" height="10" fill="#ef4444" />
  <text x="445" y="168" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#b91c1c" text-anchor="middle">65</text>

  <rect x="545" y="115" width="10" height="10" fill="#ef4444" />
  <text x="550" y="138" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#b91c1c" text-anchor="middle">80</text>

  <!-- Income Circle Markers and Labels -->
  <circle cx="130" cy="180" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
  <text x="130" y="172" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">50</text>

  <circle cx="235" cy="160" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
  <text x="235" y="152" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">60</text>

  <circle cx="340" cy="130" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
  <text x="340" y="122" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">75</text>

  <circle cx="445" cy="140" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
  <text x="445" y="132" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">70</text>

  <circle cx="550" cy="100" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
  <text x="550" y="92" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" fill="#1d4ed8" text-anchor="middle">90</text>
</svg>`;

export const barGraphVisualDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(barGraphSvg)}`;
export const pieChartVisualDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(pieChartSvg)}`;
export const lineGraphVisualDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(lineGraphSvg)}`;
