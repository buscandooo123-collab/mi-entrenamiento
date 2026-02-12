import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDecisions } from '../hooks/useDecisions';
import AnalysisScreen from './AnalysisScreen';
import HistoryScreen from './HistoryScreen';
import ProfileScreen from './ProfileScreen';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { user } = useAuth();
  const { decisions, loading, addDecision, updateOutcome, deleteDecision } = useDecisions(user?.uid);

  const pendingCount = decisions.filter(d => !d.outcome).length;

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveDecision = async (decisionData) => {
    const result = await addDecision(decisionData);
    if (result) {
      showSuccessToast('✅ Decisión guardada');
      return true;
    }
    return false;
  };

  const handleUpdateOutcome = async (decisionId, outcomeData) => {
    const result = await updateOutcome(decisionId, outcomeData);
    if (result) {
      showSuccessToast('✅ Resultado registrado');
      return true;
    }
    return false;
  };

  const handleDeleteDecision = async (decisionId) => {
    return await deleteDecision(decisionId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <AnalysisScreen 
            onSave={handleSaveDecision}
            onSuccess={() => setActiveTab('history')}
          />
        );
      case 'history':
        return (
          <HistoryScreen 
            decisions={decisions}
            loading={loading}
            onUpdateOutcome={handleUpdateOutcome}
            onDelete={handleDeleteDecision}
          />
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {showToast && (
        <div className="toast">{toastMessage}</div>
      )}

      <header className="header">
        <h1 className="header-title">Pensamiento Estratégico</h1>
        <p className="header-subtitle">Analiza y aprende de tus decisiones</p>
      </header>

      <main className="main-content">
        {renderContent()}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          <span className="nav-item-icon">🎯</span>
          <span className="nav-item-label">Análisis</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={{ position: 'relative' }}
        >
          <span className="nav-item-icon">📚</span>
          <span className="nav-item-label">Historial</span>
          {pendingCount > 0 && (
            <span className="nav-badge">{pendingCount}</span>
          )}
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-item-icon">👤</span>
          <span className="nav-item-label">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default MainApp;
