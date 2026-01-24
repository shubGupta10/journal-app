'use client'; // This component needs client-side interactivity

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react'; // Assuming NextAuth.js for client-side logout

// Assuming basic styling or existing UI components for buttons/modals.
// For demonstration, simple HTML elements with Tailwind-like classes are used.

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Handles the account deletion process after user confirmation.
   */
  const handleDeleteAccount = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
    setIsDeleting(true); // Set loading state

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account.');
      }

      setSuccessMessage('Account deleted successfully. Redirecting...');
      // Log out the user from the client side and redirect to the homepage.
      // signOut handles clearing the session cookie and redirection.
      await signOut({ callbackUrl: '/' });

    } catch (err: any) {
      console.error('Frontend: Error deleting account:', err);
      setError(err.message || 'An unexpected error occurred during deletion.');
    } finally {
      setIsDeleting(false); // Reset loading state
      setShowDeleteConfirmation(false); // Close the confirmation modal
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      {/* ... Existing profile settings content would go here ... */}

      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your account is a permanent action and cannot be undone. All your data,
          including journal entries and streaks, will be irrevocably removed.
        </p>
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete Account
        </button>

        {/* Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h4 className="text-lg font-bold mb-4 text-red-700">Confirm Account Deletion</h4>
              <p className="mb-4 text-gray-700">
                Are you absolutely sure you want to delete your account? This action is irreversible.
                All your personal data, journal entries, and streaks will be permanently erased.
              </p>
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {successMessage && <p className="text-green-500 text-sm mb-2">{successMessage}</p>}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;