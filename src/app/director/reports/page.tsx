'use client'

import { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Spin,
  Button,
  Tooltip,
  Tag
} from 'antd'
import {
  FileSearchOutlined,
  DollarOutlined,
  TagsOutlined,
  WarningOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/firebaseConfig'

export default function ReportsOverview () {
  const [tyres, setTyres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTyres = async () => {
      const snap = await getDocs(collection(db, 'tyres'))
      const tyres = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTyres(tyres)
      setLoading(false)
    }
    fetchTyres()
  }, [])

  const scrapCount = tyres.filter(t => t.status === 'Scrapped').length

  const spendBySupplier = tyres.reduce((acc, t) => {
    const supplier = t.supplier || 'Unknown'
    acc[supplier] = (acc[supplier] || 0) + (t.cost || 0)
    return acc
  }, {} as Record<string, number>)

  const topSupplier =
    Object.entries(spendBySupplier).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const failureReasons = tyres
    .filter(t => t.status === 'Scrapped')
    .map(t => t.failureReason || 'Unknown')

  const topFailure = failureReasons.length
    ? Object.entries(
        failureReasons.reduce((acc, r) => {
          acc[r] = (acc[r] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0][0]
    : 'N/A'

  // Simulated generated reports
  const generatedReports = [
    {
      key: '1',
      name: 'Supplier Performance',
      type: 'PDF',
      date: '2025-05-20',
      file: '/exports/supplier-performance.pdf'
    },
    {
      key: '2',
      name: 'Spend Analysis',
      type: 'PDF',
      date: '2025-05-19',
      file: '/exports/spend-analysis.pdf'
    },
    {
      key: '3',
      name: 'Scrap Analysis',
      type: 'XLSX',
      date: '2025-05-18',
      file: '/exports/scrap-analysis.xlsx'
    },
    {
      key: '4',
      name: 'Failure Trends',
      type: 'PDF',
      date: '2025-05-17',
      file: '/exports/failure-trends.pdf'
    }
  ]

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Format',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'PDF' ? 'volcano' : 'geekblue'
        return <Tag color={color}>{type}</Tag>
      }
    },
    {
      title: 'Date Generated',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div className='flex gap-2'>
          <Tooltip title='View Report'>
            <Button
              type='default'
              size='small'
              icon={<EyeOutlined />}
              href={record.file}
              target='_blank'
            />
          </Tooltip>
          <Tooltip title='Download'>
            <Button
              type='primary'
              size='small'
              icon={<DownloadOutlined />}
              href={record.file}
              download
            />
          </Tooltip>
        </div>
      )
    }
  ]

  if (loading) return <Spin size='large' />

  return (
    <div className='p-4'>
      <Row gutter={16} className='mb-4'>
        <Col span={6}>
          <Card>
            <Statistic
              title='Reports Available'
              value={generatedReports.length}
              prefix={<FileSearchOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Top Supplier by Spend'
              value={topSupplier}
              prefix={<TagsOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Most Frequent Failure'
              value={topFailure}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title='Scrap Rate'
              value={`${((scrapCount / tyres.length) * 100).toFixed(1)}%`}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card title='Generated Reports'>
        <Table
          dataSource={generatedReports}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  )
}
