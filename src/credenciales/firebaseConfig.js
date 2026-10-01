import { initializeApp } from "firebase/app";
// importamos unicamente firestore (ya no usamos storage por el cobro)
import { getFirestore } from "firebase/firestore";

// =========================================================
// reto 1: credenciales de firebase
// =========================================================
const firebaseConfig = {
  apiKey: "AIzaSyCP0x9YFIvdEcoMxg7ExobV8zhAh_vB2MM",
  authDomain: "practica13-perfil-3ae8d.firebaseapp.com",
  projectId: "practica13-perfil-3ae8d",
  storageBucket: "practica13-perfil-3ae8d.firebasestorage.app",
  messagingSenderId: "1063187964142",
  appId: "1:1063187964142:web:d3eb4989b7d74751ce53ff",
};
// =========================================================

const app = initializeApp(firebaseConfig);

// inicializamos y exportamos firestore
export const db = getFirestore(app);
