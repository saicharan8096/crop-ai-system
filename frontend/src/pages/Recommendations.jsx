import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase";

import React, {
  useState,
  useEffect
} from "react";

import { getRecommendations } from "../services/api";

import { useTranslation } from "react-i18next";

import VoiceAssistant from "../components/VoiceAssistant";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

const inputStyle = {

  width: "100%",

  padding: "0.75rem 0.9rem",

  border: "1px solid #d1d5db",

  borderRadius: 10,

  fontSize: 14,

  boxSizing: "border-box",

  background:"white",

  color:"#111827",

  outline:"none",
};

const URGENCY_COLORS = {

  "Monitor": {
    bg: "#d1fae5",
    text: "#065f46"
  },

  "Act within 7 days": {
    bg: "#fef3c7",
    text: "#92400e"
  },

  "Act immediately": {
    bg: "#fee2e2",
    text: "#991b1b"
  },
};

function ListCard({
  title,
  emoji,
  items,
  color = "#2563eb"
}) {

  return (

    <div
    style={{

      border: "1px solid #e5e7eb",

      borderRadius: 18,

      padding: "1.4rem",

      marginBottom: 18,

      background:"rgba(255,255,255,0.75)",

      backdropFilter:"blur(12px)",

      boxShadow:
      "0 6px 24px rgba(0,0,0,0.05)",
    }}
    >

      <h3
      style={{

        marginTop: 0,

        color: color,

        fontSize: "1.05rem",

        marginBottom:"14px",
      }}
      >
        {emoji} {title}
      </h3>

      <ul
      style={{
        paddingLeft: 20,
        margin: 0,
      }}
      >

        {items?.map((item, i) => (

          <li
          key={i}
          style={{

            marginBottom: 8,

            fontSize: 14,

            color: "#374151",

            lineHeight: 1.7,
          }}
          >
            {item}
          </li>

        ))}

      </ul>

    </div>
  );
}

