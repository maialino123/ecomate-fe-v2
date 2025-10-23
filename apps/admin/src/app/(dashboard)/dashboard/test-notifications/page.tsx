'use client'

import { useNotificationStore } from '@workspace/lib/stores'
import { Button } from '@workspace/ui/components/Button'

export default function TestNotificationsPage() {
    const { success, error, warning, info, notifications } = useNotificationStore()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Test Notifications</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Test the notification system</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <h3 className="text-lg font-semibold mb-4">Trigger Notifications</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button onClick={() => success('This is a success message!', 'Success')} variant="default">
                        Success Toast
                    </Button>

                    <Button onClick={() => error('This is an error message!', 'Error')} variant="destructive">
                        Error Toast
                    </Button>

                    <Button onClick={() => warning('This is a warning message!', 'Warning')} variant="outline">
                        Warning Toast
                    </Button>

                    <Button onClick={() => info('This is an info message!', 'Info')} variant="secondary">
                        Info Toast
                    </Button>
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Current Notifications:</h4>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-xs overflow-auto">
                        {JSON.stringify(notifications, null, 2)}
                    </pre>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        💡 Tip: Notifications should appear in the top-right corner and auto-dismiss after 5 seconds. If
                        you don't see them, check the browser console for errors.
                    </p>
                </div>
            </div>
        </div>
    )
}
