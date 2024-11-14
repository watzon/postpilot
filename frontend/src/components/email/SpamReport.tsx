import { useState } from 'react';
import { SpamReport as SpamReportType } from '../../types/spam';
import { CheckSpam } from '../../../wailsjs/go/main/App';

interface Props {
  emailId: string;
}

export function SpamReport({ emailId }: Props) {
  const [report, setReport] = useState<SpamReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckSpam = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await CheckSpam(emailId);
      setReport(result);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return 'text-red-500';
    if (score >= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!report && !loading && !error) {
    return (
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCheckSpam}
          disabled={loading}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check for Spam
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Checking for spam...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-red-500 dark:text-red-400">
          Error checking spam: {error}
        </div>
        <button
          onClick={handleCheckSpam}
          className="self-start px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Spam Analysis
          </h3>
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
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          SpamAssassin analysis results
        </p>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Score:</span>
            <span className={`text-sm font-medium ${getScoreColor(report.score)}`}>
              {report.score.toFixed(1)} / {report.threshold.toFixed(1)}
            </span>
          </div>

          {report.rules.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Matched Rules:</h4>
              <div className="space-y-2">
                {report.rules.map((rule) => (
                  <div
                    key={rule.name}
                    className="text-sm border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{rule.name}</span>
                      <span className={`font-medium ${getScoreColor(rule.score)}`}>
                        {rule.score > 0 ? '+' : ''}{rule.score.toFixed(1)}
                      </span>
                    </div>
                    {rule.description && (
                      <p className="mt-1 text-gray-500 dark:text-gray-400">{rule.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleCheckSpam}
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Recheck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
