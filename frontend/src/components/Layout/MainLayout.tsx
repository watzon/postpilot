import React from 'react';
import EmailList from '../EmailList/EmailList';
import EmailViewer from '../EmailViewer/EmailViewer';
import { Email } from '../../types/email';

const MainLayout: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <div className="w-1/3 border-r border-gray-200">
        <EmailList 
          onSelectEmail={setSelectedEmail} 
          selectedEmail={selectedEmail}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <EmailViewer email={selectedEmail} />
      </div>
    </div>
  );
};

export default MainLayout; 