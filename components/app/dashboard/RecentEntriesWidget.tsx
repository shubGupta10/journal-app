'use client';

import React, { useEffect, useState } from 'react';
import { IJournalEntry } from '@/types'; // Assuming IJournalEntry is defined in types.d.ts

const RecentEntriesWidget: React.FC = () => {
  const [entries, setEntries] = useState<IJournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const response = await fetch('/api/entries/get-entries');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEntries(data.entries);
      } catch (err) {
        setError('Failed to load recent entries.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEntries();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Journal Entries</h2>
        <p>Loading entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-red-600">
        <h2 className="text-xl font-semibold mb-4">Recent Journal Entries</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Journal Entries</h2>
      {entries.length === 0 ? (
        <p className="text-gray-600">No recent entries found. Start journaling!</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry._id} className="border-b border-gray-200 pb-3 last:border-b-0">
              <p className="text-sm text-gray-500">
                {new Date(entry.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-800 line-clamp-2">{entry.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentEntriesWidget;