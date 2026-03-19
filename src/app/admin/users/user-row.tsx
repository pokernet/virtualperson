'use client';

import { useState } from 'react';
import { updateUserProfile } from '../actions';

export default function UserRow({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      await updateUserProfile(user.id, formData);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
      <td style={{ padding: '1rem' }}>
        <div style={{ fontWeight: '600' }}>{user.full_name || 'Anonymous User'}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.username || 'No username'}</div>
      </td>
      <td style={{ padding: '1rem' }}>
        {isEditing ? (
          <select 
            value={formData.account_status} 
            onChange={(e) => setFormData({ ...formData, account_status: e.target.value })}
            className="admin-input"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
        ) : (
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: '99px', 
            fontSize: '0.75rem', 
            background: user.account_status === 'Active' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: user.account_status === 'Active' ? '#34d399' : '#ef4444'
          }}>
            {user.account_status}
          </span>
        )}
      </td>
      <td style={{ padding: '1rem' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', width: '60px' }}>OpenAI:</span>
              <input 
                type="number" 
                value={formData.max_openai_tokens} 
                onChange={(e) => setFormData({ ...formData, max_openai_tokens: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', width: '60px' }}>Anthropic:</span>
              <input 
                type="number" 
                value={formData.max_anthropic_tokens} 
                onChange={(e) => setFormData({ ...formData, max_anthropic_tokens: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', width: '60px' }}>Local:</span>
              <input 
                type="number" 
                value={formData.max_local_tokens} 
                onChange={(e) => setFormData({ ...formData, max_local_tokens: parseInt(e.target.value) })}
                className="admin-input"
              />
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem' }}>
            <div>OpenAI: {user.openai_tokens?.toLocaleString()} / {user.max_openai_tokens?.toLocaleString()}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Anthropic: {user.anthropic_tokens?.toLocaleString()} / {user.max_anthropic_tokens?.toLocaleString()}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Local: {user.local_tokens?.toLocaleString()} / {user.max_local_tokens?.toLocaleString()}
            </div>
          </div>
        )}
      </td>
      <td style={{ padding: '1rem' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Edit
          </button>
        )}
      </td>

      <style jsx>{`
        .admin-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          width: 100px;
        }
      `}</style>
    </tr>
  );
}
