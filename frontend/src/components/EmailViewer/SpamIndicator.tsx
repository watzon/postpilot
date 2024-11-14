import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { SpamReport as SpamReportType } from '../../types/spam';
import { useSettings } from '../../hooks/useSettings';
import { CheckSpam } from '../../../wailsjs/go/main/App';

interface SpamIndicatorProps {
  emailId: string;
}

export function SpamIndicator({ emailId }: SpamIndicatorProps) {
  const [report, setReport] = useState<SpamReportType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.spamAssassin.enabled && emailId) {
      checkSpam();
    }
  }, [emailId, settings.spamAssassin.enabled]);

  const checkSpam = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await CheckSpam(emailId);
      setReport(result);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!settings.spamAssassin.enabled || (!report && !isLoading && !error)) {
    return null;
  }

  const getIndicatorColor = () => {
    if (isLoading) return 'bg-gray-400';
    if (error) return 'bg-yellow-500';
    if (!report) return 'bg-gray-400';
    if (report.isSpam) return 'bg-red-500';
    if (report.score >= report.threshold * 0.75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return 'text-red-500 dark:text-red-400';
    if (score >= 3) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative flex items-center group ${isLoading ? 'animate-pulse' : ''}`}
        title={
          isLoading ? 'Checking spam...' :
          error ? 'Error checking spam' :
          report ? `Spam Score: ${report.score.toFixed(1)}/${report.threshold.toFixed(1)}` :
          'Spam status unknown'
        }
      >
        <div className={`w-3 h-3 rounded-full ${getIndicatorColor()}`} />
        {error && (
          <span className="absolute top-0 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                Spam Analysis
              </Dialog.Title>
            </div>

            <div className="px-6 py-4">
              {isLoading && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Checking for spam...
                </div>
              )}

              {error && (
                <div className="flex flex-col space-y-2">
                  <div className="text-sm text-red-500 dark:text-red-400">
                    Error checking spam: {error}
                  </div>
                  <button
                    onClick={checkSpam}
                    className="self-start px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {report && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Status:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.isSpam
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      }`}
                    >
                      {report.isSpam ? 'Spam Detected' : 'Not Spam'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Score:</span>
                    <span className={`text-sm font-medium ${getScoreColor(report.score)}`}>
                      {report.score.toFixed(1)} / {report.threshold.toFixed(1)}
                    </span>
                  </div>

                  {report.rules.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Matched Rules:
                      </h4>
                      <div className="space-y-2">
                        {report.rules.map((rule) => (
                          <div
                            key={rule.name}
                            className="text-sm border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {rule.name}
                              </span>
                              <span className={`font-medium ${getScoreColor(rule.score)}`}>
                                {rule.score > 0 ? '+' : ''}{rule.score.toFixed(1)}
                              </span>
                            </div>
                            {rule.description && (
                              <p className="mt-1 text-gray-500 dark:text-gray-400">
                                {rule.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
