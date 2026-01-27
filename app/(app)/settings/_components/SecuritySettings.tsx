// app/(app)/settings/_components/SecuritySettings.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react'; // Assuming NextAuth for signOut

const SecuritySettings: React.FC = () => {
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      // Account deleted successfully, sign out the user and redirect
      await signOut({ callbackUrl: '/' }); // Redirect to home page after sign out
      // router.push('/'); // signOut handles redirection

    } catch (error: any) {
      console.error('Error deleting account:', error);
      setDeleteError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false); // Close confirmation dialog
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Security Settings</h2>

      {/* Existing Security Settings content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-medium mb-4">Password Management</h3>
        {/* ... (existing password change form/logic) ... */}
        <p>Manage your password and other security preferences here.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Change Password
        </button>
      </div>

      {/* NEW: Delete Account Section */}
      <div className="bg-white p-6 rounded-lg shadow border border-red-300">
        <h3 className="text-xl font-medium mb-4 text-red-600">Delete Account</h3>
        <p className="text-gray-700 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete My Account'}
        </button>

        {deleteError && (
          <p className="mt-4 text-red-500">{deleteError}</p>
        )}

        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h4 className="text-xl font-bold mb-4">Confirm Account Deletion</h4>
              <p className="mb-6">
                Are you absolutely sure you want to delete your account? This action is irreversible and will
                permanently remove all your data, including journal entries and streaks.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
