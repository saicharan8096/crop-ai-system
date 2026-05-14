import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBG8y9CfNY6vty1R6EPBYh1qoIvE-jiv7Q",
  authDomain: "cropai-878e1.firebaseapp.com",
  projectId: "cropai-878e1",
  storageBucket: "cropai-878e1.firebasestorage.app",
  messagingSenderId: "1059523952908",
  appId: "1:1059523952908:web:e33f45d1b1c9968e73c929",
  measurementId: "G-53SF58S0BL"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);