import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useSettings } from '../../hooks/useSettings';
import type { Settings } from '../../types/settings';
import { GetVersion } from '../../../wailsjs/go/main/App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('ui');
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = React.useState<Settings>(settings);
  const [version, setVersion] = React.useState<string>('0.0.1');

  React.useEffect(() => {
    GetVersion().then(setVersion);
  }, []);

  // Reset local settings when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSave = async () => {
    try {
      const loadingToast = toast.loading('Saving settings...');
      
      // Save settings to backend
      await updateSettings(localSettings);
      
      toast.dismiss(loadingToast);
      toast.success('Settings saved successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Failed to save settings:', error);
    }
  };

  const updateLocalSettings = (path: string[], value: any) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {[
              { id: 'ui', label: 'UI Settings' },
              { id: 'smtp', label: 'SMTP Settings' },
              { id: 'about', label: 'About' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`
                  px-6 py-3 text-sm font-medium relative
                  ${activeTab === tab.id 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-400" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'ui' && (
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred appearance</span>
                </div>
                <div className="relative">
                  <select 
                    className={`w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                      appearance-none`}
                    value={localSettings.ui.theme}
                    onChange={(e) => updateLocalSettings(['ui', 'theme'], e.target.value)}
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message Preview</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Show message preview in list</span>
                </div>
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-red-500"
                  checked={localSettings.ui.showPreview}
                  onChange={(e) => updateLocalSettings(['ui', 'showPreview'], e.target.checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Format</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Choose how times are displayed</span>
                </div>
                <div className="relative">
                  <select 
                    className={`w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                      appearance-none`}
                    value={localSettings.ui.timeFormat}
                    onChange={(e) => updateLocalSettings(['ui', 'timeFormat'], e.target.value)}
                  >
                    <option value="12">12-hour</option>
                    <option value="24">24-hour</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Enable desktop notifications</span>
                </div>
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-red-500"
                  checked={localSettings.ui.notification}
                  onChange={(e) => updateLocalSettings(['ui', 'notification'], e.target.checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Persistence</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Save emails between sessions</span>
                </div>
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-red-500"
                  checked={localSettings.ui.persistence}
                  onChange={(e) => updateLocalSettings(['ui', 'persistence'], e.target.checked)}
                />
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="localhost"
                    value={localSettings.smtp.host}
                    onChange={(e) => updateLocalSettings(['smtp', 'host'], e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="1025"
                    value={localSettings.smtp.port}
                    onChange={(e) => updateLocalSettings(['smtp', 'port'], parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Authentication
                </label>
                <div className="relative">
                  <select 
                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                      appearance-none`}
                    value={localSettings.smtp.auth}
                    onChange={(e) => updateLocalSettings(['smtp', 'auth'], e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="plain">Plain</option>
                    <option value="login">Login</option>
                    <option value="cram-md5">CRAM-MD5</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      ${localSettings.smtp.auth === 'none' 
                        ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-700'
                      } 
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                    placeholder="Username"
                    value={localSettings.smtp.username}
                    onChange={(e) => updateLocalSettings(['smtp', 'username'], e.target.value)}
                    disabled={localSettings.smtp.auth === 'none'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      ${localSettings.smtp.auth === 'none' 
                        ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-700'
                      } 
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                    placeholder="Password"
                    value={localSettings.smtp.password}
                    onChange={(e) => updateLocalSettings(['smtp', 'password'], e.target.value)}
                    disabled={localSettings.smtp.auth === 'none'}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  TLS Settings
                </label>
                <div className="relative">
                  <select 
                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
                      appearance-none`}
                    value={localSettings.smtp.tls}
                    onChange={(e) => updateLocalSettings(['smtp', 'tls'], e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="starttls">STARTTLS</option>
                    <option value="tls">TLS</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-6 flex flex-col items-center text-center">
              <img 
                src="/src/assets/images/logo.svg" 
                alt="PostPilot Logo" 
                className="w-24 h-24 mb-4 dark:filter dark:brightness-90"
              />
              <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">PostPilot</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Version {version}</p>
              
              <div className="space-y-2 mb-6">
                <p>
                  <a 
                    href="https://postpilot.watzon.tech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    postpilot.watzon.tech
                  </a>
                </p>
                <p>
                  <a 
                    href="https://github.com/watzon/postpilot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    github.com/watzon/postpilot
                  </a>
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                Brought to you with ❤️ by{' '}
                <a 
                  href="https://watzon.tech" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  watzon
                </a>
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 