'use client'

import React, { useState } from 'react'
import {
  Card,
  Input,
  Button,
  Typography,
  Timeline,
  Descriptions,
  Divider,
  Tag,
  Tabs,
  Empty,
  Steps,
  Statistic,
  Row,
  Col,
  Table
} from 'antd'
import {
  SearchOutlined,
  HistoryOutlined,
  LineChartOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ToolOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useUser } from '../../../contexts/UserContext'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

// Mock tyre data with complete history
const TYRES_DATA: Record<string, any> = {
  BS265003: {
    id: 'T009',
    serialNumber: 'BS265003',
    brand: 'Bridgestone',
    size: '26.5R25',
    purchaseDate: '2023-05-20',
    cost: 45000,
    supplier: 'BridgeTyres Inc.',
    originalTreadDepth: 60,
    currentStatus: 'Fitted',
    currentMachine: 'IBL001',
    currentPosition: 'Left Front',
    history: [
      {
        id: 'H001',
        date: '2023-05-25',
        type: 'Received',
        details: 'Tyre received into inventory',
        location: 'Main Workshop',
        user: 'Admin User'
      },
      {
        id: 'H002',
        date: '2023-07-15',
        type: 'Fitted',
        details: 'Fitted to IBL001 at Left Front position',
        transHours: 2450,
        treadDepth: 60,
        pressure: 85,
        user: 'Tyre Fitter'
      },
      {
        id: 'H003',
        date: '2023-07-25',
        type: 'Inspection',
        details: 'Regular inspection',
        transHours: 2580,
        treadDepth: 52.3,
        pressure: 85,
        notes: 'Tyre in good condition, normal wear pattern',
        user: 'Tyre Fitter'
      },
      {
        id: 'H004',
        date: '2023-08-10',
        type: 'Inspection',
        details: 'Regular inspection',
        transHours: 2750,
        treadDepth: 48.7,
        pressure: 83,
        notes: 'Wearing normally, pressure adjusted',
        user: 'Tyre Fitter'
      }
    ],
    performance: {
      hoursAccumulated: 300,
      wearRate: 0.038, // mm per hour
      projectedLifespan: 1580, // hours
      costPerHour: 28.48 // R/hour
    }
  },
  MC265004: {
    id: 'T010',
    serialNumber: 'MC265004',
    brand: 'Michelin',
    size: '26.5R25',
    purchaseDate: '2023-05-20',
    cost: 48000,
    supplier: 'MichelinSA',
    originalTreadDepth: 62,
    currentStatus: 'Fitted',
    currentMachine: 'IBL001',
    currentPosition: 'Right Front',
    history: [
      {
        id: 'H001',
        date: '2023-05-25',
        type: 'Received',
        details: 'Tyre received into inventory',
        location: 'Main Workshop',
        user: 'Admin User'
      },
      {
        id: 'H002',
        date: '2023-07-15',
        type: 'Fitted',
        details: 'Fitted to IBL001 at Right Front position',
        transHours: 2450,
        treadDepth: 62,
        pressure: 85,
        user: 'Tyre Fitter'
      },
      {
        id: 'H003',
        date: '2023-07-25',
        type: 'Inspection',
        details: 'Regular inspection',
        transHours: 2580,
        treadDepth: 51.8,
        pressure: 80,
        notes: 'Slight uneven wear on outer edge',
        user: 'Tyre Fitter'
      }
    ],
    performance: {
      hoursAccumulated: 130,
      wearRate: 0.078, // mm per hour
      projectedLifespan: 790, // hours
      costPerHour: 60.76 // R/hour
    }
  },
  AP175001: {
    id: 'T015',
    serialNumber: 'AP175001',
    brand: 'Apollo',
    size: '17.5R25',
    purchaseDate: '2023-04-15',
    cost: 28000,
    supplier: 'Apollo Tyres',
    originalTreadDepth: 45,
    currentStatus: 'Scrapped',
    history: [
      {
        id: 'H001',
        date: '2023-04-20',
        type: 'Received',
        details: 'Tyre received into inventory',
        location: 'Main Workshop',
        user: 'Admin User'
      },
      {
        id: 'H002',
        date: '2023-05-01',
        type: 'Fitted',
        details: 'Fitted to IBL003 at Right Rear position',
        transHours: 1250,
        treadDepth: 45,
        pressure: 70,
        user: 'Tyre Fitter'
      },
      {
        id: 'H003',
        date: '2023-05-15',
        type: 'Inspection',
        details: 'Regular inspection',
        transHours: 1350,
        treadDepth: 42.5,
        pressure: 68,
        notes: 'Normal wear',
        user: 'Tyre Fitter'
      },
      {
        id: 'H004',
        date: '2023-06-15',
        type: 'Removed',
        details: 'Removed due to sidewall damage',
        transHours: 1575,
        treadDepth: 38.3,
        removalReason: 'Sidewall Damaged',
        notes: 'Significant cut in sidewall, unrepairable',
        user: 'Tyre Fitter'
      },
      {
        id: 'H005',
        date: '2023-06-20',
        type: 'Scrapped',
        details: 'Tyre scrapped due to unrepairable damage',
        scrapReason: 'Sidewall Damaged',
        user: 'Supervisor'
      }
    ],
    performance: {
      hoursAccumulated: 325,
      wearRate: 0.0207, // mm per hour
      costPerHour: 86.15 // R/hour
    }
  }
}

