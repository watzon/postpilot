import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabPanelProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex h-[74px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            px-6 h-full font-medium text-center relative
            ${activeTab === tab.id ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}
          `}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="relative top-[2px]">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabPanel; 