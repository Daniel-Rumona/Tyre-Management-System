'use client'

import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official'
import timelineInit from 'highcharts/modules/timeline'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { Spin, Empty } from 'antd'
import Highcharts from 'highcharts'
import TimelineModule from 'highcharts/modules/timeline'

// Load Highcharts Timeline module
if (typeof Highcharts === 'function') TimelineModule(Highcharts)

interface FitmentDoc {
  machineId: string
  position: string
  fitDate: string
  removeDate?: string
  removeReason?: string
}

interface InspectionDoc {
  date: string
  treadDepth: number
  pressure: number
  notes?: string
}

export default function TyreTimeline ({ tyreId }: { tyreId: string }) {
  const [events, setEvents] = useState<
    { name: string; label: string; description: string; date: Date }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tyreId) return

    const fetchAllEvents = async () => {
      setLoading(true)

      const fitSnap = await getDocs(
        query(collection(db, 'fitments'), where('tyreId', '==', tyreId))
      )

      const inspSnap = await getDocs(
        query(collection(db, 'inspections'), where('tyreId', '==', tyreId))
      )

      const eventList: typeof events = []

      // Fitments and removals
      fitSnap.forEach(docSnap => {
        const d = docSnap.data() as FitmentDoc
        eventList.push({
          name: 'Fitted',
          label: d.fitDate,
          description: `Fitted to ${d.machineId} (${d.position})`,
          date: new Date(d.fitDate)
        })
        if (d.removeDate && d.removeReason) {
          eventList.push({
            name: 'Removed',
            label: d.removeDate,
            description: `Removed – ${d.removeReason}`,
            date: new Date(d.removeDate)
          })
        }
      })

      // ⬇️ Inspection Events
      inspSnap.forEach(docSnap => {
        const d = docSnap.data() as InspectionDoc
        const details =
          `Tread: ${d.treadDepth}mm, Pressure: ${d.pressure}psi` +
          (d.notes ? ` — ${d.notes}` : '')
        eventList.push({
          name: 'Inspected',
          label: d.date,
          description: details,
          date: new Date(d.date)
        })
      })

      eventList.sort((a, b) => a.date.getTime() - b.date.getTime())
      setEvents(eventList)
      setLoading(false)
    }

    fetchAllEvents()
  }, [tyreId])

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'timeline',
      backgroundColor: '#fff',
      style: { fontFamily: 'Inter, sans-serif' }
    },
    title: {
      text: '',
      style: { fontSize: '20px', fontWeight: 'bold' }
    },
    xAxis: { type: 'datetime', visible: false },
    yAxis: { visible: false },
    tooltip: {
      backgroundColor: '#fff',
      borderRadius: 6,
      style: { fontSize: '14px' },
      pointFormat: `
    {point.description}<br/>
        <span style="opacity:0.6;">{point.label}</span>
      `
    },
    plotOptions: {
      series: {
        marker: { radius: 8, lineWidth: 1 }
      }
    },
    series: [
      {
        data: events.map(e => ({
          name: e.name,
          label: new Date(e.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          description: e.description,
          x: e.date.getTime(),
          color:
            e.name === 'Fitted'
              ? '#1677ff'
              : e.name === 'Removed'
              ? '#ff4d4f'
              : '#52c41a',
          marker: {
            symbol:
              e.name === 'Fitted'
                ? 'circle'
                : e.name === 'Removed'
                ? 'diamond'
                : 'square',
            fillColor:
              e.name === 'Fitted'
                ? '#1677ff'
                : e.name === 'Removed'
                ? '#ff4d4f'
                : '#52c41a',
            lineColor: '#ffffff',
            lineWidth: 2
          }
        }))
      }
    ]
  }

  if (loading) return <Spin />
  if (!events.length) return <Empty description='No lifecycle history' />

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
}
