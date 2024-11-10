import React from 'react';
import { Email } from '../../types/email';
import TabPanel from '../Layout/TabPanel';
import ContentView from './ContentView';
import HeadersView from './HeadersView';
import TextView from './TextView';
import RawView from './RawView';

interface EmailViewerProps {
  email: Email | null;
}

const EmailViewer: React.FC<EmailViewerProps> = ({ email }) => {
  const [activeTab, setActiveTab] = React.useState('content');

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select an email to view its contents
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-200">
        <h1 className="text-lg font-bold px-6 py-4">{email.subject}</h1>
        <TabPanel
          tabs={[
            { id: 'content', label: 'Content' },
            { id: 'headers', label: 'Headers' },
            { id: 'text', label: 'Text' },
            { id: 'raw', label: 'Raw' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {activeTab === 'content' && <ContentView email={email} />}
        {activeTab === 'headers' && <HeadersView email={email} />}
        {activeTab === 'text' && <TextView email={email} />}
        {activeTab === 'raw' && <RawView email={email} />}
      </div>
    </div>
  );
};

export default EmailViewer; 