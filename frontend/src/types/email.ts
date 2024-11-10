export interface Email {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  subject: string;
  body: string;
  html: string;
  timestamp: string;
  headers?: Record<string, string[]>;
  raw?: string;
} 