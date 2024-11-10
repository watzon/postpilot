export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  html: string;
  timestamp: string;
} 