import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetSettings, SaveSettings } from '../../wailsjs/go/main/App';
import { Settings, toFrontendSettings, toBackendSettings } from '../types/settings';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => Promise<void>;
  isLoading: boolean;
}

export const defaultSettings: Settings = {
  ui: {
    theme: 'system',
    showPreview: false,
    timeFormat: '12',
  },
  smtp: {
    host: 'localhost',
    port: 1025,
    auth: 'none',
    username: '',
    password: '',
    tls: 'none',
  },
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  isLoading: true,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const backendSettings = await GetSettings();
      setSettings(toFrontendSettings(backendSettings));
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      await SaveSettings(toBackendSettings(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};