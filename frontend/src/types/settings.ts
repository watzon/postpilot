// Import the auto-generated types
import { main } from '../../wailsjs/go/models';
import { SpamAssassinSettings } from './spam';

// Create an interface that matches the Go structure
export interface UISettings {
  theme: 'system' | 'light' | 'dark';
  showPreview: boolean;
  timeFormat: '12' | '24';
  notification: boolean;
  persistence: boolean;
}

export interface SMTPSettings {
  host: string;
  port: number;
  auth: 'none' | 'plain';
  username: string;
  password: string;
  tls: 'none' | 'starttls' | 'tls';
}

export interface Settings {
  ui: UISettings;
  smtp: SMTPSettings;
  spamAssassin: SpamAssassinSettings;
}

// Create conversion functions
export function toFrontendSettings(backendSettings: main.Settings): Settings {
  return {
    ui: {
      theme: backendSettings.ui.theme as UISettings['theme'],
      showPreview: backendSettings.ui.showPreview,
      timeFormat: backendSettings.ui.timeFormat as UISettings['timeFormat'],
      notification: backendSettings.ui.notification,
      persistence: backendSettings.ui.persistence,
    },
    smtp: {
      host: backendSettings.smtp.host,
      port: backendSettings.smtp.port,
      auth: backendSettings.smtp.auth as SMTPSettings['auth'],
      username: backendSettings.smtp.username,
      password: backendSettings.smtp.password,
      tls: backendSettings.smtp.tls as SMTPSettings['tls'],
    },
    spamAssassin: backendSettings.spamAssassin,
  };
}

export function toBackendSettings(frontendSettings: Settings): main.Settings {
  const settings = new main.Settings();
  settings.ui = {
    theme: frontendSettings.ui.theme,
    showPreview: frontendSettings.ui.showPreview,
    timeFormat: frontendSettings.ui.timeFormat,
    notification: frontendSettings.ui.notification,
    persistence: frontendSettings.ui.persistence,
  };
  settings.smtp = {
    host: frontendSettings.smtp.host,
    port: frontendSettings.smtp.port,
    auth: frontendSettings.smtp.auth,
    username: frontendSettings.smtp.username,
    password: frontendSettings.smtp.password,
    tls: frontendSettings.smtp.tls,
  };
  settings.spamAssassin = frontendSettings.spamAssassin;
  return settings;
}