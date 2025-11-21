// src/app/firebase.js
// Inicialización de Firebase

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApW65HOsuTCv_RRSB7gCzSdzcKby_xfss",
  authDomain: "app-web-6e519.firebaseapp.com",
  databaseURL: "https://app-web-6e519-default-rtdb.firebaseio.com",
  projectId: "app-web-6e519",
  storageBucket: "app-web-6e519.firebasestorage.app",
  messagingSenderId: "365684222353",
  appId: "1:365684222353:web:d0d1037ab8be5e17861230",
  measurementId: "G-ZXVZXQ9R96"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const database = getDatabase(app);
const auth = getAuth(app);

console.log('🔥 Firebase inicializado correctamente');

// Exportar para usar en otros archivos
export { app, database, auth };