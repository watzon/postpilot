import React from 'react';
import { Email } from '../../types/email';

interface RawViewProps {
  email: Email;
}

const RawView: React.FC<RawViewProps> = ({ email }) => {
  const raw = `From: ${email.from}
To: ${email.to.join(', ')}
Subject: ${email.subject}
Date: ${new Date(email.timestamp).toUTCString()}

${email.body}`;

  return (
    <div className="p-6">
      <pre className="whitespace-pre-wrap font-mono text-sm">{raw}</pre>
    </div>
  );
};

export default RawView; 