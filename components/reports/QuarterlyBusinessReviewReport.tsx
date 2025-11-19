import React from 'react';

const QbrKpiCard: React.FC<{ label: string; value: string; trend: string, trendColor: string }> = ({ label, value, trend, trendColor }) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border dark:border-gray-700">
    <p className="text-md font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</p>
    <p className={`text-sm font-semibold mt-2 ${trendColor}`}>{trend}</p>
  </div>
);

// Fix: Added dateRange prop to fix type error in Reports.tsx
const QuarterlyBusinessReviewReport: React.FC<{ dateRange: { start: string, end: string } }> = () => {
  return (
    <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in-down">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Quarterly Business Review</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A comprehensive overview of agency performance for the last quarter.</p>
      
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Financial Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QbrKpiCard label="Total Revenue" value="$152,450" trend="+12.5% vs last quarter" trendColor="text-green-600 dark:text-green-400" />
            <QbrKpiCard label="Net Profit" value="$25,890" trend="+8.2% vs last quarter" trendColor="text-green-600 dark:text-green-400" />
            <QbrKpiCard label="Claim Denial Rate" value="4.8%" trend="-1.2% vs last quarter" trendColor="text-green-600 dark:text-green-400" />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Client & Service Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QbrKpiCard label="New Clients" value="28" trend="+5 vs last quarter" trendColor="text-green-600 dark:text-green-400" />
            <QbrKpiCard label="Total Appointments" value="1,850" trend="+210 vs last quarter" trendColor="text-green-600 dark:text-green-400" />
            <QbrKpiCard label="Client Satisfaction" value="96%" trend="-1% vs last quarter" trendColor="text-red-600 dark:text-red-400" />
        </div>
      </div>
       <div className="mt-8 text-center bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">Full Report</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">The complete, detailed Quarterly Business Review document will be available for download here soon.</p>
          <button className="mt-4 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg font-semibold cursor-not-allowed">
            Download PDF (Coming Soon)
          </button>
       </div>
    </div>
  );
};

export default QuarterlyBusinessReviewReport;