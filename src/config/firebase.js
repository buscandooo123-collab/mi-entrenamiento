import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase - Pensamiento Estratégico
const firebaseConfig = {
  apiKey: "AIzaSyD5ipPXMUN3shXChD97UTsacq8axpLAOJY",
  authDomain: "pensamiento-e.firebaseapp.com",
  projectId: "pensamiento-e",
  storageBucket: "pensamiento-e.firebasestorage.app",
  messagingSenderId: "683297780430",
  appId: "1:683297780430:web:a780dde6b04ab2514a969f",
  measurementId: "G-XVYZFS8VJL"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
