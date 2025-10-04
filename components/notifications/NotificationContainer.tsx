'use client'

import { useNotifications } from '@/hooks/useNotifications'

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

const NotificationItem = ({ notification, onClose }: { 
  notification: { 
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
  }, 
  onClose: () => void 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600'
        }
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        }
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 transform translate-x-0 opacity-100 ${styles.bg}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className={`text-lg ${styles.icon}`}>{getIcon()}</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.text}`}>
            {notification.title}
          </h3>
          <p className={`mt-1 text-sm ${styles.text}`}>
            {notification.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className={`inline-flex rounded-md p-1.5 ${styles.text} hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600`}
          >
            <span className="sr-only">Fermer</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
