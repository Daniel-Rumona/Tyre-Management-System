'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define types for fitment logs
export interface FitmentLog {
  id: string
  date: string
  operationType: 'Fitment' | 'Removal'
  tyreSerial: string
  tyreId: string
  vehicleId: string
  position: string
  reason?: string
  hoursAtFitment?: number
  hoursAtRemoval?: number
  notes?: string
  performedBy: string
  site?: string
}

// Define context type
interface FitmentLogsContextType {
  logs: FitmentLog[]
  loading: boolean
  error: string | null
  refreshLogs: () => Promise<void>
  addLog: (log: Omit<FitmentLog, 'id'>) => Promise<void>
  updateLog: (id: string, updates: Partial<FitmentLog>) => Promise<void>
  deleteLog: (id: string) => Promise<void>
}

// Create context with default values
const FitmentLogsContext = createContext<FitmentLogsContextType>({
  logs: [],
  loading: false,
  error: null,
  refreshLogs: async () => {},
  addLog: async () => {},
  updateLog: async () => {},
  deleteLog: async () => {}
})

// Sample data for development
const sampleFitmentLogs: FitmentLog[] = [
  {
    id: 'log1',
    date: '2023-11-14',
    operationType: 'Fitment',
    tyreSerial: 'TS-001-2023',
    tyreId: '001',
    vehicleId: 'HD-001',
    position: 'Front Left',
    performedBy: 'John Doe',
    site: 'North Pit',
    notes: 'New tyre installation'
  },
  {
    id: 'log2',
    date: '2023-11-15',
    operationType: 'Removal',
    tyreSerial: 'TS-002-2023',
    tyreId: '002',
    vehicleId: 'HD-002',
    position: 'Rear Right',
    reason: 'Wear and tear',
    performedBy: 'Jane Smith',
    site: 'South Pit',
    notes: 'Tyre reached end of life'
  },
  {
    id: 'log3',
    date: '2023-11-18',
    operationType: 'Fitment',
    tyreSerial: 'TS-003-2023',
    tyreId: '003',
    vehicleId: 'HD-001',
    position: 'Rear Left',
    performedBy: 'John Doe',
    site: 'North Pit',
    hoursAtFitment: 0
  },
  {
    id: 'log4',
    date: '2023-12-01',
    operationType: 'Removal',
    tyreSerial: 'TS-001-2023',
    tyreId: '001',
    vehicleId: 'HD-001',
    position: 'Front Left',
    reason: 'Damage',
    performedBy: 'Jane Smith',
    site: 'North Pit',
    hoursAtRemoval: 2500,
    notes: 'Sidewall puncture'
  },
  {
    id: 'log5',
    date: '2023-12-05',
    operationType: 'Fitment',
    tyreSerial: 'TS-005-2023',
    tyreId: '005',
    vehicleId: 'HD-003',
    position: 'Front Right',
    performedBy: 'Bob Johnson',
    site: 'East Pit'
  }
]

// Provider component
export function FitmentLogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<FitmentLog[]>(sampleFitmentLogs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load logs on initial mount
  useEffect(() => {
    // Initialize with sample data for development
    // In production, you would fetch from an API here
    if (typeof window !== 'undefined') {
      const storedLogs = localStorage.getItem('fitmentLogs')
      if (storedLogs) {
        try {
          setLogs(JSON.parse(storedLogs))
        } catch (err) {
          console.error('Failed to parse stored logs:', err)
          // Fallback to sample data
          setLogs(sampleFitmentLogs)
        }
      } else {
        // Store sample data for initial use
        localStorage.setItem('fitmentLogs', JSON.stringify(sampleFitmentLogs))
      }
    }
  }, [])

  // Function to load or refresh logs
  const refreshLogs = async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, fetch from API
      // For now, use stored data in localStorage
      if (typeof window !== 'undefined') {
        const storedLogs = localStorage.getItem('fitmentLogs')
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs))
        }
      }
    } catch (err) {
      console.error('Failed to fetch fitment logs:', err)
      setError('Failed to load fitment logs')
    } finally {
      setLoading(false)
    }
  }

  // Add a new log
  const addLog = async (log: Omit<FitmentLog, 'id'>) => {
    setLoading(true)
    try {
      const newLog = {
        ...log,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }
      
      const updatedLogs = [...logs, newLog]
      setLogs(updatedLogs)
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fitmentLogs', JSON.stringify(updatedLogs))
      }
    } catch (err) {
      console.error('Failed to add fitment log:', err)
      setError('Failed to add fitment log')
    } finally {
      setLoading(false)
    }
  }

  // Update an existing log
  const updateLog = async (id: string, updates: Partial<FitmentLog>) => {
    setLoading(true)
    try {
      const updatedLogs = logs.map(log => 
        log.id === id ? { ...log, ...updates } : log
      )
      
      setLogs(updatedLogs)
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fitmentLogs', JSON.stringify(updatedLogs))
      }
    } catch (err) {
      console.error('Failed to update fitment log:', err)
      setError('Failed to update fitment log')
    } finally {
      setLoading(false)
    }
  }

  // Delete a log
  const deleteLog = async (id: string) => {
    setLoading(true)
    try {
      const updatedLogs = logs.filter(log => log.id !== id)
      setLogs(updatedLogs)
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('fitmentLogs', JSON.stringify(updatedLogs))
      }
    } catch (err) {
      console.error('Failed to delete fitment log:', err)
      setError('Failed to delete fitment log')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FitmentLogsContext.Provider 
      value={{ 
        logs,
        loading,
        error,
        refreshLogs,
        addLog,
        updateLog,
        deleteLog
      }}
    >
      {children}
    </FitmentLogsContext.Provider>
  )
}

// Custom hook for using this context
export function useFitmentLogs() {
  return useContext(FitmentLogsContext)
} 