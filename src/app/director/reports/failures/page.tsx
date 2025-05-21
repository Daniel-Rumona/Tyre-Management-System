'use client'

import { useEffect, useState, useRef } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  DatePicker,
  Button,
  Modal,
  Spin,
  message
} from 'antd'
import {
  FilePdfOutlined,
  LineChartOutlined,
  WarningOutlined,
  BarChartOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import dayjs from 'dayjs'
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

export default function FailureTrendsReport () {
  const [tyres, setTyres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedChart, setExpandedChart] = useState<
    null | 'timeline' | 'position' | 'type'
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

  const filtered = tyres
    .filter(t => {
      if (!dateRange[0] || !dateRange[1]) return true
      const failureDate = t.removeDate
        ? dayjs(t.removeDate.toDate?.() || t.removeDate)
        : null
      return (
        failureDate &&
        failureDate.isBetween(dateRange[0], dateRange[1], 'day', '[]')
      )
    })
    .filter(t => t.status === 'Scrapped')

  const failureTypes = filtered.reduce((acc, t) => {
    const type = t.failureReason || 'Unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const failuresByMonth = filtered.reduce((acc, t) => {
    const d = t.removeDate
      ? dayjs(t.removeDate.toDate?.() || t.removeDate)
      : null
    const key = d ? d.format('YYYY-MM') : 'Unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const failuresByPosition = filtered.reduce((acc, t) => {
    const pos = t.position || 'Unknown'
    acc[pos] = (acc[pos] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostFrequentType =
    Object.entries(failureTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  const peakMonth =
    Object.entries(failuresByMonth).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  const topPosition =
    Object.entries(failuresByPosition).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    'N/A'

  const timelineChart = {
    title: { text: 'Failures Over Time' },
    xAxis: {
      categories: Object.keys(failuresByMonth),
      title: { text: 'Month' }
    },
    yAxis: { title: { text: 'Failures' } },
    series: [
      {
        type: 'spline',
        name: 'Failures',
        data: Object.values(failuresByMonth)
      }
    ]
  }

  const typeChart = {
    title: { text: 'Failures by Type' },
    xAxis: { categories: Object.keys(failureTypes) },
    yAxis: { title: { text: 'Count' } },
    series: [
      {
        type: 'bar',
        name: 'Count',
        data: Object.values(failureTypes)
      }
    ]
  }

  const positionChart = {
    chart: { type: 'column' },
    title: { text: 'Failures by Position' },
    xAxis: { categories: Object.keys(failuresByPosition) },
    yAxis: { title: { text: 'Failures' } },
    series: [
      {
        name: 'Failures',
        data: Object.values(failuresByPosition)
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
        filename: 'failure-trends.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      })
      .save()

    await addDoc(collection(db, 'generatedReports'), {
      name: 'Failure Trends',
      type: 'PDF',
      date: new Date().toISOString().split('T')[0],
      fileUrl: '/exports/failure-trends.pdf',
      createdAt: serverTimestamp()
    })

    message.success('Failure trends report generated and saved.')
  }

  if (loading) return <Spin size='large' />

  return (
    <div className='p-4' ref={containerRef}>
      <Row gutter={16} className='mb-4'>
        <Col span={8}>
          <Card>
            <Statistic
              title='Most Frequent Failure Type'
              value={mostFrequentType}
              prefix={<WarningOutlined style={{ color: '#fa541c' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title='Peak Failure Month'
              value={peakMonth}
              prefix={<LineChartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title='Top Position Affected'
              value={topPosition}
              prefix={<AppstoreOutlined style={{ color: '#722ed1' }} />}
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
            title='Failures Over Time'
            extra={
              <Button onClick={() => setExpandedChart('timeline')}>
                Expand
              </Button>
            }
          >
            <HighchartsReact highcharts={Highcharts} options={timelineChart} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title='Failures by Type'
            extra={
              <Button onClick={() => setExpandedChart('type')}>Expand</Button>
            }
          >
            <HighchartsReact highcharts={Highcharts} options={typeChart} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className='mt-4'>
        <Col span={24}>
          <Card
            title='Failures by Position'
            extra={
              <Button onClick={() => setExpandedChart('position')}>
                Expand
              </Button>
            }
          >
            <HighchartsReact highcharts={Highcharts} options={positionChart} />
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
              expandedChart === 'timeline'
                ? timelineChart
                : expandedChart === 'type'
                ? typeChart
                : positionChart
            }
          />
        )}
      </Modal>
    </div>
  )
}
