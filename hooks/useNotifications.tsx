'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showInfo: (title: string, message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])

    // Auto-remove after duration
    const duration = notification.duration || 5000
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (title: string, message: string) => {
    addNotification({ type: 'success', title, message })
  }

  const showError = (title: string, message: string) => {
    addNotification({ type: 'error', title, message, duration: 7000 })
  }

  const showWarning = (title: string, message: string) => {
    addNotification({ type: 'warning', title, message })
  }

  const showInfo = (title: string, message: string) => {
    addNotification({ type: 'info', title, message })
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}