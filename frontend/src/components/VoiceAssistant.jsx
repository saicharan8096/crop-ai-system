import React, {
  useState,
  useRef
} from "react";

export default function VoiceAssistant({

  i18n,

  onCommand,
}) {

  const [listening, setListening] =
  useState(false);

  const recognitionRef =
  useRef(null);

  /* =========================================
     SPEAK FUNCTION
  ========================================= */

  const speak = (text) => {

    window.speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(text);

    speech.lang =

      i18n.language === "te"

      ? "te-IN"

      : i18n.language === "hi"

      ? "hi-IN"

      : "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    window.speechSynthesis.speak(
      speech
    );
  };

  /* =========================================
     STOP LISTENING
  ========================================= */

  const stopListening = () => {

    setListening(false);

    if(recognitionRef.current){

      recognitionRef.current.stop();
    }
  };

  /* =========================================
     START LISTENING
  ========================================= */

  const startListening = () => {

    const SpeechRecognition =

      window.SpeechRecognition ||

      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice recognition not supported in this browser"
      );

      return;
    }

    const recognition =
    new SpeechRecognition();

    recognitionRef.current =
    recognition;

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.lang =

      i18n.language === "te"

      ? "te-IN"

      : i18n.language === "hi"

      ? "hi-IN"

      : "en-US";

    console.log(
      "VOICE LANGUAGE:",
      recognition.lang
    );

    recognition.start();

    setListening(true);

    /* =========================================
       START
    ========================================= */

    recognition.onstart = () => {

      console.log(
        "🎤 Listening started"
      );
    };

    /* =========================================
       RESULT
    ========================================= */

    recognition.onresult = (event) => {

      const command =

        event.results[0][0]
        .transcript
        .toLowerCase()
        .trim();

      console.log(
        "VOICE COMMAND:",
        command
      );

      if(onCommand){

        onCommand(
          command,
          speak
        );
      }
    };

    /* =========================================
       ERROR
    ========================================= */

    recognition.onerror = (event) => {

      console.log(
        "VOICE ERROR:",
        event.error
      );

      setListening(false);

      if(event.error === "not-allowed"){

        alert(
          "Microphone permission denied"
        );
      }
    };

    /* =========================================
       END
    ========================================= */

    recognition.onend = () => {

      console.log(
        "🎤 Listening ended"
      );

      setListening(false);
    };
  };

  /* =========================================
     BUTTON
  ========================================= */

  return (

    <button

    onClick={() => {

      if(listening){

        stopListening();

      }else{

        startListening();
      }
    }}

    style={{

      width: "100%",

      padding: "14px",

      marginBottom: "20px",

      background:

      listening

      ? "linear-gradient(135deg,#ef4444,#dc2626)"

      : "linear-gradient(135deg,#2563eb,#1d4ed8)",

      color: "white",

      border: "none",

      borderRadius: 14,

      fontWeight: 700,

      fontSize:"15px",

      cursor: "pointer",

      transition:"0.3s ease",
    }}
    >

      {listening

      ? "🛑 Stop Listening"

      : "🎤 AI Voice Assistant"}

    </button>
  );
}