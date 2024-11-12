import React from 'react';
import { Email } from '../../types/email';
import EmailListItem from './EmailListItem';
import { GetEmails, ClearEmails } from '../../../wailsjs/go/main/App';
import SettingsModal from '../Settings/SettingsModal';
import { Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../../hooks/useSettings';
import toast from 'react-hot-toast';
import { EventsOn } from '../../../wailsjs/runtime/runtime';
import Logo from '../../assets/images/logo.svg';

interface EmailListProps {
    emails: Email[];
    onSelectEmail: (email: Email) => void;
    selectedEmail?: Email | null;
}

const EmailList: React.FC<EmailListProps> = ({ emails, onSelectEmail, selectedEmail }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const { settings } = useSettings();

    const [showClearConfirm, setShowClearConfirm] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = EventsOn('emails:cleared', () => {
            toast.success('All emails cleared');
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleClearEmails = async () => {
        try {
            await ClearEmails();
            setShowClearConfirm(false);
        } catch (error) {
            console.error('Failed to clear emails:', error);
            toast.error('Failed to clear emails');
        }
    };

    const filteredEmails = emails.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <img src={Logo} alt="PostPilot" className="h-8 w-8" />
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">PostPilot</h1>
                </div>
            </div>

            <div className="px-2 py-6 border-b border-gray-200 dark:border-gray-700">
                <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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

            <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-between items-center">
                <div className="flex items-center">
                    {emails.length > 0 && (
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Clear all emails"
                        >
                            <TrashIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Settings"
                >
                    <Cog6ToothIcon className="w-6 h-6" />
                </button>
            </div>

            {showClearConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-40">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Clear all emails?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            This action cannot be undone. All emails will be permanently deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearEmails}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
};

export default EmailList;