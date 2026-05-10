import i18n from "i18next";

import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
   en: {
  translation: {
    title: "Leaf Disease Detection",
    upload: "Upload a photo of a crop leaf.",
    analyse: "Analyse Leaf",

    dashboard: "Dashboard",
    diseaseDetection: "Disease Detection",
    yieldPrediction: "Yield Prediction",
    recommendations: "Recommendations",

    predictionHistory: "Prediction History",

    confidence: "Confidence",
    pesticide: "Pesticide",
    dosage: "Dosage",
    advice: "Advice",

    crop: "Crop",
    disease: "Disease",

    clearHistory: "Clear History",
    dashboardTitle: "Dashboard",

yieldTitle: "Yield Prediction",
predictYield: "Predict Yield",

recommendationsTitle: "Recommendations",
getRecommendations: "Get Recommendations",

cropSituation: "Crop Situation",
crop: "Crop",
diseaseDetected: "Disease detected",
severity: "Severity",
cropStage: "Crop Stage",

currentWeather: "Current Weather",
temperature: "Temperature (°C)",
humidity: "Humidity (%)",
rainfall: "Rainfall last 7 days (mm)",

predictionHistory: "Prediction History",

confidence: "Confidence",
pesticide: "Pesticide",
dosage: "Dosage",
advice: "Advice",

clearHistory: "Clear History",

diagnosis: "Diagnosis",

loading: "Loading...",
yieldDescription: "Enter your field's soil and weather data to get an AI-powered yield forecast with a risk assessment and explainability chart.",
predicting: "Predicting...",
predictedYield: "Predicted Yield",
risk: "Risk",
tip: "Tip",
shapImportance: "SHAP Feature Importance",
shapDescription: "Green bars increased the prediction. Red bars decreased it. This tells you which factors matter most for your yield.",
  },
},

  hi: {
  translation: {
    title: "पत्ती रोग पहचान",
    upload: "फसल की पत्ती की फोटो अपलोड करें।",
    analyse: "पत्ती का विश्लेषण करें",

    dashboard: "डैशबोर्ड",
    diseaseDetection: "रोग पहचान",
    yieldPrediction: "उपज पूर्वानुमान",
    recommendations: "सिफारिशें",

    predictionHistory: "पूर्वानुमान इतिहास",

    confidence: "विश्वास स्तर",
    pesticide: "कीटनाशक",
    dosage: "मात्रा",
    advice: "सलाह",

    crop: "फसल",
    disease: "रोग",

    clearHistory: "इतिहास हटाएं",
    dashboardTitle: "डैशबोर्ड",

yieldTitle: "उपज पूर्वानुमान",
predictYield: "उपज का अनुमान लगाएं",

recommendationsTitle: "सिफारिशें",
getRecommendations: "सिफारिश प्राप्त करें",

cropSituation: "फसल स्थिति",
crop: "फसल",
diseaseDetected: "पता चला रोग",
severity: "गंभीरता",
cropStage: "फसल चरण",

currentWeather: "वर्तमान मौसम",
temperature: "तापमान (°C)",
humidity: "नमी (%)",
rainfall: "पिछले 7 दिनों की वर्षा (mm)",

predictionHistory: "पूर्वानुमान इतिहास",

confidence: "विश्वास स्तर",
pesticide: "कीटनाशक",
dosage: "मात्रा",
advice: "सलाह",

clearHistory: "इतिहास हटाएं",

diagnosis: "निदान",

loading: "लोड हो रहा है...",
yieldDescription: "मिट्टी और मौसम डेटा दर्ज करें और AI आधारित उपज अनुमान प्राप्त करें।",
predicting: "अनुमान लगाया जा रहा है...",
predictedYield: "अनुमानित उपज",
risk: "जोखिम",
tip: "सुझाव",
shapImportance: "SHAP फीचर महत्व",
shapDescription: "हरे बार उपज बढ़ाते हैं, लाल बार घटाते हैं।",
  },
},

   te: {
  translation: {
    title: "ఆకు వ్యాధి గుర్తింపు",
    upload: "పంట ఆకు ఫోటోను అప్‌లోడ్ చేయండి.",
    analyse: "ఆకును విశ్లేషించండి",

    dashboard: "డాష్‌బోర్డ్",
    diseaseDetection: "వ్యాధి గుర్తింపు",
    yieldPrediction: "పంట దిగుబడి అంచనా",
    recommendations: "సిఫార్సులు",

    predictionHistory: "అంచనా చరిత్ర",

    confidence: "నమ్మకం స్థాయి",
    pesticide: "పురుగుమందు",
    dosage: "మోతాదు",
    advice: "సలహా",

    crop: "పంట",
    disease: "వ్యాధి",

    clearHistory: "చరిత్ర తొలగించు",
    dashboardTitle: "డాష్‌బోర్డ్",

yieldTitle: "పంట దిగుబడి అంచనా",
predictYield: "దిగుబడి అంచనా వేయండి",

recommendationsTitle: "సిఫార్సులు",
getRecommendations: "సిఫార్సులు పొందండి",

cropSituation: "పంట పరిస్థితి",
crop: "పంట",
diseaseDetected: "గుర్తించిన వ్యాధి",
severity: "తీవ్రత",
cropStage: "పంట దశ",

currentWeather: "ప్రస్తుత వాతావరణం",
temperature: "ఉష్ణోగ్రత (°C)",
humidity: "ఆర్ద్రత (%)",
rainfall: "గత 7 రోజుల వర్షపాతం (mm)",

predictionHistory: "అంచనా చరిత్ర",

confidence: "నమ్మకం స్థాయి",
pesticide: "పురుగుమందు",
dosage: "మోతాదు",
advice: "సలహా",

clearHistory: "చరిత్ర తొలగించు",

diagnosis: "వ్యాధి నిర్ధారణ",

loading: "లోడ్ అవుతోంది...",
yieldDescription: "మీ నేల మరియు వాతావరణ డేటా ఆధారంగా AI దిగుబడి అంచనా పొందండి.",
predicting: "అంచనా వేస్తోంది...",
predictedYield: "అంచనా దిగుబడి",
risk: "ప్రమాదం",
tip: "సూచన",
shapImportance: "SHAP ఫీచర్ ప్రాముఖ్యత",
shapDescription: "ఆకుపచ్చ బార్లు దిగుబడిని పెంచుతాయి, ఎరుపు బార్లు తగ్గిస్తాయి.",
  },
},
  },

  lng: "en",

  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;