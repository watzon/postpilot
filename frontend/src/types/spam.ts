export interface SpamAssassinRule {
  name: string;
  description: string;
  score: number;
}

export interface SpamReport {
  isSpam: boolean;
  score: number;
  threshold: number;
  rules: SpamAssassinRule[];
  rawReport: string;
}

export interface SpamAssassinSettings {
  enabled: boolean;
  binary: string;
  host: string;
  port: number;
  useLocal: boolean;
}
