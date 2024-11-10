import React from 'react';
import { Email } from '../../types/email';

interface ContentViewProps {
  email: Email;
}

const ContentView: React.FC<ContentViewProps> = ({ email }) => {
  return (
    <div>
      <div className="bg-white">
        <div className="px-6 py-4">
          <div className="grid grid-cols-[4rem_1fr] mb-2">
            <span className="font-medium">From:</span>
            <span>{email.from}</span>
          </div>
          <div className="grid grid-cols-[4rem_1fr]">
            <span className="font-medium">To:</span>
            <span>{email.to.join(', ')}</span>
          </div>
        </div>
        <div className="border-b border-gray-200"></div>
      </div>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: email.html }}
      />
    </div>
  );
};

export default ContentView; 