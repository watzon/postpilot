import React from 'react';
import { Email } from '../../types/email';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HeadersPanelProps {
  email: Email;
  onClose: () => void;
}

const HeadersPanel: React.FC<HeadersPanelProps> = ({ email, onClose }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally show a toast notification
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const headers = [
    { key: 'From', value: email.from },
    { key: 'To', value: email.to.join(', ') },
    { key: 'Subject', value: email.subject },
    { key: 'Date', value: new Date(email.timestamp).toUTCString() },
    // Add any other headers you want to display
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-medium text-gray-900 dark:text-white">Headers</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {headers.map(({ key, value }) => (
          <div
            key={key}
            className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-medium text-gray-700 dark:text-gray-300">{key}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 break-all">{value}</div>
              </div>
              <button
                onClick={() => copyToClipboard(value)}
                className="shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 

export default HeadersPanel; 