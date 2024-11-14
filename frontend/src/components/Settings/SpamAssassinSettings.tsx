import { useEffect, useState } from 'react';
import { SpamAssassinSettings as SpamSettings } from '../../types/spam';
import { Switch } from '@headlessui/react';

interface Props {
  settings: SpamSettings;
  onChange: (settings: SpamSettings) => void;
  updateLocalSettings: (path: string[], value: any) => void;
}

export function SpamAssassinSettings({ settings, onChange, updateLocalSettings }: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: Partial<SpamSettings>) => {
    try {
      setError(null);
      const updatedSettings = { ...settings, ...newValue };
      updateLocalSettings(['spamAssassin'], updatedSettings);
      onChange(updatedSettings);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          SpamAssassin Integration
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure SpamAssassin integration for spam detection.
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Enable SpamAssassin</span>
            </span>
            <Switch
              checked={settings.enabled}
              onChange={(checked) => handleChange({ enabled: checked })}
              className={`${
                settings.enabled ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div>
            <label htmlFor="binary" className="block text-sm font-medium text-gray-900 dark:text-white">
              SpamAssassin Binary Path
            </label>
            <input
              type="text"
              id="binary"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              value={settings.binary}
              onChange={(e) => handleChange({ binary: e.target.value })}
              disabled={!settings.enabled}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Connection Type</span>
              </span>
              <Switch
                checked={settings.useLocal}
                onChange={(checked) => handleChange({ useLocal: checked })}
                disabled={!settings.enabled}
                className={`${
                  settings.useLocal ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span
                  className={`${
                    settings.useLocal ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {settings.useLocal ? 'Using Local Binary' : 'Using Remote Daemon'}
            </p>
          </div>

          {!settings.useLocal && (
            <>
              <div>
                <label htmlFor="host" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Host
                </label>
                <input
                  type="text"
                  id="host"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  value={settings.host}
                  onChange={(e) => handleChange({ host: e.target.value })}
                  disabled={!settings.enabled}
                />
              </div>

              <div>
                <label htmlFor="port" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Port
                </label>
                <input
                  type="number"
                  id="port"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:text-white sm:text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  value={settings.port}
                  onChange={(e) => handleChange({ port: parseInt(e.target.value, 10) })}
                  disabled={!settings.enabled}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
