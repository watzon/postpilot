import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useSettings } from '../../hooks/useSettings';
import type { Settings } from '../../types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('ui');
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = React.useState<Settings>(settings);

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
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
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
                    ? 'text-red-600 border-red-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
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
                  <label className="block text-sm font-medium text-gray-700">Theme</label>
                  <span className="text-sm text-gray-500">Choose your preferred appearance</span>
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={localSettings.ui.theme}
                  onChange={(e) => updateLocalSettings(['ui', 'theme'], e.target.value)}
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message Preview</label>
                  <span className="text-sm text-gray-500">Show message preview in list</span>
                </div>
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300"
                  checked={localSettings.ui.showPreview}
                  onChange={(e) => updateLocalSettings(['ui', 'showPreview'], e.target.checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Format</label>
                  <span className="text-sm text-gray-500">Choose how times are displayed</span>
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={localSettings.ui.timeFormat}
                  onChange={(e) => updateLocalSettings(['ui', 'timeFormat'], e.target.value)}
                >
                  <option value="12">12-hour</option>
                  <option value="24">24-hour</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="localhost"
                    value={localSettings.smtp.host}
                    onChange={(e) => updateLocalSettings(['smtp', 'host'], e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="1025"
                    value={localSettings.smtp.port}
                    onChange={(e) => updateLocalSettings(['smtp', 'port'], parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authentication
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="none">None</option>
                  <option value="plain">Plain</option>
                  <option value="login">Login</option>
                  <option value="cram-md5">CRAM-MD5</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TLS Settings
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="none">None</option>
                  <option value="starttls">STARTTLS</option>
                  <option value="tls">TLS</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-6">
              <p className="text-gray-600">About section coming soon...</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 