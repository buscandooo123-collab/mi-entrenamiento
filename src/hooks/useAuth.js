import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Registro con email y contraseña
  const register = async (email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(getErrorMessage(err.code));
      return null;
    }
  };

  // Login con email y contraseña
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(getErrorMessage(err.code));
      return null;
    }
  };

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      setError(getErrorMessage(err.code));
      return null;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    clearError: () => setError(null)
  };
};

// Mensajes de error en español
const getErrorMessage = (code) => {
  const messages = {
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
  };
  return messages[code] || 'Ocurrió un error. Intenta de nuevo';
};
