'use client';

import React from 'react';
import { useDataStream } from '@/hooks/useDataStream';

export function FilterPanel() {
  const { isPausedRef, togglePause, activeCategories, toggleCategory } = useDataStream();
  const [isPaused, setIsPaused] = React.useState(isPausedRef.current);
  const categories = ['Alpha', 'Beta', 'Gamma', 'Delta'];

  const handleToggle = () => {
    togglePause();
    setIsPaused(isPausedRef.current);
  };

  return (
    <div className="control-panel">
      <h3>Controls</h3>
      <div className="controls-group" style={{ marginBottom: '1rem' }}>
        <button 
          className={`btn ${isPaused ? 'btn-resume' : 'btn-pause'}`}
          onClick={handleToggle}
        >
          {isPaused ? 'Resume Data Stream' : 'Pause Data Stream'}
        </button>
      </div>

      <h3>Categories</h3>
      <div className="controls-group">
        {categories.map(cat => (
          <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={activeCategories.has(cat)} 
              onChange={() => toggleCategory(cat)} 
            />
            {cat}
          </label>
        ))}
      </div>
    </div>
  );
}
