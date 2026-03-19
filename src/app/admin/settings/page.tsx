import { createClient } from '@/utils/supabase/server';
import SettingsForm from './settings-form';

export default async function AdminSettings() {
  const supabase = await createClient();
  
  // Fetch settings
  const { data: settings } = await supabase
    .from('system_settings')
    .select('*');

  // Convert to object for easier access
  const settingsObj = (settings || []).reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>System Settings</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Global AI Defaults</h2>
          <SettingsForm 
            settingsKey="global_ai_limits" 
            initialValue={settingsObj.global_ai_limits || {
              default_max_openai: 100000,
              default_max_anthropic: 100000,
              default_max_local: 100000,
            }} 
          />
        </section>

        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Maintenance Mode</h2>
          <SettingsForm 
            settingsKey="maintenance_mode" 
            initialValue={settingsObj.maintenance_mode || { enabled: false, message: 'System is under maintenance.' }} 
          />
        </section>
      </div>
    </div>
  );
}
