import React, { useState } from "react";

import {
BrowserRouter as Router,
Routes,
Route,
NavLink,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import YieldPrediction from "./pages/YieldPrediction";
import Recommendations from "./pages/Recommendations";
import History from "./pages/History";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";

import "./styles.css";
import "./i18n";

import { useTranslation } from "react-i18next";

/* =========================================
ICONS
========================================= */

const iconStyle = {

width:"20px",

height:"20px",

display:"flex",

alignItems:"center",

justifyContent:"center",
};

const HomeIcon = () => (

<svg
style={iconStyle}
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>

<path d="M3 10L12 3L21 10" />
<path d="M5 10V21H10V15H14V21H19V10" />

</svg>
);

const LeafIcon = () => (

<svg
style={iconStyle}
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>

<path d="M6 21C15 21 20 16 20 7V4H17C8 4 3 9 3 18V21H6Z" />
<path d="M8 12L15 5" />

</svg>
);

const ChartIcon = () => (

<svg
style={iconStyle}
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>

<line x1="18" y1="20" x2="18" y2="10" />
<line x1="12" y1="20" x2="12" y2="4" />
<line x1="6" y1="20" x2="6" y2="14" />

</svg>
);

const LightIcon = () => (

<svg
style={iconStyle}
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>

<path d="M9 18H15" />
<path d="M10 22H14" />
<path d="M12 2C8 2 5 5 5 9C5 12 7 14 8 16H16C17 14 19 12 19 9C19 5 16 2 12 2Z" />

</svg>
);

const HistoryIcon = () => (

<svg
style={iconStyle}
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>

<path d="M3 12A9 9 0 1 0 6 5" />
<polyline points="3 4 3 10 9 10" />
<path d="M12 7V12L15 15" />

</svg>
);

const MicIcon = () => (

<svg
style={iconStyle}
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>

<rect x="9" y="2" width="6" height="12" rx="3" />
<path d="M5 10V12C5 16 8 19 12 19C16 19 19 16 19 12V10" />
<line x1="12" y1="19" x2="12" y2="22" />

</svg>
);

const PlantIcon = () => (

<svg
style={iconStyle}
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>

<path d="M12 22V12" />
<path d="M5 12C5 7 8 4 12 4C16 4 19 7 19 12" />
<path d="M7 8C7 5 9 3 12 3" />

</svg>
);

/* =========================================
NAV STYLE
========================================= */

const navLinkStyle = ({ isActive }) => ({

display:"flex",

alignItems:"center",

padding:"16px 18px",

borderRadius:"18px",

textDecoration:"none",

fontWeight:"700",

fontSize:"15px",

color:isActive ? "#ffffff" : "#111827",

background:isActive
? "linear-gradient(135deg,#2563eb,#1d4ed8)"
: "#ffffff",

border:isActive
? "2px solid #2563eb"
: "2px solid #d1d5db",

boxShadow:isActive
? "0 10px 25px rgba(37,99,235,0.25)"
: "0 4px 14px rgba(0,0,0,0.06)",

transition:"0.3s",

marginBottom:"14px",
});

/* =========================================
SIDEBAR LINK
========================================= */

function SidebarLink({
to,
Icon,
label,
end=false
}) {

return (

<NavLink
to={to}
style={navLinkStyle}
end={end}
>

<div
style={{

display:"flex",

alignItems:"center",

gap:"12px",
}}
>

<span>
<Icon />
</span>

<span>{label}</span>

</div>

</NavLink>
);
}

/* =========================================
APP CONTENT
========================================= */

function AppContent() {

const { t, i18n } =
useTranslation();

const [mobileMenu, setMobileMenu] =
useState(false);

const isMobile =
window.innerWidth < 768;

return (

<div
style={{

display:"flex",

flexDirection:isMobile
? "column"
: "row",

minHeight:"100vh",

background:
"linear-gradient(135deg,#f8fafc,#eef2ff)",

fontFamily:
"Inter, sans-serif",

overflowX:"hidden",
}}
>

{/* MOBILE HEADER */}

{isMobile && (

<div
style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

padding:"16px",

background:"#ffffff",

borderBottom:"1px solid #e5e7eb",

position:"sticky",

top:0,

zIndex:1000,
}}
>

<button

onClick={() =>
setMobileMenu(!mobileMenu)
}

style={{

border:"none",

background:"#2563eb",

color:"#ffffff",

padding:"10px 14px",

borderRadius:"12px",

fontSize:"18px",

cursor:"pointer",
}}
>

☰

</button>

<h2
style={{

margin:0,

fontSize:"22px",

color:"#2563eb",
}}
>

CropAI

</h2>

<select

onChange={(e)=>
i18n.changeLanguage(
e.target.value
)
}

style={{

padding:"8px",

borderRadius:"10px",
}}
>

<option value="en">
English
</option>

<option value="hi">
हिंदी
</option>

<option value="te">
తెలుగు
</option>

</select>

</div>
)}

{/* SIDEBAR */}

{(!isMobile || mobileMenu) && (

<aside
style={{

width:isMobile
? "100%"
: "280px",

background:"#ffffff",

padding:"24px 18px",

borderRight:
isMobile
? "none"
: "2px solid #e5e7eb",

boxShadow:
"8px 0 30px rgba(0,0,0,0.08)",

display:"flex",

flexDirection:"column",

zIndex:999,
}}
>

{/* LOGO */}

<div
style={{

display:"flex",

alignItems:"center",

gap:"12px",

padding:"18px",

borderRadius:"20px",

background:
"linear-gradient(135deg,#f8fafc,#eef2ff)",

border:
"2px solid #dbeafe",

marginBottom:"32px",
}}
>

<div
style={{
fontSize:"28px",
color:"#2563eb",
}}
>
<PlantIcon />
</div>

<div>

<h2
style={{
margin:0,
fontSize:"18px",
color:"#111827",
}}
>
CropAI
</h2>

<p
style={{
margin:0,
fontSize:"12px",
color:"#6b7280",
}}
>
Smart Farming System
</p>

</div>

</div>

{/* NAVIGATION */}

<SidebarLink
to="/"
label={t("dashboard")}
Icon={HomeIcon}
end
/>

<SidebarLink
to="/disease-detection"
label={t("diseaseDetection")}
Icon={LeafIcon}
/>

<SidebarLink
to="/yield-prediction"
label={t("yieldPrediction")}
Icon={ChartIcon}
/>

<SidebarLink
to="/recommendations"
label={t("recommendations")}
Icon={LightIcon}
/>

<SidebarLink
to="/history"
label={t("predictionHistory")}
Icon={HistoryIcon}
/>

<SidebarLink
to="/chatbot"
label="AI Assistant"
Icon={MicIcon}
/>

<SidebarLink
to="/profile"
label="Profile"
Icon={PlantIcon}
/>

{/* LANGUAGE */}

{!isMobile && (

<div
style={{

display:"flex",

gap:"10px",

marginTop:"24px",
}}
>

{["en","hi","te"].map((lang)=>(

<button

key={lang}

onClick={() =>
i18n.changeLanguage(lang)
}

style={{

flex:1,

padding:"12px",

borderRadius:"12px",

border:"2px solid #d1d5db",

background:"#ffffff",

fontWeight:"700",

cursor:"pointer",

color:"#111827",
}}
>

{lang === "en"
? "English"
: lang === "hi"
? "हिंदी"
: "తెలుగు"}

</button>

))}

</div>

)}

<div
style={{

marginTop:"auto",

paddingTop:"20px",

fontSize:"12px",

color:"#9ca3af",
}}
>
Final Year Project
</div>

</aside>
)}

{/* MAIN */}

<main
style={{

flex:1,

padding:isMobile
? "12px"
: "16px",

width:"100%",

overflowX:"hidden",
}}
>

<Routes>

<Route
path="/"
element={<Dashboard />}
/>

<Route
path="/disease-detection"
element={<DiseaseDetection />}
/>

<Route
path="/yield-prediction"
element={<YieldPrediction />}
/>

<Route
path="/recommendations"
element={<Recommendations />}
/>

<Route
path="/history"
element={<History />}
/>

<Route
path="/chatbot"
element={<Chatbot />}
/>

<Route
path="/profile"
element={<Profile />}
/>

</Routes>

</main>

</div>
);
}

/* =========================================
APP
========================================= */

export default function App() {

return (

<Router>

<AppContent />

</Router>
);
}