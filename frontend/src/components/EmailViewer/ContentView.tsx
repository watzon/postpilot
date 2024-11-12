import React from 'react';
import { Email } from '../../types/email';
import { BrowserOpenURL } from '../../../wailsjs/runtime/runtime';

interface ContentViewProps {
  email: Email;
}

const ContentView: React.FC<ContentViewProps> = ({ email }) => {
  const handleLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        BrowserOpenURL(href);
      }
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-900">
        <div className="px-6 py-4 space-y-2">
          <div className="grid grid-cols-[4rem_1fr]">
            <span className="font-medium dark:text-gray-300">From:</span>
            <span className="dark:text-gray-200">{email.from}</span>
          </div>
          <div className="grid grid-cols-[4rem_1fr]">
            <span className="font-medium dark:text-gray-300">To:</span>
            <span className="dark:text-gray-200">{email.to.join(', ')}</span>
          </div>
          {email.cc && email.cc.length > 0 && (
            <div className="grid grid-cols-[4rem_1fr]">
              <span className="font-medium dark:text-gray-300">Cc:</span>
              <span className="dark:text-gray-200">{email.cc.join(', ')}</span>
            </div>
          )}
          {email.replyTo && (
            <div className="grid grid-cols-[4rem_1fr]">
              <span className="font-medium dark:text-gray-300">Reply-To:</span>
              <span className="dark:text-gray-200">{email.replyTo}</span>
            </div>
          )}
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700"></div>
      </div>
      <div 
        className="prose dark:prose-invert max-w-none px-6 py-4"
        dangerouslySetInnerHTML={{ __html: email.html }}
        onClick={handleLinkClick}
      />
    </div>
  );
};

export default ContentView; 