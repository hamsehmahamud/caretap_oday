import React, { useState, useEffect } from 'react';
import RevenueByPayerReport from './reports/RevenueByPayerReport';
import ClientDemographicsReport from './reports/ClientDemographicsReport';
import ServiceUtilizationReport from './reports/ServiceUtilizationReport';
import ProviderCredentialingReport from './reports/ProviderCredentialingReport';
import ClaimDenialAnalysisReport from './reports/ClaimDenialAnalysisReport';
import QuarterlyBusinessReviewReport from './reports/QuarterlyBusinessReviewReport';

const reports = [
  { id: 'revenue', name: 'Revenue by Payer', component: RevenueByPayerReport },
  { id: 'demographics', name: 'Client Demographics', component: ClientDemographicsReport },
  { id: 'utilization', name: 'Service Utilization', component: ServiceUtilizationReport },
  { id: 'credentialing', name: 'Provider Credentialing', component: ProviderCredentialingReport },
  { id: 'denial', name: 'Claim Denial Analysis', component: ClaimDenialAnalysisReport },
  { id: 'qbr', name: 'Quarterly Business Review', component: QuarterlyBusinessReviewReport },
];

const DateRangeFilter: React.FC<{
  initialDateRange: { start: string; end: string };
  onApplyFilter: (range: { start: string; end: string }) => void;
}> = ({ initialDateRange, onApplyFilter }) => {
  const [localDateRange, setLocalDateRange] = useState(initialDateRange);

  useEffect(() => {
    setLocalDateRange(initialDateRange);
  }, [initialDateRange]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDateRange({ ...localDateRange, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onApplyFilter(localDateRange);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
      <div className="w-full sm:w-auto">
        <label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="start"
          value={localDateRange.start}
          onChange={handleDateChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
        <input
          type="date"
          id="endDate"
          name="end"
          value={localDateRange.end}
          onChange={handleDateChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
       <div className="w-full sm:w-auto sm:self-end">
         <button onClick={handleApply} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Apply Filter
         </button>
       </div>
    </div>
  );
};


const Reports: React.FC = () => {
  const [selectedReportId, setSelectedReportId] = useState<string>('revenue');
  const [activeDateRange, setActiveDateRange] = useState({
      start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
  });

  const handleApplyFilter = (newRange: { start: string, end: string }) => {
    setActiveDateRange(newRange);
    alert(`Filter applied. Displaying reports from ${newRange.start} to ${newRange.end}.`);
  };

  const SelectedReport = reports.find(r => r.id === selectedReportId)?.component || (() => <div>Report not found</div>);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="mb-6 border-b pb-6 border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Reports & Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Generate and view detailed reports for your agency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Select a Report</h3>
          <nav className="flex flex-col space-y-2">
            {reports.map(report => (
              <button
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedReportId === report.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {report.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="md:col-span-3">
            <DateRangeFilter initialDateRange={activeDateRange} onApplyFilter={handleApplyFilter} />
            <SelectedReport dateRange={activeDateRange} />
        </div>
      </div>
    </div>
  );
};

export default Reports;