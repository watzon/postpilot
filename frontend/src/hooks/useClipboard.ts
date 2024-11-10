import { useState } from 'react';
import toast from 'react-hot-toast';

interface UseClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  timeout?: number;
}

export const useClipboard = (options: UseClipboardOptions = {}) => {
  const [copied, setCopied] = useState(false);
  
  const {
    successMessage = 'Copied to clipboard',
    errorMessage = 'Failed to copy to clipboard',
    timeout = 2000
  } = options;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      
      if (timeout) {
        setTimeout(() => setCopied(false), timeout);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error(errorMessage);
    }
  };

  return { copyToClipboard, copied };
}; 