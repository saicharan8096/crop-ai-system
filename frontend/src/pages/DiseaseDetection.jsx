/**
 * pages/DiseaseDetection.jsx
 */

import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase";

import React, {
  useState,
  useCallback
} from "react";

import { useTranslation } from "react-i18next";

import { detectDisease } from "../services/api";

const SEVERITY_COLORS = {

  Healthy: {
    bg: "#d1fae5",
    text: "#065f46",
    border: "#6ee7b7"
  },

  Mild: {
    bg: "#fef3c7",
    text: "#92400e",
    border: "#fcd34d"
  },

  Moderate: {
    bg: "#fed7aa",
    text: "#7c2d12",
    border: "#fb923c"
  },

  Severe: {
    bg: "#fee2e2",
    text: "#991b1b",
    border: "#f87171"
  },
};

export default function DiseaseDetection() {

  const { t } = useTranslation();

  const [selectedFile,setSelectedFile] =
  useState(null);

  const [previewUrl,setPreviewUrl] =
  useState(null);

  const [result,setResult] =
  useState(null);

  const [history,setHistory] =
  useState(()=>{

    const saved =
    localStorage.getItem(
      "predictionHistory"
    );

    return saved
    ? JSON.parse(saved)
    : [];
  });

  const [loading,setLoading] =
  useState(false);

  const [error,setError] =
  useState(null);

  const handleFileSelect =
  useCallback((e)=>{

    const file =
    e.target.files?.[0]
    || e.dataTransfer?.files?.[0];

    if(!file) return;

    setSelectedFile(file);

    setPreviewUrl(
      URL.createObjectURL(file)
    );

    setResult(null);

    setError(null);

  },[]);

  const handleDragOver = (e)=>
  e.preventDefault();

  const handleDrop = (e)=>{

    e.preventDefault();

    handleFileSelect(e);
  };

  const handleSubmit = async ()=>{

    if(!selectedFile) return;

    setLoading(true);

    setError(null);

    try{

      const data =
      await detectDisease(selectedFile);

      setResult(data);

      try{

        await addDoc(
          collection(
            db,
            "disease_detections"
          ),
          {

            userId:
            auth.currentUser?.uid || "",

            crop:data.crop,

            disease:data.disease_name,

            severity:data.severity,

            confidence:data.confidence,

            pesticide:data.pesticide,

            dosage:data.dosage,

            advice:data.advice,

            createdAt:
            serverTimestamp(),
          }
        );

      }catch(firestoreError){

        console.log(firestoreError);
      }

      const newEntry = {

        time:
        new Date().toLocaleString(),

        crop:data.crop,

        disease:data.disease_name,

        confidence:data.confidence,
      };

      setHistory((prev)=>{

        const updated =
        [newEntry,...prev];

        localStorage.setItem(
          "predictionHistory",
          JSON.stringify(updated)
        );

        return updated;
      });

    }catch(err){

      setError(
        err.response?.data?.detail ||
        "Error connecting to server."
      );

    }finally{

      setLoading(false);
    }
  };

  const severityStyle =
  result
  ? SEVERITY_COLORS[result.severity]
  || SEVERITY_COLORS.Mild
  : {};

  return (

    <div
    style={{

      maxWidth:1100,

      margin:"0 auto",

      padding:
      window.innerWidth < 768
      ? "1rem"
      : "2rem 1rem",
    }}
    >

      {/* HEADER */}

      <h1
      style={{

        fontSize:
        window.innerWidth < 768
        ? "2rem"
        : "2.6rem",

        fontWeight:800,

        marginBottom:10,

        color:"#111827",
      }}
      >
        🌿 {t("title")}
      </h1>

      <p
      style={{

        color:"#6b7280",

        marginBottom:32,

        fontSize:"16px",

        lineHeight:1.7,
      }}
      >
        {t("uploadDescription")}
      </p>

      {/* UPLOAD */}

      <div

      onDragOver={handleDragOver}

      onDrop={handleDrop}

      style={{

        border:"2px dashed #d1d5db",

        borderRadius:24,

        padding:"2.5rem",

        textAlign:"center",

        cursor:"pointer",

        background:
        "rgba(255,255,255,0.75)",

        backdropFilter:"blur(16px)",

        boxShadow:
        "0 8px 30px rgba(0,0,0,0.05)",

        marginBottom:20,

        transition:"0.3s",
      }}

      onClick={()=>
      document
      .getElementById("leaf-upload")
      .click()
      }
      >

        <input

        id="leaf-upload"

        type="file"

        accept="image/jpeg,image/png"

        style={{display:"none"}}

        onChange={handleFileSelect}
        />

        {previewUrl ? (

          <img

          src={previewUrl}

          alt="Selected leaf"

          style={{

            maxHeight:260,

            borderRadius:18,

            objectFit:"contain",
          }}
          />

        ) : (

          <>

            <div
            style={{

              fontSize:56,

              marginBottom:10,
            }}
            >
              📷
            </div>

            <p
            style={{

              color:"#4b5563",

              margin:0,

              fontSize:"18px",
            }}
            >
              {t("dragDrop")}
            </p>

            <p
            style={{

              color:"#9ca3af",

              fontSize:14,

              marginTop:6,
            }}
            >
              {t("supports")}
            </p>

          </>

        )}

      </div>

      {/* BUTTON */}

      <button

      onClick={handleSubmit}

      disabled={!selectedFile || loading}

      style={{

        width:"100%",

        padding:"1rem",

        background:
        selectedFile && !loading
        ? "#16a34a"
        : "#d1d5db",

        color:"white",

        border:"none",

        borderRadius:14,

        fontSize:"1rem",

        fontWeight:700,

        cursor:
        selectedFile && !loading
        ? "pointer"
        : "not-allowed",

        marginBottom:28,

        transition:"0.3s",
      }}
      >

        {loading
        ? `🔍 ${t("analysing")}`
        : `${t("analyse")} →`}

      </button>

      {/* ERROR */}

      {error && (

        <div
        style={{

          background:"#fee2e2",

          border:"1px solid #f87171",

          borderRadius:12,

          padding:"1rem",

          marginBottom:24,

          color:"#991b1b",
        }}
        >
          ⚠️ {error}
        </div>

      )}

      {/* RESULTS */}

      {result && (

        <div
        style={{

          display:"grid",

          gridTemplateColumns:
          window.innerWidth < 768
          ? "1fr"
          : "1fr 1fr",

          gap:22,
        }}
        >

          {/* DIAGNOSIS */}

          <div
          style={{

            border:"1px solid #e5e7eb",

            borderRadius:24,

            padding:"1.7rem",

            background:
            "rgba(255,255,255,0.75)",

            backdropFilter:"blur(16px)",

            boxShadow:
            "0 8px 30px rgba(0,0,0,0.05)",
          }}
          >

            <h2
            style={{

              marginTop:0,

              fontSize:"1.4rem",

              color:"#111827",
            }}
            >
              {t("diagnosis")}
            </h2>

            {/* DOWNLOAD */}

            <button

            onClick={()=>{

              const report = `

Crop: ${result.crop}

Disease: ${result.disease_name}

Confidence:
${(result.confidence * 100).toFixed(1)}%

Pesticide: ${result.pesticide}

Dosage: ${result.dosage}

Advice: ${result.advice}

Generated:
${new Date().toLocaleString()}
`;

              const blob =
              new Blob([report],{
                type:"text/plain",
              });

              const url =
              URL.createObjectURL(blob);

              const a =
              document.createElement("a");

              a.href = url;

              a.download =
              "crop-disease-report.txt";

              a.click();

              URL.revokeObjectURL(url);

            }}

            style={{

              background:"#2563eb",

              color:"white",

              border:"none",

              padding:"10px 16px",

              borderRadius:10,

              cursor:"pointer",

              marginBottom:18,

              fontWeight:600,
            }}
            >
              {t("downloadReport")}
            </button>

            {/* SEVERITY */}

            <span
            style={{

              display:"inline-block",

              padding:"5px 15px",

              borderRadius:20,

              fontSize:14,

              fontWeight:700,

              background:
              severityStyle.bg,

              color:
              severityStyle.text,

              border:
              `1px solid ${severityStyle.border}`,

              marginBottom:18,
            }}
            >
              {result.severity}
            </span>

            <p style={{color:"#374151"}}>
              <strong>{t("crop")}:</strong>
              {" "}
              {result.crop}
            </p>

            <p style={{color:"#374151"}}>
              <strong>{t("disease")}:</strong>
              {" "}
              {result.disease_name}
            </p>

            <p style={{color:"#374151"}}>
              <strong>{t("confidence")}:</strong>
              {" "}
              {(result.confidence * 100).toFixed(1)}%
            </p>

            <p style={{color:"#374151"}}>
              <strong>{t("pesticide")}:</strong>
              {" "}
              {result.pesticide}
            </p>

            <p style={{color:"#374151"}}>
              <strong>{t("dosage")}:</strong>
              {" "}
              {result.dosage}
            </p>

            <p style={{color:"#374151"}}>
              <strong>{t("advice")}:</strong>
              {" "}
              {result.advice}
            </p>

            {/* CONFIDENCE BAR */}

            <div
            style={{

              background:"#e5e7eb",

              borderRadius:6,

              height:10,

              margin:"10px 0 22px",
            }}
            >

              <div
              style={{

                width:
                `${result.confidence * 100}%`,

                height:"100%",

                borderRadius:6,

                background:
                result.is_healthy
                ? "#16a34a"
                : "#ef4444",
              }}
              />

            </div>

            {/* TOP PREDICTIONS */}

            <h3
            style={{

              fontSize:"1rem",

              marginBottom:10,

              color:"#111827",
            }}
            >
              {t("topPredictions")}
            </h3>

            {result.top3_predictions.map((p,i)=>(

              <div

              key={i}

              style={{

                display:"flex",

                justifyContent:"space-between",

                padding:"8px 0",

                borderBottom:
                "1px solid #f3f4f6",

                fontSize:14,
              }}
              >

                <span style={{color:"#374151"}}>
                  {p.class}
                </span>

                <span style={{color:"#6b7280"}}>
                  {(p.confidence * 100).toFixed(1)}%
                </span>

              </div>

            ))}

          </div>

          {/* HEATMAP */}

          <div
          style={{

            border:"1px solid #e5e7eb",

            borderRadius:24,

            padding:"1.7rem",

            background:
            "rgba(255,255,255,0.75)",

            backdropFilter:"blur(16px)",

            boxShadow:
            "0 8px 30px rgba(0,0,0,0.05)",
          }}
          >

            <h2
            style={{

              marginTop:0,

              fontSize:"1.4rem",

              color:"#111827",
            }}
            >
              {t("heatmap")}
            </h2>

            <p
            style={{

              fontSize:14,

              color:"#6b7280",

              lineHeight:1.7,
            }}
            >
              Red/yellow areas = the parts
              of the leaf the AI focused on.
            </p>

            {result.heatmap_base64 ? (

              <img

              src={`data:image/jpeg;base64,${result.heatmap_base64}`}

              alt="Grad-CAM heatmap"

              style={{

                width:"100%",

                borderRadius:18,
              }}
              />

            ) : (

              <p
              style={{
                color:"#9ca3af",
                fontSize:14,
              }}
              >
                Heatmap not available.
              </p>

            )}

          </div>

        </div>

      )}

      {/* HISTORY */}

      {history.length > 0 && (

        <div
        style={{

          border:"1px solid #e5e7eb",

          borderRadius:24,

          padding:"1.7rem",

          marginTop:28,

          background:
          "rgba(255,255,255,0.75)",

          backdropFilter:"blur(16px)",

          boxShadow:
          "0 8px 30px rgba(0,0,0,0.05)",
        }}
        >

          <div
          style={{

            display:"flex",

            justifyContent:"space-between",

            alignItems:"center",
          }}
          >

            <h2
            style={{

              marginTop:0,

              color:"#111827",
            }}
            >
              {t("predictionHistory")}
            </h2>

            <button

            onClick={()=>{

              localStorage.removeItem(
                "predictionHistory"
              );

              setHistory([]);

            }}

            style={{

              background:"#ef4444",

              color:"white",

              border:"none",

              padding:"8px 14px",

              borderRadius:10,

              cursor:"pointer",
            }}
            >
              {t("clearHistory")}
            </button>

          </div>

          {history.map((item,index)=>(

            <div

            key={index}

            style={{

              padding:"12px 0",

              borderBottom:
              "1px solid #f3f4f6",
            }}
            >

              <p style={{color:"#374151"}}>
                <strong>{t("time")}:</strong>
                {" "}
                {item.time}
              </p>

              <p style={{color:"#374151"}}>
                <strong>{t("crop")}:</strong>
                {" "}
                {item.crop}
              </p>

              <p style={{color:"#374151"}}>
                <strong>{t("disease")}:</strong>
                {" "}
                {item.disease}
              </p>

              <p style={{color:"#374151"}}>
                <strong>{t("confidence")}:</strong>
                {" "}
                {(item.confidence * 100).toFixed(1)}%
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}