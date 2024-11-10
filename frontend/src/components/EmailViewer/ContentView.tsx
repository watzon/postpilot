import React from 'react';
import { Email } from '../../types/email';

interface ContentViewProps {
  email: Email;
}

const ContentView: React.FC<ContentViewProps> = ({ email }) => {
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
      />
    </div>
  );
};

export default ContentView; 