import React, { useState } from 'react';

const AnalysisScreen = ({ onSave, onSuccess }) => {
  const [decision, setDecision] = useState('');
  const [scenarios, setScenarios] = useState([
    { id: 1, label: 'Mejor escenario', color: '#10b981', consequences: Array(10).fill('') },
    { id: 2, label: 'Escenario probable', color: '#3b82f6', consequences: Array(10).fill('') },
    { id: 3, label: 'Peor escenario', color: '#ef4444', consequences: Array(10).fill('') },
  ]);
  const [finalDecision, setFinalDecision] = useState('');
  const [finalReasoning, setFinalReasoning] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [saving, setSaving] = useState(false);

  const updateConsequence = (scenarioId, index, value) => {
    setScenarios(prev =>
      prev.map(s =>
        s.id === scenarioId
          ? { ...s, consequences: s.consequences.map((c, i) => (i === index ? value : c)) }
          : s
      )
    );
  };

  const addScenario = () => {
    const colors = ['#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'];
    const newId = Math.max(...scenarios.map(s => s.id)) + 1;
    setScenarios([
      ...scenarios,
      {
        id: newId,
        label: `Escenario ${newId}`,
        color: colors[(newId - 1) % colors.length],
        consequences: Array(10).fill(''),
      },
    ]);
  };

  const removeScenario = (id) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  const updateScenarioLabel = (id, label) => {
    setScenarios(prev =>
      prev.map(s => (s.id === id ? { ...s, label } : s))
    );
  };

  const clearAll = () => {
    setDecision('');
    setScenarios([
      { id: 1, label: 'Mejor escenario', color: '#10b981', consequences: Array(10).fill('') },
      { id: 2, label: 'Escenario probable', color: '#3b82f6', consequences: Array(10).fill('') },
      { id: 3, label: 'Peor escenario', color: '#ef4444', consequences: Array(10).fill('') },
    ]);
    setFinalDecision('');
    setFinalReasoning('');
    setExpectedDate('');
  };

  const handleSave = async () => {
    if (!decision.trim() || !finalDecision.trim()) {
      alert('Por favor completa la decisión principal y la decisión final');
      return;
    }

    setSaving(true);
    
    const success = await onSave({
      problem: decision,
      scenarios: scenarios,
      finalDecision,
      reasoning: finalReasoning,
      expectedDate: expectedDate || null,
    });

    if (success) {
      clearAll();
      onSuccess?.();
    }
    
    setSaving(false);
  };

  return (
    <div>
      {/* Decisión principal */}
      <div className="card card-accent">
        <div className="label">
          <span className="label-icon">❓</span>
          Decisión o Problema
        </div>
        <input
          type="text"
          className="input input-large"
          placeholder="¿Qué decisión necesitas analizar?"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        />
      </div>

      {/* Controles */}
      <div className="flex gap-8 mb-20">
        <button className="btn btn-primary btn-sm" onClick={addScenario}>
          + Escenario
        </button>
        <button className="btn btn-secondary btn-sm" onClick={clearAll}>
          Limpiar
        </button>
      </div>

      {/* Escenarios */}
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="scenario">
          <div className="scenario-header">
            <div 
              className="scenario-indicator" 
              style={{ background: scenario.color }}
            />
            <input
              type="text"
              className="scenario-label"
              value={scenario.label}
              onChange={(e) => updateScenarioLabel(scenario.id, e.target.value)}
              style={{ color: scenario.color }}
            />
            {scenarios.length > 1 && (
              <button 
                className="scenario-remove"
                onClick={() => removeScenario(scenario.id)}
              >
                ×
              </button>
            )}
          </div>
          
          <div className="consequences-label">Consecuencias →</div>
          
          <div className="consequences-scroll">
            {scenario.consequences.map((consequence, index) => (
              <div key={index} className="consequence-card">
                <div className="consequence-number">
                  {index === 0 ? 'Primero...' : `Paso ${index + 1}`}
                </div>
                <textarea
                  className="consequence-input"
                  placeholder={index === 0 ? "¿Qué pasaría?" : "¿Y después?"}
                  value={consequence}
                  onChange={(e) => updateConsequence(scenario.id, index, e.target.value)}
                />
                {index < 9 && <span className="consequence-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Decisión Final */}
      <div className="card card-success card-accent mt-20">
        <div className="label" style={{ color: '#6ee7b7' }}>
          <span className="label-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>✓</span>
          Decisión Final
        </div>

        <div className="mb-16">
          <input
            type="text"
            className="input"
            placeholder="Decidí..."
            value={finalDecision}
            onChange={(e) => setFinalDecision(e.target.value)}
            style={{ borderColor: '#065f46' }}
          />
        </div>

        <div className="mb-16">
          <textarea
            className="input textarea"
            placeholder="¿Por qué elegí esta opción? (opcional)"
            value={finalReasoning}
            onChange={(e) => setFinalReasoning(e.target.value)}
            style={{ borderColor: '#065f46' }}
          />
        </div>

        <div className="mb-20">
          <label style={{ fontSize: '0.85rem', color: '#6ee7b7', display: 'block', marginBottom: '8px' }}>
            ¿Cuándo sabrás el resultado? (opcional)
          </label>
          <input
            type="date"
            className="input"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            style={{ borderColor: '#065f46', maxWidth: '200px' }}
          />
        </div>

        <button 
          className="btn btn-success btn-block"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando...' : '💾 Guardar Decisión'}
        </button>
        
        <p style={{ 
          fontSize: '0.8rem', 
          color: '#6ee7b7', 
          textAlign: 'center', 
          marginTop: '12px',
          opacity: 0.8 
        }}>
          Podrás registrar el resultado cuando lo sepas
        </p>
      </div>
    </div>
  );
};

export default AnalysisScreen;
