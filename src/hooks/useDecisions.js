import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useDecisions = (userId) => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    if (!userId) {
      setDecisions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', userId, 'decisions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const decisionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setDecisions(decisionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching decisions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Agregar nueva decisión
  const addDecision = async (decisionData) => {
    if (!userId) return null;
    
    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'decisions'), {
        ...decisionData,
        createdAt: serverTimestamp(),
        outcome: null,
        outcomeDate: null,
        outcomeRating: null
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding decision:', err);
      setError(err.message);
      return null;
    }
  };

  // Actualizar resultado de una decisión
  const updateOutcome = async (decisionId, outcomeData) => {
    if (!userId) return false;
    
    try {
      const decisionRef = doc(db, 'users', userId, 'decisions', decisionId);
      await updateDoc(decisionRef, {
        outcome: outcomeData.outcome,
        outcomeRating: outcomeData.outcomeRating,
        outcomeDate: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error('Error updating outcome:', err);
      setError(err.message);
      return false;
    }
  };

  // Eliminar decisión
  const deleteDecision = async (decisionId) => {
    if (!userId) return false;
    
    try {
      await deleteDoc(doc(db, 'users', userId, 'decisions', decisionId));
      return true;
    } catch (err) {
      console.error('Error deleting decision:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    decisions,
    loading,
    error,
    addDecision,
    updateOutcome,
    deleteDecision
  };
};
