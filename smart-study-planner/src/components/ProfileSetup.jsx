import React, { useState } from 'react';

const ProfileSetup = ({ onComplete }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    course: '',
    semester: '1'
  });

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile.name || !profile.course) return;
    localStorage.setItem('studyPlannerProfile', JSON.stringify(profile));
    onComplete(profile);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem 2rem' }}>
        <h2 className="panel-title" style={{ justifyContent: 'center', marginBottom: '0.5rem', textAlign: 'center', fontSize: '1.8rem' }}>Welcome to Smart Study Planner</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Please set up your profile to personalize your dashboard.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input text-capitalize" name="name" value={profile.name} onChange={handleChange} required autoComplete="off" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" value={profile.email} onChange={handleChange} autoComplete="off" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Course / Degree</label>
              <input className="form-input text-capitalize" name="course" placeholder="e.g. B.Tech CSE" value={profile.course} onChange={handleChange} required autoComplete="off" />
            </div>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <input className="form-input" type="number" min="1" max="10" name="semester" value={profile.semester} onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>Get Started</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
