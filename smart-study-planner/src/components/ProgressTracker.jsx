import React from 'react';

const ProgressTracker = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Your Study Progress</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
          {percentage}%
        </div>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '8px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '4px',
        marginTop: '1rem',
        overflow: 'hidden'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${percentage}%`, 
          background: 'linear-gradient(90deg, var(--accent-primary), #a78bfa)',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>
    </div>
  );
};

export default ProgressTracker;
