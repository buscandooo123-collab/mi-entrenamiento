import React, { useState } from 'react';

const HistoryScreen = ({ decisions, loading, onUpdateOutcome, onDelete }) => {
  const [filter, setFilter] = useState('all');
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [outcomeText, setOutcomeText] = useState('');
  const [outcomeRating, setOutcomeRating] = useState(3);
  const [showDetail, setShowDetail] = useState(false);

  const pendingCount = decisions.filter(d => !d.outcome).length;
  const completedCount = decisions.filter(d => d.outcome).length;

  const filteredDecisions = decisions.filter(item => {
    if (filter === 'pending') return !item.outcome;
    if (filter === 'completed') return item.outcome;
    return true;
  });

  const getRatingEmoji = (rating) => {
    const emojis = ['😞', '😕', '😐', '🙂', '😄'];
    return emojis[rating - 1] || '😐';
  };

  const getRatingLabel = (rating) => {
    const labels = ['Muy mal', 'Mal', 'Regular', 'Bien', 'Excelente'];
    return labels[rating - 1] || 'Regular';
  };

  const getRatingColor = (rating) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
    return colors[rating - 1] || '#eab308';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} sem`;
    if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
    return `Hace ${Math.floor(days / 365)} años`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSelectDecision = (decision) => {
    setSelectedDecision(decision);
    setShowDetail(true);
    setOutcomeText('');
    setOutcomeRating(3);
  };

  const handleSaveOutcome = async () => {
    if (!outcomeText.trim() || !selectedDecision) return;
    
    const success = await onUpdateOutcome(selectedDecision.id, {
      outcome: outcomeText,
      outcomeRating
    });
    
    if (success) {
      setShowDetail(false);
      setSelectedDecision(null);
      setOutcomeText('');
      setOutcomeRating(3);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta decisión?')) {
      await onDelete(id);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Vista de detalle
  if (showDetail && selectedDecision) {
    return (
      <div>
        <button 
          className="btn btn-secondary btn-sm mb-20"
          onClick={() => setShowDetail(false)}
        >
          ← Volver
        </button>

        <div className="card card-accent">
          <div className="label">Problema/Decisión</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            {selectedDecision.problem}
          </p>

          <div className="label">Decisión Tomada</div>
          <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '20px' }}>
            → {selectedDecision.finalDecision}
          </p>

          {selectedDecision.reasoning && (
            <>
              <div className="label">Razonamiento</div>
              <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                {selectedDecision.reasoning}
              </p>
            </>
          )}

          <div className="label">Escenarios Analizados</div>
          {selectedDecision.scenarios?.map((scenario) => (
            <div 
              key={scenario.id} 
              style={{ 
                background: '#0f172a', 
                borderRadius: '10px', 
                padding: '12px',
                marginBottom: '10px'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: scenario.color
                }} />
                <span style={{ color: scenario.color, fontWeight: '600', fontSize: '0.9rem' }}>
                  {scenario.label}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                {scenario.consequences.filter(c => c.trim()).join(' → ') || 'Sin consecuencias'}
              </p>
            </div>
          ))}
        </div>

        {/* Resultado */}
        {selectedDecision.outcome ? (
          <div className="card mt-20" style={{ 
            background: 'linear-gradient(145deg, #1e3a2f, #0f2922)',
            borderColor: '#10b981'
          }}>
            <div className="label" style={{ color: '#6ee7b7' }}>Resultado Real</div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>
                {getRatingEmoji(selectedDecision.outcomeRating)}
              </span>
              <span style={{ 
                color: getRatingColor(selectedDecision.outcomeRating),
                fontWeight: '600'
              }}>
                {getRatingLabel(selectedDecision.outcomeRating)}
              </span>
            </div>
            <p style={{ lineHeight: '1.6' }}>{selectedDecision.outcome}</p>
          </div>
        ) : (
          <div className="card card-success card-accent mt-20">
            <div className="label" style={{ color: '#6ee7b7' }}>
              📝 Registrar Resultado
            </div>

            <p style={{ 
              fontSize: '0.9rem', 
              color: '#94a3b8', 
              marginBottom: '16px' 
            }}>
              ¿Cómo salió esta decisión?
            </p>

            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className={`rating-btn ${outcomeRating === rating ? 'selected' : ''}`}
                  onClick={() => setOutcomeRating(rating)}
                >
                  {getRatingEmoji(rating)}
                </button>
              ))}
            </div>

            <p style={{ 
              textAlign: 'center', 
              fontSize: '0.9rem',
              color: getRatingColor(outcomeRating),
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {getRatingLabel(outcomeRating)}
            </p>

            <textarea
              className="input textarea mb-16"
              placeholder="Describe qué sucedió..."
              value={outcomeText}
              onChange={(e) => setOutcomeText(e.target.value)}
              style={{ borderColor: '#065f46' }}
            />

            <button 
              className="btn btn-success btn-block"
              onClick={handleSaveOutcome}
              disabled={!outcomeText.trim()}
            >
              ✓ Guardar Resultado
            </button>
          </div>
        )}
      </div>
    );
  }

  // Lista principal
  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{decisions.length}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#fbbf24' }}>{pendingCount}</div>
          <div className="stat-label">Pendientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#10b981' }}>{completedCount}</div>
          <div className="stat-label">Completadas</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⏳ Pendientes
        </button>
        <button 
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          ✅ Completadas
        </button>
      </div>

      {/* Lista */}
      {filteredDecisions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {filter === 'pending' ? '✨' : filter === 'completed' ? '📝' : '📭'}
          </div>
          <div className="empty-state-text">
            {filter === 'pending' 
              ? '¡No hay decisiones pendientes!'
              : filter === 'completed'
              ? 'Aún no has completado ninguna decisión'
              : 'No hay decisiones guardadas'}
          </div>
          <div className="empty-state-subtext">
            {filter === 'all' && 'Crea tu primer análisis en la pestaña Análisis'}
          </div>
        </div>
      ) : (
        filteredDecisions.map((item) => (
          <div 
            key={item.id}
            className={`history-card ${item.outcome ? 'completed' : 'pending'}`}
            onClick={() => handleSelectDecision(item)}
          >
            <div className="history-header">
              <div>
                <span className="history-date">{formatDate(item.createdAt)}</span>
                {!item.outcome && (
                  <span className="time-ago">{getTimeAgo(item.createdAt)}</span>
                )}
              </div>
              <button 
                onClick={(e) => handleDelete(item.id, e)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                🗑️
              </button>
            </div>

            <div className="history-problem">{item.problem}</div>
            
            <div className="history-decision">
              <span>→</span>
              {item.finalDecision}
            </div>

            {item.expectedDate && !item.outcome && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(96, 165, 250, 0.15)',
                color: '#60a5fa',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                marginTop: '10px'
              }}>
                📅 {formatDate(item.expectedDate)}
              </div>
            )}

            {item.outcome ? (
              <div 
                className="outcome-badge"
                style={{ 
                  background: `${getRatingColor(item.outcomeRating)}20`,
                  color: getRatingColor(item.outcomeRating)
                }}
              >
                {getRatingEmoji(item.outcomeRating)} {getRatingLabel(item.outcomeRating)}
              </div>
            ) : (
              <div className="outcome-badge outcome-pending">
                ⏳ Esperando resultado
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryScreen;
