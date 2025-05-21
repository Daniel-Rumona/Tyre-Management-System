'use client'

import React, { useState, useRef } from 'react'
import { Row, Col, Card, Statistic, Button, Spin, message } from 'antd'
import {
  DollarOutlined,
  TagsOutlined,
  WarningOutlined,
  FilePdfOutlined
} from '@ant-design/icons'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import html2pdf from 'html2pdf.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import type { StatisticProps } from 'antd'
import CountUp from 'react-countup'

// Re-export the Tyre type so page.tsx can import it
export type TyreWithId = { id: string } & Record<string, any>

const formatter: StatisticProps['formatter'] = value => (
  <CountUp end={value as number} separator=',' />
)

interface Props {
  initialTyres: TyreWithId[]
}

export default function SupplierReportClient ({ initialTyres }: Props) {
  const [tyres] = useState(initialTyres)
  const [loading, setLoading] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Compute metrics
  const spendBySupplier = tyres.reduce<Record<string, number>>((acc, t) => {
    const s = t.supplier || 'Unknown'
    acc[s] = (acc[s] || 0) + (t.cost || 0)
    return acc
  }, {})

  const scrapData = tyres.reduce<
    Record<string, { total: number; scrapped: number }>
  >((acc, t) => {
    const s = t.supplier || 'Unknown'
    if (!acc[s]) acc[s] = { total: 0, scrapped: 0 }
    acc[s].total++
    if (t.status === 'Scrapped') acc[s].scrapped++
    return acc
  }, {})

  const topSupplier =
    Object.entries(spendBySupplier).sort(([, a], [, b]) => b - a)[0]?.[0] ??
    'N/A'
  const totalSpend = Object.values(spendBySupplier).reduce((a, b) => a + b, 0)
  const highestScrapRateSupplier =
    Object.entries(scrapData)
      .map(([s, d]) => ({ supplier: s, rate: (d.scrapped / d.total) * 100 }))
      .sort((a, b) => b.rate - a.rate)[0]?.supplier ?? 'N/A'

  const chartOptions = {
    title: { text: 'Total Spend by Supplier' },
    xAxis: { categories: Object.keys(spendBySupplier) },
    yAxis: {
      title: { text: 'Spend (R)' },
      labels: {
        formatter () {
          const v = this.value as number
          return v >= 1e6
            ? `R ${(v / 1e6).toFixed(1)}M`
            : v >= 1e3
            ? `R ${(v / 1e3).toFixed(1)}K`
            : `R ${v}`
        }
      }
    },
    series: [
      {
        type: 'column',
        name: 'Spend (R)',
        data: Object.values(spendBySupplier),
        dataLabels: {
          enabled: true,
          formatter () {
            const v = this.y as number
            return v >= 1e6
              ? `R ${(v / 1e6).toFixed(1)}M`
              : v >= 1e3
              ? `R ${(v / 1e3).toFixed(1)}K`
              : `R ${v}`
          }
        }
      }
    ]
  }

  const handleExportPDF = async () => {
    if (!chartRef.current) return

    setLoading(true)
    // @ts-ignore
    await html2pdf()
      .from(chartRef.current)
      .set({
        margin: 0.3,
        filename: 'supplier-performance.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .save()

    await addDoc(collection(db, 'generatedReports'), {
      name: 'Supplier Performance',
      type: 'PDF',
      date: new Date().toISOString().split('T')[0],
      fileUrl: '/exports/supplier-performance.pdf',
      createdAt: serverTimestamp()
    })

    message.success('Report exported and saved successfully.')
    setLoading(false)
  }

  if (loading) return <Spin size='large' />

  return (
    <div className='p-4' ref={chartRef}>
      <Row gutter={16} className='mb-4'>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title='Top Supplier by Spend'
              value={topSupplier}
              prefix={<TagsOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title='Total Spend'
              value={totalSpend}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title='Highest Scrap Rate'
              value={highestScrapRateSupplier}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title='Spend Distribution by Supplier'
        extra={
          <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
            Generate Report
          </Button>
        }
      >
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Card>
    </div>
  )
}
