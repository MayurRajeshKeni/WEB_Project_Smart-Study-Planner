import React, { useState } from 'react';

const InputPanel = ({ onAddTask }) => {
  const [task, setTask] = useState({
    title: '',
    subject: '',
    dueDate: '',
    duration: 1,
    difficulty: 'medium',
    resourceLink: ''
  });
  
  const [warning, setWarning] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
    
    if (name === 'dueDate') {
      const today = new Date();
      today.setHours(0,0,0,0);
      const selected = new Date(value);
      if (selected < today) {
        setWarning('Warning: The selected due date is in the past.');
      } else {
        setWarning('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title || !task.subject || !task.dueDate) return;

    onAddTask({
      ...task,
      title: task.title.trim() ? task.title.charAt(0).toUpperCase() + task.title.slice(1) : '',
      subject: task.subject.trim() ? task.subject.charAt(0).toUpperCase() + task.subject.slice(1) : '',
      id: Date.now().toString(),
      duration: Number(task.duration),
      completedHours: 0,
      completed: false
    });

    // Reset Form
    setTask({
      title: '',
      subject: '',
      dueDate: '',
      duration: 1,
      difficulty: 'medium',
      resourceLink: ''
    });
    setWarning('');
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h2 className="panel-title">Add New Task</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Subject</label>
            <input
              className="form-input text-capitalize"
              type="text"
              name="subject"
              value={task.subject}
              onChange={handleChange}
              placeholder="e.g. Operating Systems"
              required
              autoComplete="off"
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Topic / Chapter</label>
            <input
              className="form-input text-capitalize"
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="e.g. Memory Management"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Due Date</label>
            <input
              className="form-input"
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Estimated Time (Hours)</label>
            <input
              className="form-input"
              type="number"
              name="duration"
              min="1"
              max="24"
              value={task.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Difficulty</label>
            <select
              className="form-input"
              name="difficulty"
              value={task.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        
        {warning && <div style={{ color: 'var(--warning)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{warning}</div>}

        <div className="form-group" style={{ marginTop: '1.25rem' }}>
          <label className="form-label">Resource Link (Optional)</label>
          <input
            className="form-input"
            type="url"
            name="resourceLink"
            value={task.resourceLink || ''}
            onChange={handleChange}
            placeholder="https://..."
            autoComplete="off"
          />
        </div>

        <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '1.5rem' }}>
          Add to Schedule
        </button>
      </form>
    </div>
  );
};

export default InputPanel;
