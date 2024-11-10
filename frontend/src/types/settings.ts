// Import the auto-generated types
import { main } from '../../wailsjs/go/models';

// Create an interface that matches the Go structure
export interface Settings {
  ui: {
    theme: string;
    showPreview: boolean;
    timeFormat: string;
  };
  smtp: {
    host: string;
    port: number;
    auth: string;
    username: string;
    password: string;
    tls: string;
  };
}

// Create conversion functions
export function toFrontendSettings(backendSettings: main.Settings): Settings {
  return {
    ui: {
      theme: backendSettings.ui.theme,
      showPreview: backendSettings.ui.showPreview,
      timeFormat: backendSettings.ui.timeFormat,
    },
    smtp: {
      host: backendSettings.smtp.host,
      port: backendSettings.smtp.port,
      auth: backendSettings.smtp.auth,
      username: backendSettings.smtp.username,
      password: backendSettings.smtp.password,
      tls: backendSettings.smtp.tls,
    },
  };
}

export function toBackendSettings(frontendSettings: Settings): main.Settings {
  const settings = new main.Settings();
  settings.ui = {
    theme: frontendSettings.ui.theme,
    showPreview: frontendSettings.ui.showPreview,
    timeFormat: frontendSettings.ui.timeFormat,
  };
  settings.smtp = {
    host: frontendSettings.smtp.host,
    port: frontendSettings.smtp.port,
    auth: frontendSettings.smtp.auth,
    username: frontendSettings.smtp.username,
    password: frontendSettings.smtp.password,
    tls: frontendSettings.smtp.tls,
  };
  return settings;
} 