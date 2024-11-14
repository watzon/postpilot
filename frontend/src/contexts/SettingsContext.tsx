import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetSettings, SaveSettings } from '../../wailsjs/go/main/App';
import { Settings, toFrontendSettings, toBackendSettings } from '../types/settings';
import { WindowSetDarkTheme, WindowSetLightTheme } from '../../wailsjs/runtime/runtime';

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
    notification: false,
    persistence: false,
  },
  smtp: {
    host: 'localhost',
    port: 1025,
    auth: 'none',
    username: '',
    password: '',
    tls: 'none',
  },
  spamAssassin: {
    enabled: false,
    binary: 'spamc',
    useLocal: true,
    host: 'localhost',
    port: 783,
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

  const updateTheme = (theme: string) => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      WindowSetDarkTheme();
    } else {
      document.documentElement.classList.remove('dark');
      WindowSetLightTheme();
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.ui.theme === 'system') {
        updateTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.ui.theme]);

  useEffect(() => {
    updateTheme(settings.ui.theme);
  }, [settings.ui.theme]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};