import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoadmapItem {
  title: string;
  subItems?: string[];
  status: 'completed' | 'in-progress' | 'planned';
  quarter: string;
}

const roadmapData: RoadmapItem[] = [
  {
    title: "Core Platform Features",
    subItems: [
      "Local SMTP server for email testing",
      "Modern, responsive UI",
      "Light/Dark mode support",
      "Preview emails in different formats (HTML, Text, Raw)",
      "Basic search capabilities",
    ],
    status: 'completed',
    quarter: 'Q4 2024',
  },
  {
    title: "Template comparison and management",
    subItems: [
      "Template version control",
      "Side-by-side comparison",
      "Template library management"
    ],
    status: 'in-progress',
    quarter: 'Q4 2024',
  },
  {
    title: "Developer utilities",
    subItems: [
      "Export as cURL command",
      "Multiple format export (EML, MSG)",
      "REST API for programmatic access",
    ],
    status: 'planned',
    quarter: 'Q1 2025',
  },
  {
    title: "Advanced search and filtering",
    subItems: [
      "Date range filtering",
      "Content search",
      "Regular expression support",
    ],
    status: 'planned',
    quarter: 'Q1 2025',
  },
  {
    title: "Email debugging tools",
    subItems: [
      "Rendering process visualization",
      "Compatibility checking",
      "Size breakdown analysis",
    ],
    status: 'planned',
    quarter: 'Q2 2025',
  },
  {
    title: "Email analysis tools",
    subItems: [
      "Spam score checking",
      "Client compatibility validation",
      "Size and content analysis",
    ],
    status: 'planned',
    quarter: 'Q2 2025',
  },
  {
    title: "Performance testing features",
    subItems: [
      "Batch email testing",
      "Delivery timing analysis",
      "Server metrics",
    ],
    status: 'planned',
    quarter: 'Q3 2025',
  },
];

function RoadmapPage() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
      default:
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-8"
        >
          Product Roadmap
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center mb-16 max-w-2xl mx-auto"
        >
          Follow our journey as we build and improve PostPilot. Here's what we're working on and what's coming next.
        </motion.p>

        <div className="relative pt-8">
          {/* Timeline line with gradient - now starts from the first dot */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 rounded-full" 
               style={{
                 top: '-4px', // Aligns with the first dot
                 height: 'calc(100% - 24px)', // Ends at the last box (subtracting some padding)
               }}
          />

          {/* Add first dot above the first box */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(roadmapData[0].status)}`} />
            <div className={`absolute top-0 left-0 w-4 h-4 rounded-full ${getStatusColor(roadmapData[0].status)} animate-ping opacity-75`} />
          </div>

          {roadmapData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative mb-24 ${
                index % 2 === 0 ? 'pr-8 lg:ml-auto lg:pl-24' : 'pl-8 lg:mr-auto lg:pr-24'
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative bg-white rounded-xl shadow-lg p-6 cursor-pointer border border-gray-100 backdrop-blur-sm bg-opacity-90"
                onClick={() => setSelectedItem(selectedItem === index ? null : index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    {item.title}
                  </h3>
                  <span className="px-4 py-1.5 text-sm rounded-full bg-blue-50 text-blue-800 font-medium border border-blue-100">
                    {item.quarter}
                  </span>
                </div>

                <div className="flex items-center mb-4">
                  <span className={`px-4 py-1.5 text-sm rounded-full font-medium ${getStatusBadgeColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>

                <AnimatePresence>
                  {selectedItem === index && item.subItems && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        damping: 30,
                        opacity: { duration: 0.2 }
                      }}
                      className="space-y-3 mt-4 border-t pt-4 overflow-hidden"
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.li
                          key={subIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: subIndex * 0.1 }}
                          className="flex items-start group"
                        >
                          <svg
                            className="h-5 w-5 text-blue-500 mr-3 mt-0.5 transform group-hover:scale-110 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                            {subItem}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Add dot below each box except the last one */}
              {index < roadmapData.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(roadmapData[index + 1].status)}`} />
                  <div className={`absolute top-0 left-0 w-4 h-4 rounded-full ${getStatusColor(roadmapData[index + 1].status)} animate-ping opacity-75`} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;