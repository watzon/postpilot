import React from 'react';
import { Email } from '../../types/email';
import EmailListItem from './EmailListItem';
import { GetEmails } from '../../../wailsjs/go/main/App';
import SettingsModal from '../Settings/SettingsModal';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../../hooks/useSettings';

interface EmailListProps {
    onSelectEmail: (email: Email) => void;
    selectedEmail?: Email | null;
}

const EmailList: React.FC<EmailListProps> = ({ onSelectEmail, selectedEmail }) => {
    const [emails, setEmails] = React.useState<Email[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const { settings } = useSettings();

    React.useEffect(() => {
        loadEmails();
    }, []);

    const loadEmails = async () => {
        try {
            const emails = await GetEmails();
            setEmails(emails);
        } catch (error) {
            console.error('Failed to load emails:', error);
        }
    };

    const filteredEmails = emails.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex space-between items-center gap-2">
                <img src="/src/assets/images/logo.svg" alt="PostPilot Logo" className="w-10 h-10" />
                <input
                    type="text"
                    placeholder="Search emails..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex-1 overflow-auto">
                {filteredEmails.map((email) => (
                    <EmailListItem
                        key={email.id}
                        email={email}
                        onClick={() => onSelectEmail(email)}
                        showPreview={settings.ui.showPreview}
                        isSelected={selectedEmail?.id === email.id}
                    />
                ))}
            </div>
            <div className="border-t border-gray-200 p-2 flex justify-end">
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                >
                    <Cog6ToothIcon className="w-6 h-6" />
                </button>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
};

export default EmailList;