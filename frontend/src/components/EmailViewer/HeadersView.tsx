import React from 'react';
import { Email } from '../../types/email';

interface HeadersViewProps {
  email: Email;
}

const HeadersView: React.FC<HeadersViewProps> = ({ email }) => {
  const headers = `From: ${email.from}
To: ${email.to.join(', ')}
Subject: ${email.subject}
Date: ${new Date(email.timestamp).toUTCString()}`;

  return (
    <div className="p-6">
      <pre className="whitespace-pre-wrap font-mono text-sm">{headers}</pre>
    </div>
  );
};

export default HeadersView; 