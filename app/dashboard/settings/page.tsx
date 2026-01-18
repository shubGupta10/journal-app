'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming a UI library is used

export default function SettingsPage() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch('/api/entries', {
                method: 'DELETE',
            });
            if (response.ok) {
                // Handle success (e.g., show a toast, redirect)
                alert('All entries deleted!');
            } else {
                // Handle error
                alert('Failed to delete entries.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        } finally {
            setIsDeleting(false);
            setShowConfirmModal(false);
        }
    };

    return (
        <div>
            <h1>Settings</h1>
            <Button onClick={() => setShowConfirmModal(true)} variant="destructive">
                Delete All Entries
            </Button>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete ALL your journal entries? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button onClick={() => setShowConfirmModal(false)} variant="outline">Cancel</Button>
                            <Button onClick={handleDeleteAll} variant="destructive" disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete All'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}