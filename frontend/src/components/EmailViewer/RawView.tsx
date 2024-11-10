import React from 'react';
import { Email } from '../../types/email';

interface RawViewProps {
  email: Email;
}

const RawView: React.FC<RawViewProps> = ({ email }) => {
  const headers = [
    `From: ${email.from}`,
    `To: ${email.to.join(', ')}`,
    email.cc?.length ? `Cc: ${email.cc.join(', ')}` : null,
    email.bcc?.length ? `Bcc: ${email.bcc.join(', ')}` : null,
    email.replyTo ? `Reply-To: ${email.replyTo}` : null,
    `Subject: ${email.subject}`,
    `Date: ${new Date(email.timestamp).toUTCString()}`
  ].filter(Boolean);

  // Add any additional headers
  if (email.headers) {
    for (const [key, values] of Object.entries(email.headers)) {
      headers.push(`${key}: ${values.join(', ')}`);
    }
  }

  const parts = [headers.join('\n')];

  if (email.body) {
    parts.push(
      `Content-Type: text/plain; charset=UTF-8

${email.body}`
    );
  }

  if (email.html) {
    parts.push(
      `Content-Type: text/html; charset=UTF-8

${email.html}`
    );
  }

  const raw = parts.join('\n\n--boundary\n');

  return (
    <div className="p-6">
      <pre className="whitespace-pre-wrap font-mono text-sm dark:text-gray-200">
        {parts.length > 1 ? `Content-Type: multipart/alternative; boundary="boundary"\n\n--boundary\n${raw}\n\n--boundary--` : raw}
      </pre>
    </div>
  );
};

export default RawView; 