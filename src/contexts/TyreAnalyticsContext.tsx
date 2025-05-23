'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import { useUser } from './UserContext'
import { useFitmentLogs } from './FitmentLogsContext'
import type { FitmentLog } from './FitmentLogsContext'

// Types for analytics data
export interface TyreCostData {
  machineId: string
  totalCost: number
  tyreCount: number
  averageCost: number
}

export interface TyreLifespanData {
  site: string
  averageLifespanDays: number
  totalTyres: number
}

export interface FailureRateData {
  entityId: string // machineId or tyreType
  totalTyres: number
  failedTyres: number
  failureRate: number
}

export interface FailureReasonData {
  reason: string
  count: number
  percentage: number
}

// New interface for transmission hours data
export interface TransmissionHoursData {
  tyreId: string
  brand: string
  size: string
  machineId: string
  position: string
  initialHours: number
  finalHours: number
  totalHours: number
  originalTreadDepth: number
  remainingTreadDepth: number
  wearMm: number
  costPerHour: number
  hoursPerMm: number
  percentageUsed: number
  valueUsed: number
  valueLost: number
  tyreCost: number
}

interface TyreAnalyticsContextType {
  loading: boolean
  getTyreCostPerMachine: () => Promise<TyreCostData[]>
  getAverageTyreLifespanPerSite: () => Promise<TyreLifespanData[]>
  getFailureRatePerMachine: () => Promise<FailureRateData[]>
  getFailureRatePerTyreType: () => Promise<FailureRateData[]>
  getScrapAnalysisByReason: () => Promise<FailureReasonData[]>
  // New functions for transmission hours
  getTransmissionHoursData: () => Promise<TransmissionHoursData[]>
  getAverageHoursPerMmByBrand: () => Promise<
    { brand: string; hoursPerMm: number }[]
  >
  getAverageHoursPerMmBySize: () => Promise<
    { size: string; hoursPerMm: number }[]
  >
  getAverageCostPerHourByBrand: () => Promise<
    { brand: string; costPerHour: number }[]
  >
  refreshAnalytics: () => Promise<void>
}

const TyreAnalyticsContext = createContext<
  TyreAnalyticsContextType | undefined
>(undefined)

