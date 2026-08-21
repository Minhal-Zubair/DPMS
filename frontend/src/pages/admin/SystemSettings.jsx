import { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Database,
  Save,
  Globe,
} from "lucide-react";

import "./SystemSettings.css";

function SystemSettings() {
  const [settings, setSettings] = useState({
    systemName: "DPMS",
    maintenance: false,
    emailNotification: true,
    twoFactor: true,
    backup: true,
    maxFileSize: "20",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="system-settings">

      <div className="settings-header">

        <div>
          <h1>System Settings</h1>
          <p>Configure global settings for the Document Processing Management System.</p>
        </div>

      </div>

      <div className="settings-grid">

        {/* General */}

        <div className="settings-card">

          <h2>
            <Globe size={20} />
            General Settings
          </h2>

          <label>System Name</label>

          <input
            type="text"
            name="systemName"
            value={settings.systemName}
            onChange={handleChange}
          />

          <label>Maximum Upload Size (MB)</label>

          <input
            type="number"
            name="maxFileSize"
            value={settings.maxFileSize}
            onChange={handleChange}
          />

        </div>

        {/* Security */}

        <div className="settings-card">

          <h2>
            <Shield size={20} />
            Security
          </h2>

          <label className="switch">

            <input
              type="checkbox"
              name="twoFactor"
              checked={settings.twoFactor}
              onChange={handleChange}
            />

            Enable Two Factor Authentication

          </label>

          <label className="switch">

            <input
              type="checkbox"
              name="maintenance"
              checked={settings.maintenance}
              onChange={handleChange}
            />

            Maintenance Mode

          </label>

        </div>

        {/* Notifications */}

        <div className="settings-card">

          <h2>
            <Bell size={20} />
            Notifications
          </h2>

          <label className="switch">

            <input
              type="checkbox"
              name="emailNotification"
              checked={settings.emailNotification}
              onChange={handleChange}
            />

            Enable Email Notifications

          </label>

        </div>

        {/* Backup */}

        <div className="settings-card">

          <h2>
            <Database size={20} />
            Backup Settings
          </h2>

          <label className="switch">

            <input
              type="checkbox"
              name="backup"
              checked={settings.backup}
              onChange={handleChange}
            />

            Automatic Daily Backup

          </label>

        </div>

      </div>

      <button className="save-btn">

        <Save size={18} />

        Save Settings

      </button>

    </div>
  );
}

export default SystemSettings;