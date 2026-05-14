import i18n from "i18next";

import {
  initReactI18next
} from "react-i18next";

const resources = {

  en: {

    translation: {

      title:
      "Leaf Disease Detection",

      dashboard:
      "Dashboard",

      dashboardTitle:
      "Dashboard",

      diseaseDetection:
      "Disease Detection",

      yieldPrediction:
      "Yield Prediction",

      recommendations:
      "Recommendations",

      upload:
      "Upload a photo of a crop leaf.",

      uploadDescription:
      "Upload a crop leaf image. The AI will identify the disease, estimate severity, and show affected areas.",

      dragDrop:
      "Drag and drop a leaf image here, or click to browse",

      supports:
      "Supports JPEG and PNG",

      analyse:
      "Analyse Leaf",

      analysing:
      "Analysing leaf...",

      diagnosis:
      "Diagnosis",

      crop:
      "Crop",

      disease:
      "Disease",

      diseaseDetected:
      "Disease Detected",

      confidence:
      "Confidence",

      severity:
      "Severity",

      pesticide:
      "Pesticide",

      dosage:
      "Dosage",

      advice:
      "Advice",

      topPredictions:
      "Top 3 Predictions",

      heatmap:
      "Grad-CAM Heatmap",

      predictionHistory:
      "Prediction History",

      clearHistory:
      "Clear History",

      downloadReport:
      "Download Report",

      voiceInput:
      "Voice Input",

      listening:
      "Listening...",

      yieldTitle:
      "Yield Prediction",

      yieldDescription:
      "Enter soil and weather data to get AI-powered yield forecasting.",

      predictYield:
      "Predict Yield",

      predicting:
      "Predicting...",

      predictedYield:
      "Predicted Yield",

      risk:
      "Risk",

      tip:
      "Tip",

      shapImportance:
      "SHAP Feature Importance",

      shapDescription:
      "Green bars increase prediction. Red bars reduce it.",

      recommendationsTitle:
      "Recommendations",

      getRecommendations:
      "Get Recommendations",

      cropSituation:
      "Crop Situation",

      cropStage:
      "Crop Stage",

      currentWeather:
      "Current Weather",

      temperature:
      "Temperature (°C)",

      humidity:
      "Humidity (%)",

      rainfall:
      "Rainfall last 7 days (mm)",

      loading:
      "Loading...",

      time:
      "Time",
    },
  },

  hi: {

    translation: {

      title:
      "पत्ती रोग पहचान",

      dashboard:
      "डैशबोर्ड",

      dashboardTitle:
      "डैशबोर्ड",

      diseaseDetection:
      "रोग पहचान",

      yieldPrediction:
      "उपज पूर्वानुमान",

      recommendations:
      "सिफारिशें",

      upload:
      "फसल की पत्ती की फोटो अपलोड करें।",

      uploadDescription:
      "फसल की पत्ती अपलोड करें। AI रोग पहचान करेगा।",

      dragDrop:
      "यहाँ छवि डालें या क्लिक करें",

      supports:
      "JPEG और PNG समर्थित",

      analyse:
      "पत्ती का विश्लेषण करें",

      analysing:
      "विश्लेषण हो रहा है...",

      diagnosis:
      "निदान",

      crop:
      "फसल",

      disease:
      "रोग",

      diseaseDetected:
      "पता चला रोग",

      confidence:
      "विश्वास स्तर",

      severity:
      "गंभीरता",

      pesticide:
      "कीटनाशक",

      dosage:
      "मात्रा",

      advice:
      "सलाह",

      topPredictions:
      "शीर्ष 3 भविष्यवाणियां",

      heatmap:
      "हीटमैप",

      predictionHistory:
      "पूर्वानुमान इतिहास",

      clearHistory:
      "इतिहास हटाएं",

      downloadReport:
      "रिपोर्ट डाउनलोड करें",

      voiceInput:
      "वॉयस इनपुट",

      listening:
      "सुन रहा है...",

      yieldTitle:
      "उपज पूर्वानुमान",

      yieldDescription:
      "AI आधारित उपज अनुमान प्राप्त करें।",

      predictYield:
      "उपज का अनुमान लगाएं",

      predicting:
      "अनुमान लगाया जा रहा है...",

      predictedYield:
      "अनुमानित उपज",

      risk:
      "जोखिम",

      tip:
      "सुझाव",

      shapImportance:
      "SHAP महत्व",

      shapDescription:
      "हरे बार बढ़ाते हैं, लाल घटाते हैं।",

      recommendationsTitle:
      "सिफारिशें",

      getRecommendations:
      "सिफारिश प्राप्त करें",

      cropSituation:
      "फसल स्थिति",

      cropStage:
      "फसल चरण",

      currentWeather:
      "वर्तमान मौसम",

      temperature:
      "तापमान",

      humidity:
      "नमी",

      rainfall:
      "वर्षा",

      loading:
      "लोड हो रहा है...",

      time:
      "समय",
    },
  },

  te: {

    translation: {

      title:
      "ఆకు వ్యాధి గుర్తింపు",

      dashboard:
      "డాష్‌బోర్డ్",

      dashboardTitle:
      "డాష్‌బోర్డ్",

      diseaseDetection:
      "వ్యాధి గుర్తింపు",

      yieldPrediction:
      "పంట దిగుబడి అంచనా",

      recommendations:
      "సిఫార్సులు",

      upload:
      "పంట ఆకు ఫోటోను అప్‌లోడ్ చేయండి.",

      uploadDescription:
      "ఆకును అప్‌లోడ్ చేయండి. AI వ్యాధిని గుర్తిస్తుంది.",

      dragDrop:
      "చిత్రాన్ని ఇక్కడ వదలండి లేదా ఎంచుకోండి",

      supports:
      "JPEG మరియు PNG మద్దతు ఉంది",

      analyse:
      "ఆకును విశ్లేషించండి",

      analysing:
      "విశ్లేషిస్తోంది...",

      diagnosis:
      "నిర్ధారణ",

      crop:
      "పంట",

      disease:
      "వ్యాధి",

      diseaseDetected:
      "గుర్తించిన వ్యాధి",

      confidence:
      "నమ్మకం",

      severity:
      "తీవ్రత",

      pesticide:
      "పురుగుమందు",

      dosage:
      "మోతాదు",

      advice:
      "సలహా",

      topPredictions:
      "టాప్ 3 అంచనాలు",

      heatmap:
      "హీట్‌మ్యాప్",

      predictionHistory:
      "చరిత్ర",

      clearHistory:
      "చరిత్ర తొలగించు",

      downloadReport:
      "రిపోర్ట్ డౌన్‌లోడ్",

      voiceInput:
      "వాయిస్ ఇన్‌పుట్",

      listening:
      "వింటోంది...",

      yieldTitle:
      "పంట దిగుబడి అంచనా",

      yieldDescription:
      "AI ఆధారిత దిగుబడి అంచనా పొందండి.",

      predictYield:
      "దిగుబడి అంచనా వేయండి",

      predicting:
      "అంచనా వేస్తోంది...",

      predictedYield:
      "అంచనా దిగుబడి",

      risk:
      "ప్రమాదం",

      tip:
      "సూచన",

      shapImportance:
      "SHAP ప్రాముఖ్యత",

      shapDescription:
      "ఆకుపచ్చ బార్లు పెంచుతాయి, ఎరుపు తగ్గిస్తాయి.",

      recommendationsTitle:
      "సిఫార్సులు",

      getRecommendations:
      "సిఫార్సులు పొందండి",

      cropSituation:
      "పంట పరిస్థితి",

      cropStage:
      "పంట దశ",

      currentWeather:
      "ప్రస్తుత వాతావరణం",

      temperature:
      "ఉష్ణోగ్రత",

      humidity:
      "ఆర్ద్రత",

      rainfall:
      "వర్షపాతం",

      loading:
      "లోడ్ అవుతోంది...",

      time:
      "సమయం",
    },
  },
};

i18n

.use(initReactI18next)

.init({

  resources,

  lng: "en",

  fallbackLng: "en",

  interpolation: {

    escapeValue: false,
  },
});

export default i18n;