export const TyreAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [loading, setLoading] = useState(true)
  const { userData } = useUser()
  const { logs } = useFitmentLogs()

  // Sample tyre data for development - would be replaced with actual data from Firestore
  const tyreData = {
    costs: [
      { tyreId: 'T001', cost: 2500, machineId: 'M001', tyreType: 'Heavy Duty' },
      { tyreId: 'T002', cost: 1800, machineId: 'M001', tyreType: 'Standard' },
      { tyreId: 'T003', cost: 3200, machineId: 'M002', tyreType: 'Heavy Duty' },
      { tyreId: 'T004', cost: 2000, machineId: 'M003', tyreType: 'Standard' },
      { tyreId: 'T005', cost: 2700, machineId: 'M002', tyreType: 'Premium' }
    ],
    lifespans: [
      { tyreId: 'T001', site: 'North Pit', lifespan: 120 },
      { tyreId: 'T002', site: 'North Pit', lifespan: 90 },
      { tyreId: 'T003', site: 'South Pit', lifespan: 150 },
      { tyreId: 'T004', site: 'Main Workshop', lifespan: 100 },
      { tyreId: 'T005', site: 'South Pit', lifespan: 130 }
    ],
    failures: [
      {
        tyreId: 'T001',
        machineId: 'M001',
        tyreType: 'Heavy Duty',
        failed: false
      },
      {
        tyreId: 'T002',
        machineId: 'M001',
        tyreType: 'Standard',
        failed: true,
        reason: 'Puncture'
      },
      {
        tyreId: 'T003',
        machineId: 'M002',
        tyreType: 'Heavy Duty',
        failed: true,
        reason: 'Sidewall damage'
      },
      {
        tyreId: 'T004',
        machineId: 'M003',
        tyreType: 'Standard',
        failed: false
      },
      {
        tyreId: 'T005',
        machineId: 'M002',
        tyreType: 'Premium',
        failed: true,
        reason: 'Tread wear'
      },
      {
        tyreId: 'T006',
        machineId: 'M001',
        tyreType: 'Standard',
        failed: true,
        reason: 'Puncture'
      },
      {
        tyreId: 'T007',
        machineId: 'M003',
        tyreType: 'Heavy Duty',
        failed: false
      },
      {
        tyreId: 'T008',
        machineId: 'M002',
        tyreType: 'Premium',
        failed: true,
        reason: 'Sidewall damage'
      },
      {
        tyreId: 'T009',
        machineId: 'M001',
        tyreType: 'Standard',
        failed: false
      },
      {
        tyreId: 'T010',
        machineId: 'M003',
        tyreType: 'Heavy Duty',
        failed: true,
        reason: 'Tread wear'
      }
    ],
    // Sample transmission hours data
    transmissionHours: [
      {
        tyreId: 'T001',
        brand: 'Bridgestone',
        size: '26.5R25',
        machineId: 'IBL001',
        position: 'Left Front',
        initialHours: 12450,
        finalHours: 14250,
        originalTreadDepth: 55,
        remainingTreadDepth: 25,
        tyreCost: 24500
      },
      {
        tyreId: 'T002',
        brand: 'Michelin',
        size: '26.5R25',
        machineId: 'IBL002',
        position: 'Right Front',
        initialHours: 8720,
        finalHours: 10980,
        originalTreadDepth: 58,
        remainingTreadDepth: 18,
        tyreCost: 26800
      },
      {
        tyreId: 'T003',
        brand: 'Apollo',
        size: '17.5R25',
        machineId: 'IDL001',
        position: 'Left Rear',
        initialHours: 5230,
        finalHours: 7450,
        originalTreadDepth: 48,
        remainingTreadDepth: 22,
        tyreCost: 18500
      },
      {
        tyreId: 'T004',
        brand: 'Bridgestone',
        size: '17.5R25',
        machineId: 'IDL002',
        position: 'Right Rear',
        initialHours: 9840,
        finalHours: 11570,
        originalTreadDepth: 55,
        remainingTreadDepth: 34,
        tyreCost: 19200
      },
      {
        tyreId: 'T005',
        brand: 'Michelin',
        size: '445-65R22.5',
        machineId: 'IBL003',
        position: 'Spare',
        initialHours: 3450,
        finalHours: 5890,
        originalTreadDepth: 52,
        remainingTreadDepth: 11,
        tyreCost: 22750
      },
      {
        tyreId: 'T006',
        brand: 'Apollo',
        size: '12.00R20',
        machineId: 'IDL003',
        position: 'Left Front',
        initialHours: 7820,
        finalHours: 9150,
        originalTreadDepth: 45,
        remainingTreadDepth: 28,
        tyreCost: 16200
      },
      {
        tyreId: 'T007',
        brand: 'Bridgestone',
        size: '12.00R24',
        machineId: 'IBL004',
        position: 'Right Front',
        initialHours: 6540,
        finalHours: 8970,
        originalTreadDepth: 50,
        remainingTreadDepth: 15,
        tyreCost: 21400
      },
      {
        tyreId: 'T008',
        brand: 'Michelin',
        size: '26.5R25',
        machineId: 'IDL004',
        position: 'Left Rear',
        initialHours: 10240,
        finalHours: 12780,
        originalTreadDepth: 58,
        remainingTreadDepth: 20,
        tyreCost: 26500
      }
    ]
  }

  useEffect(() => {
    if (userData) {
      setLoading(false)
    }
  }, [userData])

  // Calculate tyre cost per machine
  const getTyreCostPerMachine = async (): Promise<TyreCostData[]> => {
    // In a real implementation, this would fetch data from Firestore
    // For now, use the sample data
    const costData = tyreData.costs.reduce(
      (acc: Record<string, TyreCostData>, item) => {
        if (!acc[item.machineId]) {
          acc[item.machineId] = {
            machineId: item.machineId,
            totalCost: 0,
            tyreCount: 0,
            averageCost: 0
          }
        }

        acc[item.machineId].totalCost += item.cost
        acc[item.machineId].tyreCount += 1
        acc[item.machineId].averageCost =
          acc[item.machineId].totalCost / acc[item.machineId].tyreCount

        return acc
      },
      {}
    )

    return Object.values(costData)
  }

  // Calculate average tyre lifespan per site
  const getAverageTyreLifespanPerSite = async (): Promise<
    TyreLifespanData[]
  > => {
    // In a real implementation, this would calculate based on fitment and removal dates
    const lifespanData = tyreData.lifespans.reduce(
      (acc: Record<string, TyreLifespanData>, item) => {
        if (!acc[item.site]) {
          acc[item.site] = {
            site: item.site,
            averageLifespanDays: 0,
            totalTyres: 0
          }
        }

        // Update the total and count for average calculation
        const current = acc[item.site]
        const newTotal =
          current.averageLifespanDays * current.totalTyres + item.lifespan
        current.totalTyres += 1
        current.averageLifespanDays = newTotal / current.totalTyres

        return acc
      },
      {}
    )

    return Object.values(lifespanData)
  }

  // Calculate failure rate per machine
  const getFailureRatePerMachine = async (): Promise<FailureRateData[]> => {
    const failureData = tyreData.failures.reduce(
      (acc: Record<string, FailureRateData>, item) => {
        if (!acc[item.machineId]) {
          acc[item.machineId] = {
            entityId: item.machineId,
            totalTyres: 0,
            failedTyres: 0,
            failureRate: 0
          }
        }

        acc[item.machineId].totalTyres += 1
        if (item.failed) {
          acc[item.machineId].failedTyres += 1
        }

        acc[item.machineId].failureRate =
          acc[item.machineId].failedTyres / acc[item.machineId].totalTyres

        return acc
      },
      {}
    )

    return Object.values(failureData)
  }

  // Calculate failure rate per tyre type
  const getFailureRatePerTyreType = async (): Promise<FailureRateData[]> => {
    const failureData = tyreData.failures.reduce(
      (acc: Record<string, FailureRateData>, item) => {
        if (!acc[item.tyreType]) {
          acc[item.tyreType] = {
            entityId: item.tyreType,
            totalTyres: 0,
            failedTyres: 0,
            failureRate: 0
          }
        }

        acc[item.tyreType].totalTyres += 1
        if (item.failed) {
          acc[item.tyreType].failedTyres += 1
        }

        acc[item.tyreType].failureRate =
          acc[item.tyreType].failedTyres / acc[item.tyreType].totalTyres

        return acc
      },
      {}
    )

    return Object.values(failureData)
  }

  // Get scrap analysis by failure reason
  const getScrapAnalysisByReason = async (): Promise<FailureReasonData[]> => {
    const failedTyres = tyreData.failures.filter(t => t.failed)
    const totalFailures = failedTyres.length

    const reasonsData = failedTyres.reduce(
      (acc: Record<string, FailureReasonData>, item) => {
        const reason = item.reason || 'Unknown'

        if (!acc[reason]) {
          acc[reason] = {
            reason,
            count: 0,
            percentage: 0
          }
        }

        acc[reason].count += 1
        acc[reason].percentage = (acc[reason].count / totalFailures) * 100

        return acc
      },
      {}
    )

    return Object.values(reasonsData)
  }

  // Get transmission hours data with calculated metrics
  const getTransmissionHoursData = async (): Promise<
    TransmissionHoursData[]
  > => {
    return tyreData.transmissionHours.map(item => {
      // Calculate derived metrics
      const totalHours = item.finalHours - item.initialHours
      const wearMm = item.originalTreadDepth - item.remainingTreadDepth
      const costPerHour = item.tyreCost / totalHours
      const hoursPerMm = wearMm > 0 ? totalHours / wearMm : 0
      const percentageUsed = (wearMm / item.originalTreadDepth) * 100
      const valueUsed = item.tyreCost * (percentageUsed / 100)
      const valueLost = item.tyreCost - valueUsed

      return {
        ...item,
        totalHours,
        wearMm,
        costPerHour,
        hoursPerMm,
        percentageUsed,
        valueUsed,
        valueLost
      }
    })
  }

  // Get average hours per mm by brand
  const getAverageHoursPerMmByBrand = async (): Promise<
    { brand: string; hoursPerMm: number }[]
  > => {
    const data = await getTransmissionHoursData()

    const brandStats = data.reduce(
      (
        acc: Record<string, { totalHoursPerMm: number; count: number }>,
        item
      ) => {
        if (!acc[item.brand]) {
          acc[item.brand] = { totalHoursPerMm: 0, count: 0 }
        }

        if (item.hoursPerMm > 0) {
          // Avoid including invalid data
          acc[item.brand].totalHoursPerMm += item.hoursPerMm
          acc[item.brand].count += 1
        }

        return acc
      },
      {}
    )

    return Object.entries(brandStats).map(([brand, stats]) => ({
      brand,
      hoursPerMm: stats.count > 0 ? stats.totalHoursPerMm / stats.count : 0
    }))
  }

  // Get average hours per mm by size
  const getAverageHoursPerMmBySize = async (): Promise<
    { size: string; hoursPerMm: number }[]
  > => {
    const data = await getTransmissionHoursData()

    const sizeStats = data.reduce(
      (
        acc: Record<string, { totalHoursPerMm: number; count: number }>,
        item
      ) => {
        if (!acc[item.size]) {
          acc[item.size] = { totalHoursPerMm: 0, count: 0 }
        }

        if (item.hoursPerMm > 0) {
          // Avoid including invalid data
          acc[item.size].totalHoursPerMm += item.hoursPerMm
          acc[item.size].count += 1
        }

        return acc
      },
      {}
    )

    return Object.entries(sizeStats).map(([size, stats]) => ({
      size,
      hoursPerMm: stats.count > 0 ? stats.totalHoursPerMm / stats.count : 0
    }))
  }

  // Get average cost per hour by brand
  const getAverageCostPerHourByBrand = async (): Promise<
    { brand: string; costPerHour: number }[]
  > => {
    const data = await getTransmissionHoursData()

    const brandStats = data.reduce(
      (
        acc: Record<string, { totalCostPerHour: number; count: number }>,
        item
      ) => {
        if (!acc[item.brand]) {
          acc[item.brand] = { totalCostPerHour: 0, count: 0 }
        }

        acc[item.brand].totalCostPerHour += item.costPerHour
        acc[item.brand].count += 1

        return acc
      },
      {}
    )

    return Object.entries(brandStats).map(([brand, stats]) => ({
      brand,
      costPerHour: stats.count > 0 ? stats.totalCostPerHour / stats.count : 0
    }))
  }

  const refreshAnalytics = async (): Promise<void> => {
    setLoading(true)
    // In a real implementation, this would refresh data from Firestore
    setLoading(false)
  }

  return (
    <TyreAnalyticsContext.Provider
      value={{
        loading,
        getTyreCostPerMachine,
        getAverageTyreLifespanPerSite,
        getFailureRatePerMachine,
        getFailureRatePerTyreType,
        getScrapAnalysisByReason,
        getTransmissionHoursData,
        getAverageHoursPerMmByBrand,
        getAverageHoursPerMmBySize,
        getAverageCostPerHourByBrand,
        refreshAnalytics
      }}
    >
      {children}
    </TyreAnalyticsContext.Provider>
  )
}

export const useTyreAnalytics = () => {
  const context = useContext(TyreAnalyticsContext)
  if (context === undefined) {
    throw new Error(
      'useTyreAnalytics must be used within a TyreAnalyticsProvider'
    )
  }
  return context
}
