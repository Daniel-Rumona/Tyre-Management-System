'use client'

import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import {
  DatabaseOutlined,
  ToolOutlined,
  FileSearchOutlined,
  WarningOutlined
} from '@ant-design/icons'
import type { StatisticProps } from 'antd'
import CountUp from 'react-countup'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

const formatter: StatisticProps['formatter'] = value => (
  <CountUp end={value as number} separator=',' />
)

interface Tyre {
  brand: string
  status: string
  failureReason?: string
  createdAt: Timestamp
  removeDate?: string
}
interface Machine {}
interface Inspection {
  date: string
}

export default function AdminDashboard () {
  const [loading, setLoading] = useState(true)
  const [tyres, setTyres] = useState<Tyre[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [inspections, setInspections] = useState<Inspection[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [tyreSnap, machineSnap, inspSnap] = await Promise.all([
        getDocs(collection(db, 'tyres')),
        getDocs(collection(db, 'machines')),
        getDocs(collection(db, 'inspections'))
      ])
      setTyres(tyreSnap.docs.map(d => d.data() as Tyre))
      setMachines(machineSnap.docs.map(d => d.data() as Machine))
      setInspections(inspSnap.docs.map(d => d.data() as Inspection))
      setLoading(false)
    }
    fetchData()
  }, [])

  // Metrics
  const totalTyres = tyres.length
  const totalMachines = machines.length
  const thisMonthInspections = inspections.filter(i => {
    const d = new Date(i.date)
    const now = new Date()
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    )
  }).length
  const scrapRate = totalTyres
    ? (tyres.filter(t => t.status === 'Scrapped').length / totalTyres) * 100
    : 0

  const stats = [
    {
      title: 'Total Tyres',
      value: totalTyres,
      icon: <DatabaseOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Machines Tracked',
      value: totalMachines,
      icon: <ToolOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Inspections This Month',
      value: thisMonthInspections,
      icon: <FileSearchOutlined style={{ color: '#faad14' }} />,
      color: '#faad14'
    },
    {
      title: 'Scrap Rate (%)',
      value: parseFloat(scrapRate.toFixed(1)),
      icon: <WarningOutlined style={{ color: '#f5222d' }} />,
      color: '#f5222d'
    }
  ]

  // Chart 1: Avg lifespan by brand
  const byBrand: Record<string, number[]> = {}
  tyres.forEach(t => {
    const created = t.createdAt.toDate().getTime()
    const removed = t.removeDate ? new Date(t.removeDate).getTime() : null
    if (removed) {
      const hours = (removed - created) / 36e5
      byBrand[t.brand] = byBrand[t.brand] || []
      byBrand[t.brand].push(hours)
    }
  })
  const lifespanBrands = Object.keys(byBrand)
  const lifespanData = lifespanBrands.map(b =>
    Math.round(byBrand[b].reduce((a, v) => a + v, 0) / byBrand[b].length)
  )

  const tyreLifespanChart = {
    chart: {
      type: 'column',
      animation: { duration: 1500, easing: 'easeOutBounce' }
    },
    title: { text: 'Average Tyre Lifespan by Brand' },
    xAxis: { categories: lifespanBrands },
    yAxis: { title: { text: 'Lifespan (Hours)' }, min: 0 },
    plotOptions: {
      column: {
        dataLabels: { enabled: true },
        animation: { duration: 1500, easing: 'easeOutBounce' }
      }
    },
    series: [{ name: 'Hours', data: lifespanData }]
  }

  // Chart 2: Failure reasons pie
  const reasonCounts: Record<string, number> = {}
  tyres.forEach(t => {
    if (t.failureReason)
      reasonCounts[t.failureReason] = (reasonCounts[t.failureReason] || 0) + 1
  })
  const failureReasonsData = Object.entries(reasonCounts).map(([name, y]) => ({
    name,
    y
  }))

  const failureReasonsChart = {
    chart: {
      type: 'pie',
      animation: { duration: 1200, easing: 'easeOutQuart' }
    },
    title: { text: 'Tyre Failure Reasons' },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: { enabled: true, format: '{point.name}: {point.y}' },
        animation: { duration: 1200, easing: 'easeOutQuart' }
      }
    },
    series: [{ name: 'Failures', colorByPoint: true, data: failureReasonsData }]
  }

  return (
    <>
      {/* Metrics */}
      <Row gutter={[16, 16]}>
        {stats.map(s => (
          <Col key={s.title} xs={24} sm={12} md={6}>
            <Card loading={loading}>
              <Statistic
                title={s.title}
                value={s.value}
                prefix={s.icon}
                valueStyle={{ color: s.color }}
                formatter={formatter}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className='mt-6'>
        <Col xs={24} md={12}>
          <Card loading={loading}>
            <HighchartsReact
              highcharts={Highcharts}
              options={tyreLifespanChart}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card loading={loading}>
            <HighchartsReact
              highcharts={Highcharts}
              options={failureReasonsChart}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
