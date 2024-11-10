import React, { useEffect } from 'react';
import { Email } from '../../types/email';
import TabPanel from '../Layout/TabPanel';
import ContentView from './ContentView';
import HeadersPanel from './HeadersPanel';
import TextView from './TextView';
import RawView from './RawView';

interface EmailViewerProps {
  email: Email | null;
}

const EmailViewer: React.FC<EmailViewerProps> = ({ email }) => {
  const [activeTab, setActiveTab] = React.useState('content');
  const [isOpen, setIsOpen] = React.useState(false);

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select an email to view its contents
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <div 
        className="flex-1 flex flex-col"
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-bold px-6 py-4 dark:text-white">{email.subject}</h1>
          <TabPanel
            tabs={[
              { id: 'content', label: 'Content' },
              { id: 'headers', label: 'Headers', isAction: true },
              { id: 'text', label: 'Text' },
              { id: 'raw', label: 'Raw' },
            ]}
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
          {activeTab === 'content' && <ContentView email={email} />}
          {activeTab === 'text' && <TextView email={email} />}
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