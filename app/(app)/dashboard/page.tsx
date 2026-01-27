import React from 'react';
import DailyQuote from '@/components/app/DailyQuote'; // Assuming this component exists
import RecentEntriesWidget from '@/components/app/dashboard/RecentEntriesWidget';
import StreakProgressWidget from '@/components/app/dashboard/StreakProgressWidget';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Quote - Assuming this is an existing component */}
        <div className="lg:col-span-1">
          <DailyQuote />
        </div>

        {/* Streak Progress Widget */}
        <div className="lg:col-span-1">
          <StreakProgressWidget />
        </div>

        {/* Recent Journal Entries Widget */}
        <div className="md:col-span-2 lg:col-span-1">
          <RecentEntriesWidget />
        </div>

        {/* Add more widgets or sections here as needed */}
        {/* Example: <div className="bg-white p-6 rounded-lg shadow-md">Another Widget</div> */}
      </div>
    </div>
  );
};

export default DashboardPage;