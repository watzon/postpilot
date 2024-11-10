import React from 'react';
import { Email } from '../../types/email';

interface TextViewProps {
  email: Email;
}

const TextView: React.FC<TextViewProps> = ({ email }) => {
  return (
    <div className="p-6">
      <pre className="whitespace-pre-wrap font-mono text-sm">{email.body}</pre>
    </div>
  );
};

export default TextView; 