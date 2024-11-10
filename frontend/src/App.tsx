import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/Layout/MainLayout';
import { SettingsProvider } from './contexts/SettingsContext';
import { GetEmails } from '../wailsjs/go/main/App';
import { EventsOn } from '../wailsjs/runtime/runtime';
import { main } from '../wailsjs/go/models';

function App() {
  const [emails, setEmails] = useState<main.Email[]>([]);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    // Load initial emails
    GetEmails().then(setEmails);

    // Listen for new emails
    const unsubscribeNew = EventsOn('new:email', (email: main.Email) => {
      setEmails(prev => [...prev, email]);
    });

    // Listen for cleared emails
    const unsubscribeClear = EventsOn('emails:cleared', () => {
      setEmails([]);
    });

    // Cleanup listeners
    return () => {
      unsubscribeNew();
      unsubscribeClear();
    };
  }, []);

  return (
    <SettingsProvider>
      <div className={`h-screen bg-white text-gray-900 ${isResizing ? 'select-none' : ''}`}>
        <MainLayout emails={emails} />
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </SettingsProvider>
  );
}

export default App;
