import React, { useEffect } from 'react';
import { Email } from '../../types/email';
import TabPanel from '../Layout/TabPanel';
import ContentView from './ContentView';
import HeadersPanel from './HeadersPanel';
import TextView from './TextView';
import RawView from './RawView';
import { Settings } from '../../types/settings';
import { useSettings } from '../../hooks/useSettings';
import { useClipboard } from '../../hooks/useClipboard';

interface EmailViewerProps {
  email: Email | null;
}

const EmailViewer: React.FC<EmailViewerProps> = ({ email }) => {
  const [activeTab, setActiveTab] = React.useState('content');
  const [isOpen, setIsOpen] = React.useState(false);
  const { settings } = useSettings();
  const { copyToClipboard, copied } = useClipboard({ timeout: 2000 });

  // Reset to available content when email changes
  useEffect(() => {
    if (email) {
      if (activeTab === 'content' && !email.html) {
        setActiveTab('text');
      } else if (activeTab === 'text' && !email.body && email.html) {
        setActiveTab('content');
      }
    }
  }, [email, activeTab]);

  if (!email) {
    const getSmtpUrl = (masked = false) => {
      const { host, port, auth, username, password } = settings.smtp;
      let url = `${host}:${port}`;

      console.log(auth, username, password);
      
      if (auth === 'plain' && username && password) {
        const pass = masked ? '•'.repeat(password.length) : password;
        url = `smtp://${username}:${pass}@${host}:${port}`;
      } else {
        url = `smtp://${host}:${port}`;
      }
      
      return url;
    };

    const displayAddress = getSmtpUrl(true);  // masked password for display
    const copyAddress = getSmtpUrl(false);    // full password for clipboard

    return (
      <div className='h-full flex flex-col items-center justify-center p-8 max-w-2xl mx-auto'>
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              No email selected
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your email client to send messages to:
            </p>
            <button
              onClick={() => copyToClipboard(copyAddress)}
              className="inline-block bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                rounded-lg px-4 py-2 transition-colors duration-200 cursor-pointer group relative"
            >
              <code className="font-mono">
                {displayAddress}
              </code>
              <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 
                bg-gray-900 dark:bg-gray-600 text-white px-2 py-1 rounded text-sm
                transition-opacity duration-200 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                Copied!
              </span>
            </button>
          </div>

          {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Keyboard shortcuts
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Keyboard shortcuts coming soon</p>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      id: 'content', 
      label: 'HTML', 
      disabled: !email.html 
    },
    { 
      id: 'headers', 
      label: 'Headers', 
      isAction: true 
    },
    { 
      id: 'text', 
      label: 'Text',
      disabled: !email.body
    },
    { 
      id: 'raw', 
      label: 'Raw' 
    },
  ];

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-bold px-6 py-4 dark:text-white">{email.subject}</h1>
          <TabPanel
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAction={(id) => {
              if (id === 'headers') {
                setIsOpen(!isOpen);
              }
            }}
          />
        </div>
        <div className="flex-1 overflow-auto dark:bg-gray-900">
          {activeTab === 'content' && email.html && <ContentView email={email} />}
          {activeTab === 'text' && email.body && <TextView email={email} />}
          {activeTab === 'raw' && <RawView email={email} />}
        </div>
      </div>
      
      <div 
        className={`border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
          h-full transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'w-80' : 'w-0'}`}
      >
        <div className="w-80">
          {<HeadersPanel email={email} onClose={() => setIsOpen(false)} />}
        </div>
      </div>
    </div>
  );
};

export default EmailViewer; 