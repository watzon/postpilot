import React from 'react';

interface Tab {
  id: string;
  label: string;
  isAction?: boolean;
  disabled?: boolean;
}

interface TabPanelProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onAction?: (id: string) => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ tabs, activeTab, onTabChange, onAction }) => {
  return (
    <div className="flex h-[72px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          disabled={tab.disabled}
          className={`
            px-6 h-full font-medium text-center relative
            ${tab.disabled 
              ? 'cursor-not-allowed text-gray-300 dark:text-gray-600' 
              : tab.isAction 
                ? 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' 
                : activeTab === tab.id 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }
          `}
          onClick={() => {
            if (!tab.disabled) {
              tab.isAction ? onAction?.(tab.id) : onTabChange(tab.id);
            }
          }}
        >
          <span className="relative top-[2px]">{tab.label}</span>
          {!tab.isAction && !tab.disabled && activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 dark:bg-red-400" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabPanel; 