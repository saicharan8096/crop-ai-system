import React, {
  useEffect,
  useState
} from "react";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase";

export default function Profile() {

  const [form,setForm] =
  useState({

    name:"",
    phone:"",
    state:"",
    district:"",
    preferredCrop:"",
    farmSize:"",
  });

  const [loading,setLoading] =
  useState(false);

  /* LOAD PROFILE */

  useEffect(()=>{

    const loadProfile =
    async ()=>{

      try{

        const uid =
        auth.currentUser?.uid;

        if(!uid) return;

        const ref =
        doc(
          db,
          "farmers",
          uid
        );

        const snap =
        await getDoc(ref);

        if(snap.exists()){

          setForm(
            snap.data()
          );
        }

      }catch(error){

        console.log(error);
      }
    };

    loadProfile();

  },[]);

  /* UPDATE */

  const update =
  (field)=>(e)=>{

    setForm((prev)=>({

      ...prev,

      [field]:
      e.target.value
    }));
  };

  /* SAVE */

  const saveProfile =
  async ()=>{

    try{

      setLoading(true);

      const uid =
      auth.currentUser?.uid;

      if(!uid) return;

      await setDoc(

        doc(
          db,
          "farmers",
          uid
        ),

        {

          uid,

          ...form
        }
      );

      alert(
        "Profile updated successfully"
      );

    }catch(error){

      console.log(error);

      alert(
        "Failed to save profile"
      );

    }finally{

      setLoading(false);
    }
  };

  const inputStyle = {

    width:"100%",

    padding:"14px",

    borderRadius:"12px",

    border:"1px solid #d1d5db",

    marginBottom:"18px",

    fontSize:"15px",
  };

  return (

    <div
    style={{

      maxWidth:"800px",

      margin:"0 auto",

      padding:"30px",
    }}
    >

      <h1
      style={{

        fontSize:"42px",

        marginBottom:"10px",

        color:"#111827",
      }}
      >
        👨‍🌾 Farmer Profile
      </h1>

      <p
      style={{

        color:"#6b7280",

        marginBottom:"30px",
      }}
      >
        Manage your farming information.
      </p>

      <div
      style={{

        background:"white",

        padding:"30px",

        borderRadius:"24px",

        boxShadow:
        "0 10px 30px rgba(0,0,0,0.06)",
      }}
      >

        <input
        style={inputStyle}
        placeholder="Farmer Name"
        value={form.name}
        onChange={update("name")}
        />

        <input
        style={inputStyle}
        placeholder="Phone Number"
        value={form.phone}
        onChange={update("phone")}
        />

        <input
        style={inputStyle}
        placeholder="State"
        value={form.state}
        onChange={update("state")}
        />

        <input
        style={inputStyle}
        placeholder="District"
        value={form.district}
        onChange={update("district")}
        />

        <input
        style={inputStyle}
        placeholder="Preferred Crop"
        value={form.preferredCrop}
        onChange={update("preferredCrop")}
        />

        <input
        style={inputStyle}
        placeholder="Farm Size"
        value={form.farmSize}
        onChange={update("farmSize")}
        />

        <button

        onClick={saveProfile}

        disabled={loading}

        style={{

          width:"100%",

          padding:"16px",

          border:"none",

          borderRadius:"14px",

          background:
          "linear-gradient(135deg,#2563eb,#1d4ed8)",

          color:"white",

          fontWeight:"700",

          cursor:"pointer",

          fontSize:"16px",
        }}
        >
          {loading
          ? "Saving..."
          : "Save Profile"}
        </button>

      </div>

    </div>
  );
}