import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

import {
  useTranslation
} from "react-i18next";
import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase";

const floatingAnimation = `
@keyframes floatCard {

0% {
transform: translateY(0px);
}

50% {
transform: translateY(-4px);
}

100% {
transform: translateY(0px);
}
}
`;

export default function Dashboard() {

  const navigate = useNavigate();

  const {
    t,
    i18n
  } = useTranslation();

  const [weather,setWeather] =
  useState(null);

  const [loading,setLoading] =
  useState(true);
  const [farmer,setFarmer] =
useState(null);

  useEffect(()=>{

  const loadFarmer =
  async ()=>{

    try{

      const uid =
      auth.currentUser?.uid;

      if(!uid) return;

      const snap =
      await getDoc(

        doc(
          db,
          "farmers",
          uid
        )
      );

      if(snap.exists()){

        setFarmer(
          snap.data()
        );
      }

    }catch(error){

      console.log(error);
    }
  };

  const fetchWeather =
  async ()=>{

    try{

      const city =
      farmer?.district || "Delhi";

      const response =
      await axios.get(

`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=136a197a82b357036573fb982d2ffbbc`
      );

      setWeather(
        response.data
      );

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);
    }
  };

  loadFarmer();

  fetchWeather();

},[farmer]);
  const isMobile =
  window.innerWidth < 768;

  const cardStyle = {

    background:"rgba(255,255,255,0.96)",

    borderRadius:"22px",

    padding:"22px",

    minHeight:"155px",

    transition:
    "all 0.35s cubic-bezier(0.4,0,0.2,1)",

    cursor:"pointer",

    position:"relative",

    overflow:"hidden",

    border:"1px solid rgba(255,255,255,0.7)",
  };

  const hoverEnter = (e)=>{

    e.currentTarget.style.transform =
    "translateY(-6px)";
  };

  const hoverLeave = (e)=>{

    e.currentTarget.style.transform =
    "translateY(0px)";
  };

  return (

    <>

      <style>
        {floatingAnimation}
      </style>

      <div
      style={{

        padding:
        isMobile
        ? "16px"
        : "24px 30px 42px 30px",

        maxWidth:"1380px",

        margin:"0 auto",

        background:
        "linear-gradient(135deg,#f8fafc,#eef2ff)",

        minHeight:"100vh",
      }}
      >

        {/* HEADER */}

        <div
        style={{

          marginBottom:"24px",

          display:"flex",

          justifyContent:"space-between",

          alignItems:
          isMobile
          ? "flex-start"
          : "center",

          flexDirection:
          isMobile
          ? "column"
          : "row",

          gap:"16px",
        }}
        >

          <div>

            <h1
            style={{

              fontSize:
              isMobile ? "34px" : "46px",

              fontWeight:"800",

              color:"#111827",

              marginBottom:"6px",
            }}
            >
              {t("dashboard")}
            </h1>

            <p
            style={{

              color:"#6b7280",

              fontSize:"17px",
            }}
            >
              Smart AI farming analytics platform.
            </p>

          </div>

          <select

          value={i18n.language}

          onChange={(e)=>
          i18n.changeLanguage(
            e.target.value
          )}

          style={{

            padding:"12px",

            borderRadius:"12px",

            border:
            "1px solid #d1d5db",

            background:"white",

            cursor:"pointer",

            fontWeight:"600",
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

        {/* OVERVIEW */}

        <div
        style={{

          display:"grid",

          gridTemplateColumns:
          isMobile
          ? "1fr"
          : "repeat(3,1fr)",

          gap:"20px",

          marginBottom:"24px",
        }}
        >

          {/* CARD 1 */}

          <div

          style={{
            ...cardStyle,

            borderTop:
            "4px solid #3b82f6",

            boxShadow:
            "0 10px 28px rgba(59,130,246,0.18)",
          }}

          onClick={()=>
          navigate("/disease-detection")
          }

          onMouseEnter={hoverEnter}

          onMouseLeave={hoverLeave}
          >

            <div
            style={{

              width:"62px",

              height:"62px",

              borderRadius:"18px",

              background:"#dbeafe",

              display:"flex",

              alignItems:"center",

              justifyContent:"center",

              fontSize:"28px",

              marginBottom:"14px",
            }}
            >
              🌿
            </div>

            <h3
            style={{
              color:"#111827",
            }}
            >
              {t("diseaseDetection")}
            </h3>

          </div>

          {/* CARD 2 */}

          <div

          style={{
            ...cardStyle,

            borderTop:
            "4px solid #22c55e",

            boxShadow:
            "0 10px 28px rgba(34,197,94,0.18)",
          }}

          onClick={()=>
          navigate("/yield-prediction")
          }

          onMouseEnter={hoverEnter}

          onMouseLeave={hoverLeave}
          >

            <div
            style={{

              width:"62px",

              height:"62px",

              borderRadius:"18px",

              background:"#dcfce7",

              display:"flex",

              alignItems:"center",

              justifyContent:"center",

              fontSize:"28px",

              marginBottom:"14px",
            }}
            >
              📊
            </div>

            <h3
            style={{
              color:"#111827",
            }}
            >
              {t("yieldPrediction")}
            </h3>

          </div>

          {/* CARD 3 */}

          <div

          style={{
            ...cardStyle,

            borderTop:
            "4px solid #9333ea",

            boxShadow:
            "0 10px 28px rgba(147,51,234,0.18)",
          }}

          onClick={()=>
          navigate("/recommendations")
          }

          onMouseEnter={hoverEnter}

          onMouseLeave={hoverLeave}
          >

            <div
            style={{

              width:"62px",

              height:"62px",

              borderRadius:"18px",

              background:"#f3e8ff",

              display:"flex",

              alignItems:"center",

              justifyContent:"center",

              fontSize:"28px",

              marginBottom:"14px",
            }}
            >
              🌦
            </div>

            <h3
            style={{
              color:"#111827",
            }}
            >
              {t("recommendations")}
            </h3>

          </div>

        </div>

        {/* WEATHER */}

        <div

        onMouseEnter={hoverEnter}

        onMouseLeave={hoverLeave}

        style={{

          position:"relative",

          overflow:"hidden",

          borderRadius:"28px",

          padding:
          isMobile ? "22px" : "28px",

          marginBottom:"26px",

          backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400')",

          backgroundSize:"cover",

          backgroundPosition:"center",

          boxShadow:
          "0 16px 38px rgba(37,99,235,0.18)",
        }}
        >

          <div
          style={{

            position:"absolute",

            inset:0,

            background:
            "linear-gradient(135deg,rgba(37,99,235,0.72),rgba(6,182,212,0.55))",
          }}
          />

          <div
          style={{

            position:"relative",

            zIndex:2,
          }}
          >

            <h2
            style={{
              color:"white",
              fontSize:"30px",
            }}
            >
              Weather Today
            </h2>

            <h1
            style={{

              color:"white",

              fontSize:
              isMobile ? "54px" : "74px",

              margin:"0",
            }}
            >
              {loading || !weather
              ? "--"
              : `${Math.round(weather.main.temp)}°C`}
            </h1>

            <p
            style={{

              color:"white",

              fontSize:"22px",
            }}
            >
              {loading || !weather
              ? "Loading..."
              : weather.weather[0].main}
            </p>

            {/* WEATHER STATS */}

            <div
            style={{

              display:"grid",

              gridTemplateColumns:
              isMobile
              ? "1fr 1fr"
              : "repeat(4,1fr)",

              gap:"16px",

              marginTop:"28px",
            }}
            >

              {/* HUMIDITY */}

              <div
              style={{

                background:
                "rgba(255,255,255,0.18)",

                backdropFilter:"blur(10px)",

                borderRadius:"18px",

                padding:"18px",

                color:"white",
              }}
              >

                <div
                style={{
                  fontSize:"28px",
                  marginBottom:"8px",
                }}
                >
                  💧
                </div>

                <p>Humidity</p>

                <h3>
                  {loading || !weather
                  ? "--"
                  : `${weather.main.humidity}%`}
                </h3>

              </div>

              {/* WIND */}

              <div
              style={{

                background:
                "rgba(255,255,255,0.18)",

                backdropFilter:"blur(10px)",

                borderRadius:"18px",

                padding:"18px",

                color:"white",
              }}
              >

                <div
                style={{
                  fontSize:"28px",
                  marginBottom:"8px",
                }}
                >
                  🌬️
                </div>

                <p>Wind</p>

                <h3>
                  {loading || !weather
                  ? "--"
                  : `${weather.wind.speed} m/s`}
                </h3>

              </div>

              {/* FEELS LIKE */}

              <div
              style={{

                background:
                "rgba(255,255,255,0.18)",

                backdropFilter:"blur(10px)",

                borderRadius:"18px",

                padding:"18px",

                color:"white",
              }}
              >

                <div
                style={{
                  fontSize:"28px",
                  marginBottom:"8px",
                }}
                >
                  🌡️
                </div>

                <p>Feels Like</p>

                <h3>
                  {loading || !weather
                  ? "--"
                  : `${Math.round(weather.main.feels_like)}°C`}
                </h3>

              </div>

              {/* PRESSURE */}

              <div
              style={{

                background:
                "rgba(255,255,255,0.18)",

                backdropFilter:"blur(10px)",

                borderRadius:"18px",

                padding:"18px",

                color:"white",
              }}
              >

                <div
                style={{
                  fontSize:"28px",
                  marginBottom:"8px",
                }}
                >
                  ☁️
                </div>

                <p>Pressure</p>

                <h3>
                  {loading || !weather
                  ? "--"
                  : `${weather.main.pressure} hPa`}
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );
}