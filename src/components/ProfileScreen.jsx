import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDecisions } from '../hooks/useDecisions';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { decisions } = useDecisions(user?.uid);

  const pendingCount = decisions.filter(d => !d.outcome).length;
  const completedCount = decisions.filter(d => d.outcome).length;
  
  // Calcular estadísticas de resultados
  const completedDecisions = decisions.filter(d => d.outcome);
  const avgRating = completedDecisions.length > 0
    ? (completedDecisions.reduce((sum, d) => sum + (d.outcomeRating || 0), 0) / completedDecisions.length).toFixed(1)
    : '-';

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: completedDecisions.filter(d => d.outcomeRating === rating).length
  }));

  const getRatingEmoji = (rating) => {
    const emojis = ['😞', '😕', '😐', '🙂', '😄'];
    return emojis[rating - 1] || '😐';
  };

  const handleLogout = async () => {
    if (confirm('¿Cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <div>
      {/* Info de usuario */}
      <div className="card card-accent">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 16px'
          }}>
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              '👤'
            )}
          </div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
            {user?.displayName || 'Usuario'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {user?.email}
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="card">
        <div className="label">📊 Tus Estadísticas</div>
        
        <div className="stats-grid" style={{ marginBottom: '20px' }}>
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

        {completedCount > 0 && (
          <>
            <div style={{ 
              textAlign: 'center', 
              padding: '16px',
              background: '#0f172a',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                PROMEDIO DE RESULTADOS
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                {avgRating} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 5</span>
              </div>
            </div>

            <div className="label">Distribución de Resultados</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              {ratingDistribution.map(({ rating, count }) => (
                <div 
                  key={rating}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '12px 8px',
                    background: '#0f172a',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                    {getRatingEmoji(rating)}
                  </div>
                  <div style={{ 
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: '700',
                    fontSize: '1.1rem'
                  }}>
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Acciones */}
      <div className="card">
        <div className="label">⚙️ Cuenta</div>
        
        <button 
          className="btn btn-danger btn-block"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Info de la app */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        color: '#475569',
        fontSize: '0.8rem'
      }}>
        <p>Pensamiento Estratégico v1.0</p>
        <p style={{ marginTop: '4px' }}>
          Hecho con 💜 para tomar mejores decisiones
        </p>
      </div>
    </div>
  );
};

export default ProfileScreen;
