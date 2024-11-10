import React, { useState } from 'react';
import EmailList from '../EmailList/EmailList';
import EmailViewer from '../EmailViewer/EmailViewer';
import { Email } from '../../types/email';
import { EventsOn } from '../../../wailsjs/runtime/runtime';

interface MainLayoutProps {
  emails: Email[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ emails }) => {
  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);
  const [listWidth, setListWidth] = useState(400); // Default width
  const [isResizing, setIsResizing] = useState(false);

  const MIN_WIDTH = 300;

  React.useEffect(() => {
    const unsubscribe = EventsOn('emails:cleared', () => {
      setSelectedEmail(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        setListWidth(Math.min(Math.max(newWidth, MIN_WIDTH), window.innerWidth - 400));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <div 
        className="border-r border-gray-200 dark:border-gray-700" 
        style={{ width: `${listWidth}px`, minWidth: `${listWidth}px` }}
      >
        <EmailList 
          emails={emails}
          onSelectEmail={setSelectedEmail} 
          selectedEmail={selectedEmail}
        />
      </div>

      {/* Resize Handle */}
      <div
        className={`
          w-1 hover:w-2 bg-transparent hover:bg-red-500 cursor-col-resize
          relative group transition-all duration-150
          ${isResizing ? 'w-2 bg-red-500' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-2 right-2" />
      </div>
      
      <div className="flex-1 dark:bg-gray-900">
        <EmailViewer email={selectedEmail} />
      </div>
    </div>
  );
};

export default MainLayout; 