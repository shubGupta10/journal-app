'use client';

import React, { useEffect, useState } from 'react';
import { IUserStreak } from '@/types'; // Assuming IUserStreak is defined in types.d.ts

const StreakProgressWidget: React.FC = () => {
  const [streak, setStreak] = useState<IUserStreak | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await fetch('/api/user-streak/get-streak');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStreak(data.streak);
      } catch (err) {
        setError('Failed to load streak data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Journaling Streak</h2>
        <p>Loading streak...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-red-600 text-center">
        <h2 className="text-xl font-semibold mb-4">Journaling Streak</h2>
        <p>{error}</p>
      </div>
    );
  }

  const currentStreak = streak?.currentStreak || 0;
  const lastEntryDate = streak?.lastEntryDate ? new Date(streak.lastEntryDate).toLocaleDateString() : 'N/A';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold mb-4">Journaling Streak</h2>
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-5xl font-bold text-indigo-600">{currentStreak}</p>
        <p className="text-lg text-gray-700">day streak!</p>
        {currentStreak > 0 && (
          <p className="text-sm text-gray-500">Last entry: {lastEntryDate}</p>
        )}
        {currentStreak === 0 && (
          <p className="text-sm text-gray-500">Start your streak today!</p>
        )}
      </div>
    </div>
  );
};

export default StreakProgressWidget;