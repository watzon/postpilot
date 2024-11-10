import React from 'react';
import { Email } from '../../types/email';
import { useSettings } from '../../hooks/useSettings';

interface EmailListItemProps {
  email: Email;
  onClick: () => void;
  showPreview?: boolean;
  isSelected?: boolean;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ 
  email, 
  onClick, 
  showPreview = false,
  isSelected = false 
}) => {
  const { settings } = useSettings();
  
  const formattedTime = new Date(email.timestamp).toLocaleTimeString([], {
    hour: settings.ui.timeFormat === '12' ? '2-digit' : 'numeric',
    minute: '2-digit',
    hour12: settings.ui.timeFormat === '12'
  });

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 border-b border-gray-200
        ${isSelected 
          ? 'bg-blue-50 hover:bg-blue-100' 
          : 'hover:bg-gray-50'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <span className="font-medium">{email.from}</span>
        <span className="text-sm text-gray-500">{formattedTime}</span>
      </div>
      <div className="text-gray-900">{email.subject}</div>
      {showPreview && (
        <div className="text-sm text-gray-500 truncate mt-1">
          {email.body}
        </div>
      )}
    </button>
  );
};

export default EmailListItem;