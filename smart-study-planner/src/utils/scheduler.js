export const hashStringColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorOffset = Math.abs(hash) % 360;
  return `hsla(${colorOffset}, 65%, 45%, 0.15)`;
};

// Helper to get local date string YYYY-MM-DD safely
export const getLocalDateString = (d) => {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const generateSchedule = (tasks, dailyAvailability = { 0:2, 1:4, 2:4, 3:4, 4:4, 5:3, 6:2 }, dailyLogs = {}, bonusHours = {}) => {
  if (!tasks || tasks.length === 0) return [];

  let pendingTasks = JSON.parse(JSON.stringify(tasks)).filter(t => !t.completed && (t.duration - (t.completedHours || 0)) > 0);

  const difficultyWeight = { hard: 3, medium: 2, easy: 1 };
  pendingTasks.sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    
    if (dateA !== dateB) return dateA - dateB;
    return (difficultyWeight[b.difficulty] || 0) - (difficultyWeight[a.difficulty] || 0);
  });

  const schedule = [];
  const startDay = new Date();
  startDay.setHours(0, 0, 0, 0);
  const todayString = getLocalDateString(startDay);

  let currentDayOffset = 0;
  
  while ((pendingTasks.length > 0 && currentDayOffset < 60) || currentDayOffset < 7) {
    const currentDay = new Date(startDay);
    currentDay.setDate(startDay.getDate() + currentDayOffset);
    
    const dayOfWeek = currentDay.getDay(); 
    const dateLocalStr = getLocalDateString(currentDay);
    
    let initialHours = (dailyAvailability[dayOfWeek] || 0) + (bonusHours[dateLocalStr] || 0);
    if (dateLocalStr === todayString) {
      const logsTodayArray = dailyLogs[todayString] || [];
      const loggedToday = logsTodayArray.reduce((acc, curr) => acc + curr.allocatedHours, 0);
      initialHours = Math.max(0, initialHours - loggedToday);
    }
    
    let hoursRemaining = initialHours;

    const daySchedule = {
      dateObj: currentDay,
      dateIso: dateLocalStr,
      date: currentDay.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' }),
      availableHours: initialHours,
      items: []
    };

    while (hoursRemaining > 0 && pendingTasks.length > 0) {
      const task = pendingTasks[0];
      const taskRemainingHours = task.duration - (task.completedHours || 0);
      const themeColor = hashStringColor(task.subject + task.title);

      if (taskRemainingHours <= hoursRemaining) {
        daySchedule.items.push({
          ...task,
          allocatedHours: taskRemainingHours,
          themeBg: themeColor
        });
        hoursRemaining -= taskRemainingHours;
        pendingTasks.shift(); 
      } else {
        daySchedule.items.push({
          ...task,
          allocatedHours: hoursRemaining,
          isSplit: true,
          themeBg: themeColor
        });
        task.completedHours = (task.completedHours || 0) + hoursRemaining;
        hoursRemaining = 0;
      }
    }
    
    daySchedule.hasPendingTasks = pendingTasks.length > 0;
    schedule.push(daySchedule);
    currentDayOffset++;
  }

  return schedule;
};
