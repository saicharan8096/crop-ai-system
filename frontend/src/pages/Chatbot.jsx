import React, { useState } from "react";
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});
export default function Chatbot() {

  const [
    input,
    setInput
  ] = useState("");

  const [
    messages,
    setMessages
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(false);

  const speak = (text) => {

    const speech =
      new SpeechSynthesisUtterance(
        text
      );

   if (
  text.match(/[ఀ-౿]/)
) {

  speech.lang =
    "te-IN";

} else if (
  text.match(/[ऀ-ॿ]/)
) {

  speech.lang =
    "hi-IN";

} else {

  speech.lang =
    "en-US";
}

    window.speechSynthesis.speak(
      speech
    );
  };
 const startListening = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert(
      "Voice recognition not supported"
    );

    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang =
    "en-IN";

  recognition.continuous =
    false;

  recognition.interimResults =
    false;

  recognition.maxAlternatives =
    1;

  console.log(
    "Starting microphone..."
  );

  recognition.start();

  recognition.onstart = () => {

    console.log(
      "Voice recognition started"
    );
  };

  recognition.onresult = (
    event
  ) => {

    const transcript =
      event.results[0][0]
        .transcript;

    console.log(
      "Voice Input:",
      transcript
    );

    setInput(
      transcript
    );
  };

  recognition.onerror = (
    event
  ) => {

    console.log(
      "Voice Error:",
      event.error
    );

    if (
      event.error ===
      "not-allowed"
    ) {

      alert(
        "Please allow microphone permission"
      );
    }
  };

  recognition.onend = () => {

    console.log(
      "Voice recognition ended"
    );
  };
};
const sendMessage = async () => {

  if (!input) return;

  const userMessage = {
    role: "user",
    text: input,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  setLoading(true);

  try {

  console.log("Starting OpenRouter request");

    const completion =
  await openai.chat.completions.create({
  model:
  "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an AI farming assistant. Give simple agriculture advice for farmers in the same language as the user.",
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

const text =
  completion?.choices?.[0]
    ?.message?.content
  || "No response from AI";
    const aiMessage = {
      role: "ai",
      text,
    };

    setMessages((prev) => [
      ...prev,
      aiMessage,
    ]);

    speak(text);

  } catch (err) {

    console.log(
      "FULL GEMINI ERROR:",
      err
    );

    const aiMessage = {
      role: "ai",
      text:
        "AI assistant error",
    };

    setMessages((prev) => [
      ...prev,
      aiMessage,
    ]);

  } finally {

    setLoading(false);
    setInput("");
  }
};

  return (

    <div
style={{
padding:"2rem",

minHeight:"100vh",

background:
"linear-gradient(135deg,#071b11,#0f3d2e,#14532d)",

color:"white",
}}
>

      <h1
style={{
fontSize:"3rem",
fontWeight:"700",
marginBottom:"2rem",

background:
"linear-gradient(135deg,#bbf7d0,#22c55e)",

WebkitBackgroundClip:"text",

WebkitTextFillColor:
"transparent",
}}
>

🌾

AI Farmer Assistant

</h1>

     <div
style={{

background:
"rgba(255,255,255,0.08)",

backdropFilter:
"blur(20px)",

border:
"1px solid rgba(255,255,255,0.1)",

borderRadius:20,

padding:20,

height:"65vh",

overflowY:"auto",

boxShadow:
"0 0 40px rgba(0,0,0,0.3)",

marginBottom:20,
}}
>

        {messages.map(
          (msg, index) => (

      <div
  key={index}
  style={{
    textAlign:
      msg.role === "user"
        ? "right"
        : "left",

    marginBottom: 16,
  }}
>


             <div
style={{

display:"inline-block",

padding:"14px 18px",

borderRadius:18,

background:
msg.role === "user"

? "linear-gradient(135deg,#2563eb,#1d4ed8)"

: "linear-gradient(135deg,#22c55e,#15803d)",

color:"white",

maxWidth:"80%",

boxShadow:
"0 8px 25px rgba(0,0,0,0.25)",

fontSize:"15px",

lineHeight:"1.6",

backdropFilter:
"blur(10px)",
}}
>

                {msg.text}

              </div>

            </div>
          )
        )}

      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >

        <input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="Ask farming question..."
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            border:
              "1px solid #ddd",
          }}
        />
        <button
  onClick={startListening}
  style={{
    padding:
      "14px 20px",
    background:
      "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  }}
>

  🎤 Speak

</button>

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding:
              "14px 20px",
            background:
              "#16a34a",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >

          {loading
            ? "..."
            : "Send"}

        </button>

      </div>

    </div>
  );
}
