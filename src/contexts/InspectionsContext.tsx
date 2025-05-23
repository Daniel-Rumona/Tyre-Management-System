'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import { useUser } from './UserContext'

// Define the inspection structure
export interface Inspection {
  id: string
  date: string
  tyreId: string
  tyreSerial: string
  vehicleId: string
  position: string
  treadDepth: number
  pressure: number
  condition: 'Good' | 'Fair' | 'Poor'
  issues?: string[]
  inspectedBy: string
  site?: string
  notes?: string
  timestamp: Timestamp
}

interface InspectionsContextType {
  inspections: Inspection[]
  loading: boolean
  refreshInspections: () => Promise<void>
  getTyreInspectionHistory: (tyreId: string) => Promise<Inspection[]>
}

// Create the context
const InspectionsContext = createContext<InspectionsContextType | undefined>(
  undefined
)

// Provider component
export const InspectionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const { userData } = useUser()

  // Function to fetch inspections from Firestore
  const fetchInspections = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would filter inspections based on user role and site
      const inspectionsQuery = query(
        collection(db, 'inspections'),
        orderBy('timestamp', 'desc')
      )
      const snapshot = await getDocs(inspectionsQuery)

      const fetchedInspections = snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data()
          } as Inspection)
      )

      setInspections(fetchedInspections)
    } catch (error) {
      console.error('Error fetching inspections:', error)
      // For demo purposes, set sample data if fetch fails
      setInspections(sampleInspections)
    } finally {
      setLoading(false)
    }
  }

  // Fetch inspections when the component mounts or when user data changes
  useEffect(() => {
    if (userData) {
      fetchInspections()
    }
  }, [userData])

  // Function to refresh inspections
  const refreshInspections = async () => {
    await fetchInspections()
  }

  // Function to get inspection history for a specific tyre
  const getTyreInspectionHistory = async (
    tyreId: string
  ): Promise<Inspection[]> => {
    // In a real implementation, this would fetch from Firestore
    // For now, filter from the current state
    return inspections
      .filter(inspection => inspection.tyreId === tyreId)
      .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
  }

  // Provide the context value
  return (
    <InspectionsContext.Provider
      value={{
        inspections,
        loading,
        refreshInspections,
        getTyreInspectionHistory
      }}
    >
      {children}
    </InspectionsContext.Provider>
  )
}

// Hook for using the context
export const useInspections = () => {
  const context = useContext(InspectionsContext)
  if (context === undefined) {
    throw new Error('useInspections must be used within an InspectionsProvider')
  }
  return context
}

// Sample inspection data for development/testing
const sampleInspections: Inspection[] = [
  {
    id: 'insp1',
    date: '2023-11-13',
    tyreId: 'T001',
    tyreSerial: 'SER-001',
    vehicleId: 'IBL001',
    position: 'Left Front',
    treadDepth: 12.5,
    pressure: 105,
    condition: 'Good',
    inspectedBy: 'John Smith',
    site: 'North Pit',
    timestamp: Timestamp.fromDate(new Date('2023-11-13'))
  },
  {
    id: 'insp2',
    date: '2023-11-09',
    tyreId: 'T002',
    tyreSerial: 'SER-002',
    vehicleId: 'IBL002',
    position: 'Right Rear',
    treadDepth: 8.2,
    pressure: 98,
    condition: 'Fair',
    issues: ['Minor cuts'],
    inspectedBy: 'James Wilson',
    site: 'South Pit',
    notes: 'Monitor cuts on next inspection',
    timestamp: Timestamp.fromDate(new Date('2023-11-09'))
  },
  {
    id: 'insp3',
    date: '2023-11-03',
    tyreId: 'T003',
    tyreSerial: 'SER-003',
    vehicleId: 'IDL001',
    position: 'Right Front',
    treadDepth: 5.7,
    pressure: 92,
    condition: 'Poor',
    issues: ['Significant wear', 'Uneven wear pattern'],
    inspectedBy: 'Elizabeth Johnson',
    site: 'Main Workshop',
    notes: 'Recommend replacement within 2 weeks',
    timestamp: Timestamp.fromDate(new Date('2023-11-03'))
  },
  {
    id: 'insp4',
    date: '2023-10-27',
    tyreId: 'T004',
    tyreSerial: 'SER-004',
    vehicleId: 'IBL003',
    position: 'Left Rear',
    treadDepth: 10.3,
    pressure: 102,
    condition: 'Good',
    inspectedBy: 'Robert Brown',
    site: 'North Pit',
    timestamp: Timestamp.fromDate(new Date('2023-10-27'))
  },
  {
    id: 'insp5',
    date: '2023-10-14',
    tyreId: 'T005',
    tyreSerial: 'SER-005',
    vehicleId: 'IDL002',
    position: 'Spare',
    treadDepth: 14.2,
    pressure: 108,
    condition: 'Good',
    inspectedBy: 'Sarah Davis',
    site: 'South Pit',
    timestamp: Timestamp.fromDate(new Date('2023-10-14'))
  }
]
