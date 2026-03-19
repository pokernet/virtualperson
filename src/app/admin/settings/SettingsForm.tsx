'use client';

import { useState } from 'react';
import { updateSystemSettings } from '../actions';

export default function SettingsForm({ settingsKey, initialValue }: { settingsKey: string, initialValue: any }) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await updateSystemSettings(settingsKey, value);
      alert('Settings saved successfully');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Object.keys(value).map(key => (
        <div key={key} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ width: '200px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {key.replace(/_/g, ' ').toUpperCase()}:
          </span>
          {typeof value[key] === 'boolean' ? (
            <input 
              type="checkbox" 
              checked={value[key]} 
              onChange={(e) => setValue({ ...value, [key]: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
          ) : (
            <input 
              type={typeof value[key] === 'number' ? 'number' : 'text'}
              value={value[key]} 
              onChange={(e) => setValue({ ...value, [key]: typeof value[key] === 'number' ? parseInt(e.target.value) : e.target.value })}
              className="admin-input"
              style={{ flex: 1, maxWidth: '300px' }}
            />
          )}
        </div>
      ))}
      
      <button 
        onClick={handleSave} 
        disabled={loading} 
        className="btn-primary" 
        style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>

      <style jsx>{`
        .admin-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