export default function Recommendations() {

  const { t, i18n } =
  useTranslation();

  const [form, setForm] =
  useState({

    crop: "Tomato",

    disease_name: "Early blight",

    severity: "Mild",

    temperature_c: 28,

    humidity_pct: 65,

    rainfall_last_7_days_mm: 20,

    crop_stage: "Vegetative",
  });

  const [result, setResult] =
  useState(null);

  const [loading, setLoading] =
  useState(false);

  const [error, setError] =
  useState(null);

  const [history, setHistory] =
  useState([]);

  const loadHistory =
  async () => {

    try {

      const q = query(

        collection(
          db,
          "recommendations"
        ),

        orderBy(
          "createdAt",
          "desc"
        ),

        limit(5)
      );

      const snapshot =
      await getDocs(q);

      const historyData =
      snapshot.docs.map((doc)=>({

        id:doc.id,

        ...doc.data(),
      }));

      setHistory(historyData);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(()=>{

    loadHistory();

  },[]);

  const downloadPDF =
  async () => {

    const input =
    document.getElementById(
      "recommendation-report"
    );

    if(!input) return;

    const canvas =
    await html2canvas(input);

    const imgData =
    canvas.toDataURL("image/png");

    const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth =
    pdf.internal.pageSize.getWidth();

    const pdfHeight =
    (canvas.height * pdfWidth) /
    canvas.width;

    pdf.addImage(

      imgData,

      "PNG",

      0,

      0,

      pdfWidth,

      pdfHeight
    );

    pdf.save(
      "CropAI_Recommendations_Report.pdf"
    );
  };

  const handleVoiceCommand = (
  command,
  speak
) => {

  console.log(
    "VOICE:",
    command
  );

  const text =
  command.toLowerCase();

  /* =========================================
     CROPS
  ========================================= */

  if(text.includes("tomato")){

    setForm((prev)=>({

      ...prev,

      crop:"Tomato"
    }));

    speak(
      "Crop changed to Tomato"
    );
  }

  else if(text.includes("potato")){

    setForm((prev)=>({

      ...prev,

      crop:"Potato"
    }));

    speak(
      "Crop changed to Potato"
    );
  }

  else if(text.includes("rice")){

    setForm((prev)=>({

      ...prev,

      crop:"Rice"
    }));

    speak(
      "Crop changed to Rice"
    );
  }

  else if(text.includes("wheat")){

    setForm((prev)=>({

      ...prev,

      crop:"Wheat"
    }));

    speak(
      "Crop changed to Wheat"
    );
  }

  /* =========================================
     DISEASES
  ========================================= */

  if(text.includes("blight")){

    setForm((prev)=>({

      ...prev,

      disease_name:"Early blight"
    }));

    speak(
      "Disease changed to Early blight"
    );
  }

  else if(text.includes("rust")){

    setForm((prev)=>({

      ...prev,

      disease_name:"Leaf Rust"
    }));

    speak(
      "Disease changed to Leaf Rust"
    );
  }

  else if(text.includes("healthy")){

    setForm((prev)=>({

      ...prev,

      disease_name:"Healthy"
    }));

    speak(
      "Disease changed to Healthy"
    );
  }

  /* =========================================
     SEVERITY
  ========================================= */

  if(text.includes("mild")){

    setForm((prev)=>({

      ...prev,

      severity:"Mild"
    }));

    speak(
      "Severity set to Mild"
    );
  }

  else if(text.includes("moderate")){

    setForm((prev)=>({

      ...prev,

      severity:"Moderate"
    }));

    speak(
      "Severity set to Moderate"
    );
  }

  else if(text.includes("severe")){

    setForm((prev)=>({

      ...prev,

      severity:"Severe"
    }));

    speak(
      "Severity set to Severe"
    );
  }

  /* =========================================
     TEMPERATURE
  ========================================= */

  const tempMatch =
  text.match(
    /temperature\s(\d+)/i
  );

  if(tempMatch){

    const value =
    parseInt(tempMatch[1]);

    setForm((prev)=>({

      ...prev,

      temperature_c:value
    }));

    speak(
      `Temperature set to ${value}`
    );
  }

  /* =========================================
     HUMIDITY
  ========================================= */

  const humidityMatch =
  text.match(
    /humidity\s(\d+)/i
  );

  if(humidityMatch){

    const value =
    parseInt(
      humidityMatch[1]
    );

    setForm((prev)=>({

      ...prev,

      humidity_pct:value
    }));

    speak(
      `Humidity set to ${value}`
    );
  }

  /* =========================================
     RAINFALL
  ========================================= */

  const rainfallMatch =
  text.match(
    /rainfall\s(\d+)/i
  );

  if(rainfallMatch){

    const value =
    parseInt(
      rainfallMatch[1]
    );

    setForm((prev)=>({

      ...prev,

      rainfall_last_7_days_mm:value
    }));

    speak(
      `Rainfall set to ${value}`
    );
  }

  /* =========================================
     CROP STAGE
  ========================================= */

  if(text.includes("vegetative")){

    setForm((prev)=>({

      ...prev,

      crop_stage:"Vegetative"
    }));

    speak(
      "Crop stage changed to Vegetative"
    );
  }

  else if(text.includes("flowering")){

    setForm((prev)=>({

      ...prev,

      crop_stage:"Flowering"
    }));

    speak(
      "Crop stage changed to Flowering"
    );
  }

  else if(text.includes("harvesting")){

    setForm((prev)=>({

      ...prev,

      crop_stage:"Harvesting"
    }));

    speak(
      "Crop stage changed to Harvesting"
    );
  }
};

  const update =
  (field) => (e) =>

    setForm((p) => ({

      ...p,

      [field]:

      parseFloat(
        e.target.value
      )

      || e.target.value
    }));

  const handleSubmit =
  async () => {

    setLoading(true);

    setError(null);

    try {

      const response =
      await getRecommendations(form);

      setResult(response);

      await addDoc(

        collection(
          db,
          "recommendations"
        ),

        {

          userId:
          auth.currentUser?.uid || "",

          crop:
          form.crop,

          disease:
          form.disease_name,

          cropStage:
          form.crop_stage,

          severity:
          form.severity,

          recommendation:
          JSON.stringify(response),

          createdAt:
          serverTimestamp(),
        }
      );

      loadHistory();

    } catch (err) {

      console.log(err);

      setError(

        err.response?.data?.detail ||

        "Error connecting to server."
      );

    } finally {

      setLoading(false);
    }
  };

  const urgency =
  result

  ? URGENCY_COLORS[
      result.urgency
    ]

  : null;

  return (

    <div
    style={{

      maxWidth: 1100,

      margin: "0 auto",

      padding: "2rem 1rem",
    }}
    >

      <h1
      style={{

        fontSize: "2.4rem",

        fontWeight: 800,

        marginBottom: 8,

        color:"#111827",
      }}
      >
        💡 {t("recommendationsTitle")}
      </h1>

      <p
      style={{

        color: "#6b7280",

        marginBottom: 32,

        fontSize:"16px",

        lineHeight:1.7,
      }}
      >
        {t("recommendationsTitle")}
      </p>

      <div
      style={{

        display: "grid",

        gridTemplateColumns:
        window.innerWidth < 768
        ? "1fr"
        : "1fr 1.4fr",

        gap: 32,
      }}
      >

        <div
        style={{

          background:"rgba(255,255,255,0.75)",

          backdropFilter:"blur(16px)",

          borderRadius:"24px",

          padding:"28px",

          boxShadow:
          "0 8px 30px rgba(0,0,0,0.06)",
        }}
        >

          <h2
          style={{
            color:"#111827",
          }}
          >
            {t("cropSituation")}
          </h2>

          <VoiceAssistant
          i18n={i18n}
          onCommand={handleVoiceCommand}
          />

          <div style={{marginBottom:16}}>

            <label
            style={{
              color:"#111827",
              fontWeight:"600",
            }}
            >
              {t("crop")}
            </label>

            <input
            type="text"
            style={inputStyle}
            value={form.crop}
            onChange={update("crop")}
            />

          </div>

          <div style={{marginBottom:16}}>

            <label
            style={{
              color:"#111827",
              fontWeight:"600",
            }}
            >
              {t("disease")}
            </label>

            <input
            type="text"
            style={inputStyle}
            value={form.disease_name}
            onChange={update("disease_name")}
            />

          </div>

          <button

          onClick={handleSubmit}

          disabled={loading}

          style={{

            width:"100%",

            padding:"1rem",

            background:
            loading
            ? "#d1d5db"
            : "#d97706",

            color:"white",

            border:"none",

            borderRadius:"14px",

            fontWeight:"700",

            cursor:"pointer",
          }}
          >
            {loading
            ? t("loading")
            : t("getRecommendations")}
          </button>

        </div>

        <div>

          {result && (

            <div
            id="recommendation-report"
            >

              <div
              style={{

                background:
                urgency?.bg,

                color:
                urgency?.text,

                borderRadius:14,

                padding:"1rem",

                marginBottom:22,

                fontWeight:"700",
              }}
              >
                🚨 {result.urgency}
              </div>

              <ListCard
              title={t("diseaseDetected")}
              emoji="💊"
              items={result.treatment}
              color="#dc2626"
              />

              <ListCard
              title={t("advice")}
              emoji="🌱"
              items={result.fertilizer}
              color="#16a34a"
              />

              <button

              onClick={downloadPDF}

              style={{

                width:"100%",

                padding:"1rem",

                background:
                "linear-gradient(135deg,#16a34a,#15803d)",

                color:"white",

                border:"none",

                borderRadius:"14px",

                fontWeight:"700",

                cursor:"pointer",
              }}
              >
                {t("downloadReport")}
              </button>

            </div>

          )}

        </div>

      </div>

      <div
      style={{
        marginTop:"40px",
      }}
      >

        <h2
        style={{
          color:"#111827",
          marginBottom:"18px",
        }}
        >
          {t("recommendationsTitle")}
        </h2>

        <div
        style={{

          display:"grid",

          gap:"16px",
        }}
        >

          {history.map((item,index)=>(

            <div

            key={index}

            style={{

              background:"#ffffff",

              borderRadius:"18px",

              padding:"18px",

              boxShadow:
              "0 8px 20px rgba(0,0,0,0.05)",
            }}
            >

              <h3
              style={{
                margin:"0",
                color:"#111827",
              }}
              >
                {item.crop}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}