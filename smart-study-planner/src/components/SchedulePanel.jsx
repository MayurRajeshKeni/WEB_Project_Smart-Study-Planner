import React, { useState, useMemo } from 'react';
import { generateSchedule } from '../utils/scheduler';

const SchedulePanel = ({ tasks, dailyAvailability, onMarkBlockDone, onResetToday, onUndoBlock, dailyLogs, bonusHours, onAddBonusHour }) => {
  const [view, setView] = useState('week'); 
  const [monthOffset, setMonthOffset] = useState(0); 

  const schedule = useMemo(() => {
    return generateSchedule(tasks, dailyAvailability, dailyLogs, bonusHours);
  }, [tasks, dailyAvailability, dailyLogs, bonusHours]);

  const getHistoricalDays = () => {
    const historical = [];
    const dateWalker = new Date();
    dateWalker.setHours(0,0,0,0);
    dateWalker.setDate(1); 
    dateWalker.setMonth(dateWalker.getMonth() + monthOffset); 

    const daysInMonth = new Date(dateWalker.getFullYear(), dateWalker.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(dateWalker.getFullYear(), dateWalker.getMonth(), i);
      const localStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      
      const logsArray = dailyLogs[localStr] || [];
      const logged = logsArray.reduce((sum, item) => sum + item.allocatedHours, 0);
      
      historical.push({
        dateObj: d,
        dateIso: localStr,
        date: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
        loggedHours: logged,
        isPast: true
      });
    }
    return historical;
  };

  const renderTaskItems = (day, isToday) => {
    const logsArray = dailyLogs[day.dateIso] || [];
    const hasLoggedToday = logsArray.length > 0;
    
    if (!hasLoggedToday) {
      if (day.availableHours === 0 && day.items.length === 0) {
        return (
          <div style={{ padding: '0.5rem' }}>
            <p style={{ color: 'var(--warning)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Configured as 0 Hours</p>
            {isToday && (
              <button 
                onClick={() => onAddBonusHour(day.dateIso)} 
                style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', fontSize: '0.7rem', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                +1h Bonus Capacity
              </button>
            )}
          </div>
        );
      }
      if (day.availableHours === 0 && day.hasPendingTasks && isToday) {
        return (
          <div style={{ padding: '0.5rem' }}>
            <p style={{ color: 'var(--danger)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Warning: 0 hours available today, but tasks pending.</p>
            <button 
              onClick={() => onAddBonusHour(day.dateIso)} 
              style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', fontSize: '0.7rem', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              +1h Bonus Capacity
            </button>
          </div>
        );
      }
      if (day.items.length === 0) {
        return <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', padding: '0.5rem' }}>All caught up.</p>;
      }
    }

    return (
      <div className="schedule-day__slots">
        {/* Render already-logged specific blocks! */}
        {logsArray.map((logItem) => (
          <div key={logItem.uniqueBlockId} className="schedule-slot" style={{ background: 'var(--bg-glass)', opacity: 0.85, borderLeft: '3px solid var(--success)' }}>
            <div className="schedule-slot__time" style={{ minWidth: '70px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>{logItem.allocatedHours}</div>
              <div style={{ fontSize: '0.7rem' }}>HOURS</div>
            </div>
            <div className="schedule-slot__content" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: '1rem' }}>
              <div>
                 <div style={{ textDecoration: 'line-through', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                   <span className="text-capitalize">{logItem.title}</span>
                 </div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--success)', opacity: 0.9 }}>
                   <span className="text-capitalize">{logItem.subject}</span> • Block Completed
                 </div>
              </div>
              
              {isToday && (
                <button 
                   onClick={() => onUndoBlock(day.dateIso, logItem.uniqueBlockId, logItem.id, logItem.allocatedHours)} 
                   style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.7rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                   Undo
                </button>
              )}
            </div>
          </div>
        ))}

        {day.items.length === 0 && hasLoggedToday && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
            <p style={{ color: 'var(--success)', fontStyle: 'italic', fontSize: '0.85rem' }}>
              All set capacity for today finished!
            </p>
            {isToday && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => onAddBonusHour(day.dateIso)} 
                  style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', fontSize: '0.7rem', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
                >
                  I have +1 more hour
                </button>
                <button 
                  onClick={onResetToday} 
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '0.7rem', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Hard Reset Today
                </button>
              </div>
            )}
          </div>
        )}

        {day.items.map((item, idxx) => (
          <div key={item.id + '-' + idxx} className="schedule-slot" style={{ backgroundColor: item.themeBg || 'var(--slot-bg)' }}>
            <div className="schedule-slot__time" style={{ minWidth: '70px', textAlign: 'center', fontWeight: 'bold' }}>
              <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{item.allocatedHours}</div>
              <div style={{ fontSize: '0.7rem' }}>{item.allocatedHours === 1 ? 'HOUR' : 'HOURS'}</div>
            </div>
            
            <div className="schedule-slot__content">
              <div className="schedule-slot__title" style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                <span className="text-capitalize">{item.title}</span> {item.isSplit && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Split Block)</span>}
              </div>
              <div className="schedule-slot__subject" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`badge badge--${item.difficulty}`} style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                  {item.difficulty}
                </span>
                <span className="text-capitalize">{item.subject}</span>
                <span style={{ color: 'var(--text-primary)' }}>• Due: {item.dueDate}</span>
              </div>
            </div>

            {isToday && (
              <button 
                onClick={() => onMarkBlockDone(item, item.allocatedHours)}
                className="btn btn--primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginLeft: 'auto' }}
              >
                Mark Block Done
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getDayView = () => {
    if (schedule.length === 0) return <div style={{ textAlign: 'center', padding: '2rem' }}>No schedule generated.</div>;
    const todaySchedule = schedule[0]; 
    return (
      <div className="schedule-container animate-fade-in">
        <h3 className="schedule-day__title" style={{ color: 'var(--accent-primary)', fontSize: '1.4rem' }}>
          Today: {todaySchedule.date}
        </h3>
        {renderTaskItems(todaySchedule, true)}
      </div>
    );
  };

  const getWeekView = () => {
    if (schedule.length === 0) return <div style={{ textAlign: 'center', padding: '2rem' }}>No schedule generated.</div>;
    const weekSchedule = schedule.slice(0, 7);
    return (
      <div className="schedule-container animate-fade-in">
        {weekSchedule.map((day, idx) => {
          const isToday = idx === 0;
          return (
            <div key={idx} className="schedule-day" style={{ border: isToday ? '2px solid var(--accent-glow)' : 'none', background: isToday ? 'rgba(59, 130, 246, 0.05)' : 'transparent', padding: isToday ? '1rem' : 0, borderRadius: 'var(--radius-md)' }}>
              <h3 className="schedule-day__title" style={{ color: isToday ? 'var(--accent-primary)' : 'inherit' }}>
                {day.date} {isToday && <span style={{ fontSize: '0.8rem', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', marginLeft: '0.5rem' }}>Today Focus</span>}
              </h3>
              {renderTaskItems(day, isToday)}
            </div>
          )
        })}
      </div>
    );
  };

  const getMonthView = () => {
    const pastDays = getHistoricalDays();
    const forwardMonthLabel = pastDays[0].dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    return (
      <div className="animate-fade-in">
        <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          {forwardMonthLabel} {monthOffset < 0 ? '(History Log)' : '(Planner & History)'}
        </h3>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>CONSISTENCY HEATMAP:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: '0.3rem' }}>
            {pastDays.map((day, idx) => {
              let bg = 'var(--bg-secondary)';
              const opacity = day.loggedHours > 0 ? Math.min(1, 0.2 + (day.loggedHours / 10)) : 0.1;
              if (day.loggedHours > 0) bg = `rgba(16, 185, 129, ${opacity})`;
              
              return (
                <div key={idx} title={`${day.date}: ${day.loggedHours}h`} style={{ 
                  background: bg,
                  border: '1px solid var(--border-color)',
                  borderRadius: '3px',
                  aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem',
                  color: day.loggedHours > 4 ? 'white' : 'var(--text-secondary)',
                  cursor: 'help'
                }}>
                  {day.dateObj.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {monthOffset === 0 && (
          <>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>UPCOMING SCHEDULE:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {schedule.slice(0, 12).map((day, idx) => {
                const isToday = idx === 0;
                return (
                  <div key={idx} style={{ 
                    background: isToday ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                    border: isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    minHeight: '100px',
                    display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', marginBottom: '0.3rem', color: isToday ? 'var(--text-primary)' : 'inherit' }}>
                      {day.date}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {day.items.slice(0, 2).map((it, i) => (
                        <div key={i} style={{ fontSize: '0.65rem', background: it.themeBg || 'var(--bg-glass)', padding: '0.2rem 0.4rem', borderRadius: '3px', borderLeft: '2px solid var(--accent-primary)' }}>
                          {it.allocatedHours}h {it.subject}
                        </div>
                      ))}
                      {day.items.length > 2 && <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>+{day.items.length-2} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="panel-title" style={{ marginBottom: 0 }}>Smart Schedule Plan</h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          {view === 'month' && (
            <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
               <button onClick={() => setMonthOffset(prev => prev - 1)} className="btn" style={{ padding: '0.2rem 0.6rem' }}>&lt; Prev</button>
               <div style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem', alignSelf: 'center', fontWeight: 'bold' }}>
                 {monthOffset === 0 ? 'Current' : `${monthOffset}m`}
               </div>
               <button onClick={() => setMonthOffset(prev => Math.min(0, prev + 1))} className="btn" style={{ padding: '0.2rem 0.6rem' }} disabled={monthOffset === 0}>Next &gt;</button>
            </div>
          )}

          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
            {['day', 'week', 'month'].map(v => (
              <button
                key={v}
                onClick={() => { setView(v); setMonthOffset(0); }}
                style={{
                  background: view === v ? 'var(--accent-primary)' : 'transparent',
                  color: view === v ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '0.4rem 1rem',
                  borderRadius: 'calc(var(--radius-md) - 2px)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ minHeight: '400px' }}>
        {view === 'day' && getDayView()}
        {view === 'week' && getWeekView()}
        {view === 'month' && getMonthView()}
      </div>
    </div>
  );
};

export default SchedulePanel;
