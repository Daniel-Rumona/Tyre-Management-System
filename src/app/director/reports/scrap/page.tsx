'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Spin,
  Modal,
  message,
  DatePicker
} from 'antd'
import {
  WarningOutlined,
  FilePdfOutlined,
  PieChartOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import dayjs from 'dayjs'

export default function ScrapReportPage () {
  const [tyres, setTyres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedChart, setExpandedChart] = useState<
    null | 'failure' | 'brand'
  >(null)
  const [dateRange, setDateRange] = useState<[any, any]>([null, null])
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchTyres = async () => {
      const snap = await getDocs(collection(db, 'tyres'))
      const tyres = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTyres(tyres)
      setLoading(false)
    }
    fetchTyres()
  }, [])

  const filteredTyres = tyres.filter(t => {
    if (!dateRange[0] || !dateRange[1]) return true
    const fitDate = t.fitmentDate
      ? dayjs(t.fitmentDate.toDate?.() || t.fitmentDate)
      : null
    return fitDate && fitDate.isBetween(dateRange[0], dateRange[1], 'day', '[]')
  })

  const scrappedTyres = filteredTyres.filter(t => t.status === 'Scrapped')

  const failureCount = scrappedTyres.reduce((acc, t) => {
    const reason = t.failureReason || 'Unknown'
    acc[reason] = (acc[reason] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const brandScrapRate = filteredTyres.reduce((acc, t) => {
    const brand = t.brand || 'Unknown'
    if (!acc[brand]) acc[brand] = { total: 0, scrapped: 0 }
    acc[brand].total++
    if (t.status === 'Scrapped') acc[brand].scrapped++
    return acc
  }, {} as Record<string, { total: number; scrapped: number }>)

  const mostCommonFailure =
    Object.entries(failureCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  const worstBrand =
    Object.entries(brandScrapRate)
      .map(([brand, { total, scrapped }]) => ({
        brand,
        rate: scrapped / total
      }))
      .sort((a, b) => b.rate - a.rate)[0]?.brand || 'N/A'

  const failureChartOptions = {
    title: { text: 'Scrap Count by Failure Reason' },
    xAxis: { categories: Object.keys(failureCount) },
    yAxis: { title: { text: 'Count' } },
    series: [
      {
        type: 'column',
        name: 'Scrap Count',
        data: Object.values(failureCount)
      }
    ]
  }

  const brandChartOptions = {
    chart: { type: 'pie' },
    title: { text: 'Scrap Rate by Brand' },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} scrapped)'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y} ({point.percentage:.1f}%)'
        }
      }
    },
    series: [
      {
        name: 'Scrapped',
        data: Object.entries(brandScrapRate).map(([brand, data]) => ({
          name: brand,
          y: data.scrapped
        }))
      }
    ]
  }

  const handleExport = async () => {
    if (!containerRef.current) return

    // @ts-ignore
    await html2pdf()
      .from(containerRef.current)
      .set({
        margin: 0.3,
        filename: 'scrap-analysis.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .save()

    await addDoc(collection(db, 'generatedReports'), {
      name: 'Scrap Analysis',
      type: 'PDF',
      date: new Date().toISOString().split('T')[0],
      fileUrl: '/exports/scrap-analysis.pdf',
      createdAt: serverTimestamp()
    })

    message.success('Scrap analysis report generated and saved.')
  }

  if (loading) return <Spin size='large' />

  return (
    <div className='p-4' ref={containerRef}>
      <Row gutter={16} className='mb-4'>
        <Col span={8}>
          <Card>
            <Statistic
              title='Most Common Failure'
              value={mostCommonFailure}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title='Total Scrapped Tyres'
              value={scrappedTyres.length}
              prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title='Worst Brand (by Scrap Rate)'
              value={worstBrand}
              prefix={<PieChartOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className='mb-4'>
        <Col span={12}>
          <DatePicker.RangePicker
            className='w-full'
            onChange={dates => setDateRange(dates as [any, any])}
          />
        </Col>
        <Col span={12}>
          <Button
            icon={<FilePdfOutlined />}
            type='primary'
            onClick={handleExport}
            className='w-full'
          >
            Generate Report
          </Button>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title='Scrap by Failure Reason'
            extra={
              <Button onClick={() => setExpandedChart('failure')}>
                Expand
              </Button>
            }
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={failureChartOptions}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title='Scrap Rate by Brand'
            extra={
              <Button onClick={() => setExpandedChart('brand')}>Expand</Button>
            }
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={brandChartOptions}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        open={!!expandedChart}
        onCancel={() => setExpandedChart(null)}
        footer={null}
        width='80%'
        destroyOnClose
      >
        {expandedChart && (
          <HighchartsReact
            key={expandedChart}
            highcharts={Highcharts}
            options={
              expandedChart === 'failure'
                ? failureChartOptions
                : brandChartOptions
            }
          />
        )}
      </Modal>
    </div>
  )
}
