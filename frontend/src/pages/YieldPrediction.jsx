/**
 * pages/YieldPrediction.jsx
 */

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";

import { db, auth } from "../firebase";

import React, {
  useState,
  useEffect
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from "recharts";

import { predictYield } from "../services/api";

import { useTranslation } from "react-i18next";

import VoiceAssistant from "../components/VoiceAssistant";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

const RISK_COLORS = {

  Low: {

    bg: "#d1fae5",

    text: "#065f46"
  },

  Medium: {

    bg: "#fef3c7",

    text: "#92400e"
  },

  High: {

    bg: "#fee2e2",

    text: "#991b1b"
  },
};

const DEFAULT_FORM = {

  crop: "Rice",

  season: "Kharif",

  state: "Punjab",

  soil_ph: 6.5,

  nitrogen_kg_ha: 80,

  phosphorus_kg_ha: 40,

  potassium_kg_ha: 60,

  rainfall_mm: 900,

  temperature_c: 28,

  humidity_pct: 65,
};

function Field({
  label,
  help,
  children
}) {

  return (

    <div
    style={{
      marginBottom: 16
    }}
    >

      <label
      style={{

        display: "block",

        fontWeight: 600,

        marginBottom: 4,

        fontSize: 14,

        color:"#111827",
      }}
      >
        {label}
      </label>

      {help && (

        <p
        style={{

          color: "#6b7280",

          fontSize: 12,

          margin: "0 0 4px",
        }}
        >
          {help}
        </p>

      )}

      {children}

    </div>
  );
}

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

export default function YieldPrediction() {

  const { i18n } = useTranslation();

  const [form, setForm] =
  useState(DEFAULT_FORM);

  const [result, setResult] =
  useState(null);

  const [loading, setLoading] =
  useState(false);

  const [error, setError] =
  useState(null);

  const [history, setHistory] =
  useState([]);
  const update =
(field) => (e) =>

  setForm((prev) => ({

    ...prev,

    [field]:

    parseFloat(
      e.target.value
    ) ||

    e.target.value
  }));

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

  if(text.includes("rice")){

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

  else if(text.includes("maize")){

    setForm((prev)=>({

      ...prev,

      crop:"Maize"
    }));

    speak(
      "Crop changed to Maize"
    );
  }

  else if(text.includes("soybean")){

    setForm((prev)=>({

      ...prev,

      crop:"Soybean"
    }));

    speak(
      "Crop changed to Soybean"
    );
  }

  else if(text.includes("cotton")){

    setForm((prev)=>({

      ...prev,

      crop:"Cotton"
    }));

    speak(
      "Crop changed to Cotton"
    );
  }

  /* =========================================
     SEASON
  ========================================= */

  if(text.includes("kharif")){

    setForm((prev)=>({

      ...prev,

      season:"Kharif"
    }));

    speak(
      "Season changed to Kharif"
    );
  }

  else if(text.includes("rabi")){

    setForm((prev)=>({

      ...prev,

      season:"Rabi"
    }));

    speak(
      "Season changed to Rabi"
    );
  }

  else if(text.includes("zaid")){

    setForm((prev)=>({

      ...prev,

      season:"Zaid"
    }));

    speak(
      "Season changed to Zaid"
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

      rainfall_mm:value
    }));

    speak(
      `Rainfall set to ${value}`
    );
  }

  /* =========================================
     NITROGEN
  ========================================= */

  const nitrogenMatch =
  text.match(
    /nitrogen\s(\d+)/i
  );

  if(nitrogenMatch){

    const value =
    parseInt(
      nitrogenMatch[1]
    );

    setForm((prev)=>({

      ...prev,

      nitrogen_kg_ha:value
    }));

    speak(
      `Nitrogen set to ${value}`
    );
  }

  /* =========================================
     PHOSPHORUS
  ========================================= */

  const phosphorusMatch =
  text.match(
    /phosphorus\s(\d+)/i
  );

  if(phosphorusMatch){

    const value =
    parseInt(
      phosphorusMatch[1]
    );

    setForm((prev)=>({

      ...prev,

      phosphorus_kg_ha:value
    }));

    speak(
      `Phosphorus set to ${value}`
    );
  }

  /* =========================================
     POTASSIUM
  ========================================= */

  const potassiumMatch =
  text.match(
    /potassium\s(\d+)/i
  );

  if(potassiumMatch){

    const value =
    parseInt(
      potassiumMatch[1]
    );

    setForm((prev)=>({

      ...prev,

      potassium_kg_ha:value
    }));

    speak(
      `Potassium set to ${value}`
    );
  }

  /* =========================================
     SOIL PH
  ========================================= */

  const soilMatch =
  text.match(
    /soil\sph\s(\d+(\.\d+)?)/i
  );

  if(soilMatch){

    const value =
    parseFloat(
      soilMatch[1]
    );

    setForm((prev)=>({

      ...prev,

      soil_ph:value
    }));

    speak(
      `Soil PH set to ${value}`
    );
  }
};

  /* =========================================
     LOAD HISTORY
  ========================================= */

  const loadHistory =
  async () => {

    try {

      const q = query(

        collection(
          db,
          "yield_predictions"
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

  /* =========================================
     PDF DOWNLOAD
  ========================================= */

  const downloadPDF =
  async () => {

    const input =
    document.getElementById(
      "yield-report"
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
      "CropAI_Yield_Report.pdf"
    );
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit =
  async () => {

    setLoading(true);

    setError(null);

    try {

      const data =
      await predictYield(form);

      console.log(
        "API RESULT:",
        data
      );

      setResult(data);

      await addDoc(

        collection(
          db,
          "yield_predictions"
        ),

        {

          userId:
          auth.currentUser?.uid || "",

          crop:
          form.crop,

          season:
          form.season,

          soilPh:
          form.soil_ph,

          nitrogen:
          form.nitrogen_kg_ha,

          phosphorus:
          form.phosphorus_kg_ha,

          rainfall:
          form.rainfall_mm,

          temperature:
          form.temperature_c,

          predictedYield:
          data?.predicted_yield_kg_ha || 0,

          createdAt:
          serverTimestamp(),
        }
      );

      loadHistory();

    } catch (err) {

      console.log(err);

      setError(
        "Prediction failed."
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================
     SHAP DATA
  ========================================= */

  const shapData =
    result?.shap_values

    ? Object.entries(
        result.shap_values
      )

      .map(([name, value]) => ({

        name:
        name.replace(/_/g, " "),

        value:
        parseFloat(
          value.toFixed(1)
        )
      }))

      .sort((a, b) =>

        Math.abs(b.value) -

        Math.abs(a.value)
      )

    : [];

  const predictedYield =

    result?.predicted_yield_kg_ha ||

    result?.predicted_yield ||

    0;

  const riskLevel =

    predictedYield > 5000

    ? "Low"

    : predictedYield > 3000

    ? "Medium"

    : "High";

  return (

    <div
    style={{

      maxWidth: 1200,

      margin: "0 auto",

      padding: "2rem 1rem",
    }}
    >

      {/* HEADER */}

      <h1
      style={{

        fontSize: "2.4rem",

        fontWeight: 800,

        marginBottom: 8,

        color:"#111827",
      }}
      >
        📊 Yield Prediction
      </h1>

      <p
      style={{

        color: "#6b7280",

        marginBottom: 32,

        fontSize:"16px",
      }}
      >
        AI-powered crop production forecasting.
      </p>

      <div
      style={{

        display: "grid",

        gridTemplateColumns:

        window.innerWidth < 768

        ? "1fr"

        : "1fr 1fr",

        gap: 32,
      }}
      >

        {/* FORM */}

        <div
        style={{

          background:"rgba(255,255,255,0.85)",

          borderRadius:"24px",

          padding:"28px",

          boxShadow:
          "0 8px 30px rgba(0,0,0,0.06)",
        }}
        >

          <h2
          style={{

            fontSize: "1.25rem",

            marginBottom: 18,

            color:"#111827",
          }}
          >
            Field Details
          </h2>

          <VoiceAssistant
            i18n={i18n}
            onCommand={handleVoiceCommand}
          />

          <Field label="Crop">

            <select
            style={inputStyle}
            value={form.crop}
            onChange={update("crop")}
            >

              {[
                "Rice",
                "Wheat",
                "Maize",
                "Soybean",
                "Cotton"
              ].map((c) => (

                <option
                key={c}
                value={c}
                >
                  {c}
                </option>

              ))}

            </select>

          </Field>

          <Field label="Season">

            <select
            style={inputStyle}
            value={form.season}
            onChange={update("season")}
            >

              <option value="Kharif">
                Kharif
              </option>

              <option value="Rabi">
                Rabi
              </option>

              <option value="Zaid">
                Zaid
              </option>

            </select>

          </Field>

          {[
            ["Soil PH","soil_ph"],
            ["Nitrogen","nitrogen_kg_ha"],
            ["Phosphorus","phosphorus_kg_ha"],
            ["Potassium","potassium_kg_ha"],
            ["Rainfall","rainfall_mm"],
            ["Temperature","temperature_c"],
            ["Humidity","humidity_pct"]
          ].map(([label,key])=>(

            <Field
            key={key}
            label={label}
            >

              <input
              type="number"
              style={inputStyle}
              value={form[key]}
              onChange={update(key)}
              />

            </Field>

          ))}

          <button

          onClick={handleSubmit}

          disabled={loading}

          style={{

            width: "100%",

            padding: "1rem",

            background:

            loading

            ? "#9ca3af"

            : "linear-gradient(135deg,#2563eb,#1d4ed8)",

            color: "white",

            border: "none",

            borderRadius: 14,

            fontSize: "1rem",

            fontWeight: 700,

            cursor: "pointer",
          }}
          >

            {loading

              ? "Predicting..."

              : "Predict Yield"}

          </button>

        </div>

        {/* RESULTS */}

        <div>

          {!result && !error && (

            <div
            style={{

              background:"rgba(255,255,255,0.75)",

              border:"1px dashed #d1d5db",

              borderRadius:24,

              padding:"4rem 2rem",

              textAlign:"center",

              color:"#6b7280",
            }}
            >
              Fill the form and click Predict Yield.
            </div>

          )}

          {error && (

            <div
            style={{

              background:"#fee2e2",

              color:"#991b1b",

              padding:"20px",

              borderRadius:"18px",
            }}
            >
              {error}
            </div>

          )}

          {result && (

            <div id="yield-report">

              <div
              style={{

                display:"grid",

                gap:"22px",
              }}
              >

                {/* PREDICTION */}

                <div
                style={{

                  background:
                  "linear-gradient(135deg,#2563eb,#06b6d4)",

                  color:"white",

                  borderRadius:"24px",

                  padding:"30px",
                }}
                >

                  <p
                  style={{
                    opacity:0.9,
                  }}
                  >
                    Predicted Yield
                  </p>

                  <h1
                  style={{
                    fontSize:"64px",
                    margin:"0",
                  }}
                  >
                    {predictedYield}
                  </h1>

                  <p>
                    kg/hectare estimated output
                  </p>

                </div>

                {/* RISK */}

                <div
                style={{

                  background:
                  RISK_COLORS[riskLevel].bg,

                  borderRadius:"20px",

                  padding:"22px",
                }}
                >

                  <h3
                  style={{
                    color:"#111827",
                  }}
                  >
                    Yield Risk Level
                  </h3>

                  <h1
                  style={{
                    color:
                    RISK_COLORS[riskLevel].text,
                  }}
                  >
                    {riskLevel}
                  </h1>

                </div>

                {/* DOWNLOAD */}

                <button

                onClick={downloadPDF}

                style={{

                  background:
                  "linear-gradient(135deg,#16a34a,#15803d)",

                  color:"white",

                  border:"none",

                  padding:"14px",

                  borderRadius:"14px",

                  fontWeight:"700",

                  cursor:"pointer",
                }}
                >
                  Download PDF Report
                </button>

                {/* GRAPH */}

                {shapData.length > 0 && (

                  <div
                  style={{

                    background:"#ffffff",

                    borderRadius:"24px",

                    padding:"22px",

                    boxShadow:
                    "0 10px 24px rgba(0,0,0,0.06)",
                  }}
                  >

                    <h3
                    style={{
                      color:"#111827",
                    }}
                    >
                      Feature Impact Analysis
                    </h3>

                    <ResponsiveContainer
                    width="100%"
                    height={320}
                    >

                      <BarChart
                      data={shapData}
                      >

                        <CartesianGrid
                        strokeDasharray="3 3"
                        />

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <ReferenceLine y={0} />

                        <Bar dataKey="value">

                          {shapData.map(
                            (entry,index)=>(
                              <Cell
                              key={index}
                              fill={
                                entry.value > 0
                                ? "#16a34a"
                                : "#dc2626"
                              }
                              />
                            )
                          )}

                        </Bar>

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

      {/* HISTORY */}

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
          Recent Predictions
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

              <p
              style={{
                color:"#6b7280",
                marginTop:"8px",
              }}
              >
                Yield:
                {" "}
                {item.predictedYield}
                {" "}
                kg/hectare
              </p>

              <p
              style={{
                color:"#6b7280",
              }}
              >
                Season:
                {" "}
                {item.season}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}