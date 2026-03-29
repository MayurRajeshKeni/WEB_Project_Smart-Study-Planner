import React, { useState } from 'react';

const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>Your Tasks</h2>
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="🔍 Search tasks by topic or subject..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <h3>No tasks yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Add some tasks to start building your study plan.</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          No tasks found matching "{searchTerm}"
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map(task => {
            const isPastDue = new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
            const remainingHours = task.duration - (task.completedHours || 0);
            const progressPct = task.completed ? 100 : Math.round(((task.completedHours || 0) / task.duration) * 100);
            
            return (
              <div 
                key={task.id} 
                className="task-item" 
                style={{ 
                  opacity: task.completed ? 0.6 : 1,
                  borderLeft: task.completed ? '4px solid var(--success)' : (isPastDue ? '4px solid var(--danger)' : '4px solid var(--accent-primary)')
                }}
              >
                <div className="task-item__header" style={{ marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => onToggleComplete(task.id)}
                      className="btn"
                      style={{
                        padding: '0.4rem',
                        background: task.completed ? 'var(--success)' : 'var(--bg-glass)',
                        color: task.completed ? 'white' : 'inherit',
                        border: '1px solid ' + (task.completed ? 'var(--success)' : 'var(--border-color)'),
                        borderRadius: '0.4rem',
                        fontSize: '0.8rem'
                      }}
                      title={task.completed ? "Reopen Task" : "Force Mark All Complete"}
                    >
                      {task.completed ? 'Completed' : 'Mark Done'}
                    </button>

                    <h3 className="task-item__title text-capitalize" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </h3>
                    <span className={`badge badge--${task.difficulty}`}>
                      {task.difficulty}
                    </span>
                    
                    {task.resourceLink && (
                      <a href={task.resourceLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                        [Resource]
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="btn btn--danger" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                </div>
                
                <div className="task-item__meta" style={{ paddingLeft: '4rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <span className="text-capitalize">Subject: {task.subject}</span>
                  <span>{task.duration} Hrs Total</span>
                  
                  {!task.completed && task.completedHours > 0 && (
                     <span style={{ color: 'var(--success)' }}>↓ {remainingHours} Hrs Left ({progressPct}%)</span>
                  )}
                  
                  <span style={{ color: (isPastDue && !task.completed) ? 'var(--danger)' : 'inherit' }}>
                    Due: {task.dueDate} {isPastDue && !task.completed ? '(Overdue!)' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;
