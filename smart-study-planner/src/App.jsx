import React, { useState, useEffect } from 'react';
import './index.css';
import './App.css';

import ProfileSetup from './components/ProfileSetup';
import InputPanel from './components/InputPanel';
import TaskList from './components/TaskList';
import SchedulePanel from './components/SchedulePanel';
import ProgressTracker from './components/ProgressTracker';

function App() {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('studyPlannerProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('studyPlannerTasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [dailyAvailability, setDailyAvailability] = useState(() => {
    const saved = localStorage.getItem('studyPlannerAvailability');
    return saved ? JSON.parse(saved) : { 0:2, 1:4, 2:4, 3:4, 4:4, 5:3, 6:2 };
  });

  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem('studyPlannerDailyLogs');
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      if (typeof Object.values(parsed)[0] === 'number') return {}; // Migration wipe
      return parsed;
    } catch { return {}; }
  });

  const [bonusHours, setBonusHours] = useState(() => {
    const saved = localStorage.getItem('studyPlannerBonusHours');
    return saved ? JSON.parse(saved) : {};
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('studyPlannerTheme') || 'dark');
  
  const [currentStreak, setCurrentStreak] = useState(() => Number(localStorage.getItem('studyPlannerStreak')) || 0);
  const [maxStreak, setMaxStreak] = useState(() => Number(localStorage.getItem('studyPlannerMaxStreak')) || 0);
  const [lastActiveDate, setLastActiveDate] = useState(() => localStorage.getItem('studyPlannerLastActive') || '');

  useEffect(() => { localStorage.setItem('studyPlannerTasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('studyPlannerAvailability', JSON.stringify(dailyAvailability)); }, [dailyAvailability]);
  useEffect(() => { localStorage.setItem('studyPlannerDailyLogs', JSON.stringify(dailyLogs)); }, [dailyLogs]);
  useEffect(() => { localStorage.setItem('studyPlannerBonusHours', JSON.stringify(bonusHours)); }, [bonusHours]);
  useEffect(() => {
    localStorage.setItem('studyPlannerTheme', theme);
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('studyPlannerStreak', currentStreak);
    localStorage.setItem('studyPlannerMaxStreak', maxStreak);
    if(lastActiveDate) localStorage.setItem('studyPlannerLastActive', lastActiveDate);
  }, [currentStreak, maxStreak, lastActiveDate]);

  useEffect(() => {
    if (!lastActiveDate) return;
    const lastActive = new Date(lastActiveDate);
    lastActive.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays > 1) setCurrentStreak(0);
  }, [lastActiveDate]);

  const registerActivity = (hoursLogged, taskObj = null) => {
    const today = new Date();
    const todayStr = today.toDateString();
    const localDateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    
    if (taskObj && hoursLogged > 0) {
      setDailyLogs(prev => {
        const currentArr = prev[localDateStr] || [];
        // Max 24 hours total limit logic check across all tasks
        const totalLogsToday = currentArr.reduce((acc, curr) => acc + curr.allocatedHours, 0);
        if (totalLogsToday + hoursLogged > 24) return prev; // Avoid exceeding 24h
        
        return {
          ...prev,
          [localDateStr]: [...currentArr, { ...taskObj, allocatedHours: hoursLogged, uniqueBlockId: Date.now() }]
        };
      });
    }

    if (lastActiveDate !== todayStr && hoursLogged > 0) {
      setLastActiveDate(todayStr);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    }
  };

  const handleUndoBlock = (dateIsoStr, uniqueBlockId, taskId, hours) => {
    // 1. Remove from daily logs
    setDailyLogs(prev => {
      const currentArr = prev[dateIsoStr] || [];
      return {
        ...prev,
        [dateIsoStr]: currentArr.filter(block => block.uniqueBlockId !== uniqueBlockId)
      };
    });

    // 2. Reduce completed hours from generic tasks
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newlyCompleted = Math.max(0, (t.completedHours || 0) - hours);
        return {
          ...t,
          completedHours: newlyCompleted,
          completed: newlyCompleted >= t.duration
        };
      }
      return t;
    }));
  };

  const handleAddBonusHour = (dateIsoStr) => {
    setBonusHours(prev => ({
      ...prev,
      [dateIsoStr]: Math.min(24, (prev[dateIsoStr] || 0) + 1)
    }));
  };

  const handleResetToday = () => {
    const today = new Date();
    const localDateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    
    // Reverse all hours for tasks that were logged today!
    const todayLogs = dailyLogs[localDateStr] || [];
    todayLogs.forEach(log => {
       setTasks(prev => prev.map(t => {
         if (t.id === log.id) {
            const newlyCompleted = Math.max(0, (t.completedHours || 0) - log.allocatedHours);
            return {
              ...t,
              completedHours: newlyCompleted,
              completed: newlyCompleted >= t.duration
            };
         }
         return t;
       }));
    });

    setDailyLogs(prev => ({ ...prev, [localDateStr]: [] }));
    setBonusHours(prev => ({ ...prev, [localDateStr]: 0 })); // Also reset bonus hours
  };

  const handleAddTask = (task) => setTasks(prev => [...prev, task]);
  
  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isNowComplete = !t.completed;
        return {
          ...t,
          completed: isNowComplete,
          completedHours: isNowComplete ? t.duration : 0
        };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId) => setTasks(prev => prev.filter(t => t.id !== taskId));

  const handleMarkBlockDone = (task, hours) => {
    setTasks(prev => prev.map(t => {
      if (t.id === task.id && !t.completed) {
        const newCompleted = (t.completedHours || 0) + hours;
        return {
          ...t,
          completedHours: newCompleted,
          completed: newCompleted >= t.duration
        };
      }
      return t;
    }));
    registerActivity(hours, task);
  };

  const handleAvailabilityChange = (day, value) => {
    setDailyAvailability(prev => ({ ...prev, [day]: Math.min(24, Math.max(0, Number(value))) }));
  };

  if (!userProfile) {
    return <ProfileSetup onComplete={setUserProfile} />;
  }

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="app">
      <header className="app__header animate-fade-in" style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <p style={{ position: 'absolute', top: 0, left: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Welcome back, <span className="text-capitalize" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{userProfile.name}</span> | {userProfile.course} (Sem {userProfile.semester})
        </p>

        <div style={{ position: 'absolute', top: 0, right: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ fontSize: '1rem', padding: '0.3rem 0.6rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            {theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <h1 className="app__title" style={{ marginTop: '2rem' }}>Smart Study Planner</h1>
        <p className="app__subtitle">Organize your academic tracking with progressive analytics.</p>
        
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 250px', gap: '2rem', alignItems: 'center', background: 'var(--bg-glass)', padding: '1rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-glass)', border: '1px solid var(--border-color)' }}>
          <ProgressTracker tasks={tasks} />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>DISCIPLINE TRACKER</div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--warning)' }}>🔥{currentStreak}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>DAY STREAK</div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>🏆{maxStreak}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>MAX STREAK</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ marginTop: '1.5rem', maxWidth: '800px', margin: '1.5rem auto 0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
             Weekly Setup (Hours/Day):
           </label>
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', justifyContent: 'center' }}>
             {DAYS.map((day, ix) => (
               <div key={day} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: '30px' }}>{day}</span>
                 <input 
                   type="number" 
                   value={dailyAvailability[ix] || 0}
                   min="0" max="24"
                   onChange={(e) => handleAvailabilityChange(ix, e.target.value)}
                   style={{ 
                     width: '40px', padding: '0.2rem', borderRadius: '0.3rem', 
                     border: 'none', background: 'var(--bg-glass)',
                     color: 'var(--text-primary)', textAlign: 'center'
                   }}
                 />
               </div>
             ))}
           </div>
        </div>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <InputPanel onAddTask={handleAddTask} />
      </div>

      <main className="app__grid">
        <div className="app__left-col">
          <TaskList 
            tasks={tasks} 
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDeleteTask} 
          />
        </div>

        <div className="app__right-col">
          <SchedulePanel 
            tasks={tasks} 
            dailyAvailability={dailyAvailability} 
            dailyLogs={dailyLogs}
            bonusHours={bonusHours}
            onMarkBlockDone={handleMarkBlockDone}
            onResetToday={handleResetToday}
            onUndoBlock={handleUndoBlock}
            onAddBonusHour={handleAddBonusHour}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