// Get timeline item color based on event type
const getTimelineItemColor = (type: string) => {
  switch (type) {
    case 'Received':
      return 'blue'
    case 'Fitted':
      return 'green'
    case 'Inspection':
      return 'gray'
    case 'Removed':
      return 'orange'
    case 'Scrapped':
      return 'red'
    case 'Repaired':
      return 'purple'
    default:
      return 'blue'
  }
}

// Get event icon based on type
const getEventIcon = (type: string) => {
  switch (type) {
    case 'Received':
      return <EnvironmentOutlined />
    case 'Fitted':
      return <ToolOutlined />
    case 'Inspection':
      return <FileTextOutlined />
    case 'Removed':
      return <WarningOutlined />
    case 'Scrapped':
      return <WarningOutlined />
    case 'Repaired':
      return <CheckCircleOutlined />
    default:
      return <HistoryOutlined />
  }
}

// Get status tag color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'In Stock':
      return 'blue'
    case 'Fitted':
      return 'green'
    case 'Removed':
      return 'orange'
    case 'Repaired':
      return 'purple'
    case 'Scrapped':
      return 'red'
    default:
      return 'default'
  }
}

const SerialHistoryPage = () => {
  const { userData } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle search submission
  const handleSearch = () => {
    if (!searchQuery) return

    // Look up tyre by serial
    const result = TYRES_DATA[searchQuery]
    setSearchResults(result || null)

    if (!result) {
      console.log('No tyre found with serial number:', searchQuery)
    }
  }

  // Table columns for inspection history
  const inspectionColumns: ColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: text => new Date(text).toLocaleDateString()
    },
    {
      title: 'Trans Hours',
      dataIndex: 'transHours',
      key: 'transHours'
    },
    {
      title: 'Tread Depth (mm)',
      dataIndex: 'treadDepth',
      key: 'treadDepth',
      render: depth => depth?.toFixed(1)
    },
    {
      title: 'Pressure (psi)',
      dataIndex: 'pressure',
      key: 'pressure'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    },
    {
      title: 'Inspector',
      dataIndex: 'user',
      key: 'user'
    }
  ]

  return (
    <div className='serial-history-page'>
      <Title level={2} className='mb-6'>
        Tyre Serial Number History
      </Title>

      <Card className='mb-8'>
        <div className='flex flex-col md:flex-row items-center gap-4'>
          <div className='w-full md:flex-1'>
            <Input
              placeholder='Enter tyre serial number (e.g. BS265003)'
              value={searchQuery}
              onChange={handleSearchChange}
              onPressEnter={handleSearch}
              size='large'
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>
          <Button
            type='primary'
            onClick={handleSearch}
            size='large'
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        </div>

        <Paragraph type='secondary' className='mt-4'>
          Enter a tyre serial number to view its complete history, inspection
          records, and performance metrics. Try: BS265003, MC265004, or AP175001
        </Paragraph>
      </Card>

      {searchResults ? (
        <div className='search-results'>
          <Card className='mb-6'>
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <Descriptions
                  title='Tyre Information'
                  bordered
                  column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                >
                  <Descriptions.Item label='Serial Number'>
                    {searchResults.serialNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label='Brand'>
                    {searchResults.brand}
                  </Descriptions.Item>
                  <Descriptions.Item label='Size'>
                    {searchResults.size}
                  </Descriptions.Item>
                  <Descriptions.Item label='Purchase Date'>
                    {new Date(searchResults.purchaseDate).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Cost'>
                    R{searchResults.cost.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label='Supplier'>
                    {searchResults.supplier}
                  </Descriptions.Item>
                  <Descriptions.Item label='Original Tread'>
                    {searchResults.originalTreadDepth}mm
                  </Descriptions.Item>
                  <Descriptions.Item label='Status'>
                    <Tag color={getStatusColor(searchResults.currentStatus)}>
                      {searchResults.currentStatus}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col span={24} md={12}>
                {searchResults.currentStatus === 'Fitted' && (
                  <Descriptions
                    title='Current Assignment'
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                  >
                    <Descriptions.Item label='Machine'>
                      {searchResults.currentMachine}
                    </Descriptions.Item>
                    <Descriptions.Item label='Position'>
                      {searchResults.currentPosition}
                    </Descriptions.Item>
                  </Descriptions>
                )}

                <Card title='Performance Metrics' className='mt-4'>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title='Hours Accumulated'
                        value={searchResults.performance.hoursAccumulated}
                        suffix='hrs'
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title='Cost Per Hour'
                        value={searchResults.performance.costPerHour}
                        precision={2}
                        prefix='R'
                      />
                    </Col>
                    {searchResults.currentStatus === 'Fitted' && (
                      <>
                        <Col span={12} className='mt-4'>
                          <Statistic
                            title='Wear Rate'
                            value={searchResults.performance.wearRate}
                            precision={3}
                            suffix='mm/hr'
                          />
                        </Col>
                        <Col span={12} className='mt-4'>
                          <Statistic
                            title='Projected Lifespan'
                            value={searchResults.performance.projectedLifespan}
                            suffix='hrs'
                          />
                        </Col>
                      </>
                    )}
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>

          <Tabs type='card' className='mb-6'>
            <TabPane
              tab={
                <span>
                  <HistoryOutlined /> Complete History
                </span>
              }
              key='history'
            >
              <Card>
                <Timeline
                  mode='left'
                  items={searchResults.history.map((event: any) => ({
                    color: getTimelineItemColor(event.type),
                    dot: getEventIcon(event.type),
                    children: (
                      <div>
                        <div className='flex justify-between'>
                          <Text strong>{event.type}</Text>
                          <Text type='secondary'>
                            {new Date(event.date).toLocaleDateString()}
                          </Text>
                        </div>
                        <div>{event.details}</div>
                        {event.transHours && (
                          <div>Transmission Hours: {event.transHours}</div>
                        )}
                        {event.treadDepth && (
                          <div>Tread Depth: {event.treadDepth}mm</div>
                        )}
                        {event.notes && <div>Notes: {event.notes}</div>}
                        {event.removalReason && (
                          <div>
                            Removal Reason:{' '}
                            <Tag color='orange'>{event.removalReason}</Tag>
                          </div>
                        )}
                        {event.scrapReason && (
                          <div>
                            Scrap Reason:{' '}
                            <Tag color='red'>{event.scrapReason}</Tag>
                          </div>
                        )}
                        <div className='text-xs text-gray-500 mt-1'>
                          By: {event.user}
                        </div>
                      </div>
                    )
                  }))}
                />
              </Card>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileTextOutlined /> Inspection Records
                </span>
              }
              key='inspections'
            >
              <Card>
                <Table
                  columns={inspectionColumns}
                  dataSource={searchResults.history.filter(
                    (event: any) =>
                      event.type === 'Inspection' || event.type === 'Fitted'
                  )}
                  rowKey='id'
                  pagination={false}
                />
              </Card>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <LineChartOutlined /> Wear Analysis
                </span>
              }
              key='wear'
            >
              <Card>
                <div className='text-center py-6'>
                  <Text>Wear analysis chart would be displayed here</Text>
                  <div className='mt-4'>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Statistic
                          title='Original Tread'
                          value={searchResults.originalTreadDepth}
                          suffix='mm'
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title='Current Tread'
                          value={
                            searchResults.history
                              .filter((e: any) => e.treadDepth)
                              .sort(
                                (a: any, b: any) =>
                                  new Date(b.date).getTime() -
                                  new Date(a.date).getTime()
                              )[0]?.treadDepth || 0
                          }
                          suffix='mm'
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title='Wear Rate'
                          value={searchResults.performance.wearRate}
                          precision={3}
                          suffix='mm/hr'
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </TabPane>
          </Tabs>
        </div>
      ) : (
        searchQuery && (
          <Card>
            <Empty description='No tyre found with this serial number' />
          </Card>
        )
      )}

      {!searchQuery && (
        <Card>
          <Empty
            description='Enter a serial number to view tyre history'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}
    </div>
  )
}

export default SerialHistoryPage
