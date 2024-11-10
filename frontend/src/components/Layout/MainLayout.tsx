import React from 'react';
import EmailList from '../EmailList/EmailList';
import EmailViewer from '../EmailViewer/EmailViewer';
import { Email } from '../../types/email';

const MainLayout: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Left sidebar */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <EmailList 
          onSelectEmail={setSelectedEmail} 
          selectedEmail={selectedEmail}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 dark:bg-gray-900">
        <EmailViewer email={selectedEmail} />
      </div>
    </div>
  );
};

export default MainLayout; 