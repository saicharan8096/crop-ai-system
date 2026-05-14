import React,{
  useEffect,
  useState
} from "react";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase";

export default function History() {

  const [
    yieldHistory,
    setYieldHistory
  ] = useState([]);

  const [
    diseaseHistory,
    setDiseaseHistory
  ] = useState([]);

  const [
    recommendationHistory,
    setRecommendationHistory
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  useEffect(()=>{

    fetchHistory();

  },[]);

  const fetchHistory =
  async ()=>{

    try{

      const userId =
      auth.currentUser?.uid;

      // YIELD

      const yieldQuery =
      query(
        collection(
          db,
          "yield_predictions"
        ),

        where(
          "userId",
          "==",
          userId
        ),

        orderBy(
          "createdAt",
          "desc"
        )
      );

      const yieldSnapshot =
      await getDocs(yieldQuery);

      setYieldHistory(

        yieldSnapshot.docs.map(
          (doc)=>({
            id:doc.id,
            ...doc.data(),
          })
        )
      );

      // DISEASE

      const diseaseQuery =
      query(
        collection(
          db,
          "disease_detections"
        ),

        where(
          "userId",
          "==",
          userId
        ),

        orderBy(
          "createdAt",
          "desc"
        )
      );

      const diseaseSnapshot =
      await getDocs(diseaseQuery);

      setDiseaseHistory(

        diseaseSnapshot.docs.map(
          (doc)=>({
            id:doc.id,
            ...doc.data(),
          })
        )
      );

      // RECOMMENDATIONS

      const recommendationQuery =
      query(
        collection(
          db,
          "recommendations"
        ),

        where(
          "userId",
          "==",
          userId
        ),

        orderBy(
          "createdAt",
          "desc"
        )
      );

      const recommendationSnapshot =
      await getDocs(
        recommendationQuery
      );

      setRecommendationHistory(

        recommendationSnapshot.docs.map(
          (doc)=>({
            id:doc.id,
            ...doc.data(),
          })
        )
      );

    }catch(err){

      console.log(err);

    }finally{

      setLoading(false);
    }
  };

  const cardStyle = {

    border:"1px solid #e5e7eb",

    padding:20,

    borderRadius:22,

    marginBottom:16,

    background:
    "rgba(255,255,255,0.75)",

    backdropFilter:"blur(16px)",

    boxShadow:
    "0 8px 30px rgba(0,0,0,0.05)",

    transition:"0.3s",
  };

  if(loading){

    return(

      <div
      style={{

        padding:"2rem",

        color:"#111827",

        fontSize:"18px",
      }}
      >
        Loading history...
      </div>

    );
  }

  return(

    <div
    style={{

      padding:
      window.innerWidth < 768
      ? "1rem"
      : "2rem",

      maxWidth:1200,

      margin:"0 auto",
    }}
    >

      {/* HEADER */}

      <h1
      style={{

        marginBottom:32,

        fontSize:
        window.innerWidth < 768
        ? "2rem"
        : "2.7rem",

        fontWeight:800,

        color:"#111827",
      }}
      >
        📜 Farmer History Dashboard
      </h1>

      {/* YIELD */}

      <div style={{marginBottom:50}}>

        <h2
        style={{

          color:"#111827",

          marginBottom:18,

          fontSize:"1.6rem",
        }}
        >
          🌾 Yield Predictions
        </h2>

        {yieldHistory.length === 0 && (

          <p style={{color:"#6b7280"}}>
            No yield prediction history found.
          </p>

        )}

        {yieldHistory.map((item)=>(

          <div
          key={item.id}
          style={cardStyle}
          >

            <p style={{color:"#374151"}}>
              <strong>Crop:</strong>
              {" "}
              {item.crop}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Season:</strong>
              {" "}
              {item.season}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Temperature:</strong>
              {" "}
              {item.temperature}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Rainfall:</strong>
              {" "}
              {item.rainfall}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Predicted Yield:</strong>
              {" "}
              {item.predictedYield}
            </p>

            <p style={{color:"#6b7280"}}>
              <strong>Time:</strong>
              {" "}
              {item.createdAt?.seconds
              ? new Date(
                item.createdAt.seconds * 1000
              ).toLocaleString()
              : "N/A"}
            </p>

          </div>

        ))}

      </div>

      {/* DISEASE */}

      <div style={{marginBottom:50}}>

        <h2
        style={{

          color:"#111827",

          marginBottom:18,

          fontSize:"1.6rem",
        }}
        >
          🦠 Disease Detections
        </h2>

        {diseaseHistory.length === 0 && (

          <p style={{color:"#6b7280"}}>
            No disease history found.
          </p>

        )}

        {diseaseHistory.map((item)=>(

          <div
          key={item.id}
          style={cardStyle}
          >

            <p style={{color:"#374151"}}>
              <strong>Crop:</strong>
              {" "}
              {item.crop}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Disease:</strong>
              {" "}
              {item.disease}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Severity:</strong>
              {" "}
              {item.severity}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Confidence:</strong>
              {" "}
              {(item.confidence * 100).toFixed(1)}%
            </p>

            <p style={{color:"#6b7280"}}>
              <strong>Time:</strong>
              {" "}
              {item.createdAt?.seconds
              ? new Date(
                item.createdAt.seconds * 1000
              ).toLocaleString()
              : "N/A"}
            </p>

          </div>

        ))}

      </div>

      {/* RECOMMENDATIONS */}

      <div>

        <h2
        style={{

          color:"#111827",

          marginBottom:18,

          fontSize:"1.6rem",
        }}
        >
          💡 Recommendations
        </h2>

        {recommendationHistory.length === 0 && (

          <p style={{color:"#6b7280"}}>
            No recommendation history found.
          </p>

        )}

        {recommendationHistory.map((item)=>(

          <div
          key={item.id}
          style={cardStyle}
          >

            <p style={{color:"#374151"}}>
              <strong>Crop:</strong>
              {" "}
              {item.crop}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Severity:</strong>
              {" "}
              {item.severity}
            </p>

            <p style={{color:"#374151"}}>
              <strong>Crop Stage:</strong>
              {" "}
              {item.cropStage}
            </p>

            <p style={{color:"#6b7280"}}>
              <strong>Time:</strong>
              {" "}
              {item.createdAt?.seconds
              ? new Date(
                item.createdAt.seconds * 1000
              ).toLocaleString()
              : "N/A"}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}