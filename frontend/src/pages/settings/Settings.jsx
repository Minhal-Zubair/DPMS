import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../../services/userSettingService";
import "./Settings.css";


function Settings() {

  const userId = localStorage.getItem("userId");

  const [loading,setLoading] = useState(true);

  const [settings, setSettings] = useState({

    darkMode: false,

    emailNotifications: true,

    smsNotifications: false,

    twoFactorAuth: false,

    language: "English",

    autoLogout: "15",

  });

  const handleToggle = (e) => {

    const { name, checked } = e.target;

    setSettings((prev) => ({

      ...prev,

      [name]: checked,

    }));

  };

  const handleSelect = (e) => {

    const { name, value } = e.target;

    setSettings((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  const handleSave = async () => {
    try {
        await saveSettings(userId,{
    ...settings,
    autoLogout:Number(settings.autoLogout)
});
        alert("Settings saved successfully.");
    }
    catch (error) {
        console.log(error);
        alert("Unable to save settings.");
    }
};

  useEffect(() => {

    loadSettings();

}, []);


const loadSettings = async () => {

    try {

        const response = await getSettings(userId);

        setSettings({
    ...response.data,
    autoLogout: String(response.data.autoLogout)
});

    }

    catch (error) {

        console.log(error);

    }finally {
      setLoading(false);
    }
  };
useEffect(() => {

    if(userId){
        loadSettings();
    }

}, [userId]);

if(loading){

    return <h2>Loading settings...</h2>;

}


  return (

    <div className="settings-page">

      <div className="page-header">

        <h1>Settings</h1>

        <p>
          Customize your account preferences and security settings.
        </p>

      </div>

      {/* Appearance */}

      <div className="settings-card">

        <h2>Appearance</h2>

        <div className="setting-item">

          <div>

            <h4>Dark Mode</h4>

            <p>Enable dark theme for the application.</p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode || false}
              onChange={handleToggle}
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>

      {/* Notifications */}

      <div className="settings-card">

        <h2>Notifications</h2>

        <div className="setting-item">

          <div>

            <h4>Email Notifications</h4>

            <p>Receive application updates by email.</p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications || false}
              onChange={handleToggle}
            />

            <span className="slider"></span>

          </label>

        </div>

        <div className="setting-item">

          <div>

            <h4>SMS Notifications</h4>

            <p>Receive important alerts via SMS.</p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings.smsNotifications || false}
              onChange={handleToggle}
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>

      {/* Security */}

      <div className="settings-card">

        <h2>Security</h2>

        <div className="setting-item">

          <div>

            <h4>Two Factor Authentication</h4>

            <p>Increase account security.</p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={settings.twoFactorAuth || false}
              onChange={handleToggle}
            />

            <span className="slider"></span>

          </label>

        </div>

        <div className="select-group">

          <label>Auto Logout</label>

          <select
            name="autoLogout"
            value={settings.autoLogout}
            onChange={handleSelect}
          >

            <option value="15">15 Minutes</option>

            <option value="30">30 Minutes</option>

            <option value="60">1 Hour</option>

          </select>

        </div>

      </div>

      {/* Language */}

      <div className="settings-card">

        <h2>Language</h2>

        <div className="select-group">

          <label>Select Language</label>

          <select
            name="language"
            value={settings.language}
            onChange={handleSelect}
          >

            <option>English</option>

            <option>Urdu</option>

          </select>

        </div>

      </div>

      <button
        className="save-btn"
        onClick={handleSave}
      >
        Save Settings
      </button>

    </div>

  );

}


export default Settings;