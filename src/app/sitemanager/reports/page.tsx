'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  Tabs,
  Table,
  Typography,
  Statistic,
  Row,
  Col,
  Select,
  Button,
  Spin,
  Empty,
  Divider,
  Tag,
  Progress
} from 'antd'
import {
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  HistoryOutlined,
  FileTextOutlined,
  ReloadOutlined,
  FieldTimeOutlined
} from '@ant-design/icons'
import { useTyreAnalytics } from '../../../contexts/TyreAnalyticsContext'
import type {
  TyreCostData,
  TyreLifespanData,
  FailureRateData,
  FailureReasonData
} from '../../../contexts/TyreAnalyticsContext'
import { useFitmentLogs } from '../../../contexts/FitmentLogsContext'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const { Title, Text } = Typography
const { Option } = Select

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const SiteManagerReports = () => {
  const {
    loading,
    getTyreCostPerMachine,
    getAverageTyreLifespanPerSite,
    getFailureRatePerMachine,
    getFailureRatePerTyreType,
    getScrapAnalysisByReason,
    refreshAnalytics
  } = useTyreAnalytics()

  const { logs } = useFitmentLogs()

  // State for each report type
  const [costsData, setCostsData] = useState<TyreCostData[]>([])
  const [lifespanData, setLifespanData] = useState<TyreLifespanData[]>([])
  const [failureByMachineData, setFailureByMachineData] = useState<
    FailureRateData[]
  >([])
  const [failureByTypeData, setFailureByTypeData] = useState<FailureRateData[]>(
    []
  )
  const [scrapReasonData, setScrapReasonData] = useState<FailureReasonData[]>(
    []
  )
  const [selectedTab, setSelectedTab] = useState('costs')
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTyreType, setSelectedTyreType] = useState<string | null>(null)

  // Load data when tab changes
  useEffect(() => {
    loadData()
  }, [selectedTab])

  const loadData = async () => {
    switch (selectedTab) {
      case 'costs':
        if (costsData.length === 0) {
          const data = await getTyreCostPerMachine()
          setCostsData(data)
        }
        break
      case 'lifespan':
        if (lifespanData.length === 0) {
          const data = await getAverageTyreLifespanPerSite()
          setLifespanData(data)
        }
        break
      case 'failure':
        if (
          failureByMachineData.length === 0 ||
          failureByTypeData.length === 0
        ) {
          const machineData = await getFailureRatePerMachine()
          const typeData = await getFailureRatePerTyreType()
          setFailureByMachineData(machineData)
          setFailureByTypeData(typeData)
        }
        break
      case 'rotation':
        // This uses the logs data from FitmentLogsContext
        break
      case 'scrap':
        if (scrapReasonData.length === 0) {
          const data = await getScrapAnalysisByReason()
          setScrapReasonData(data)
        }
        break
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshAnalytics()

    // Reset all states to force reload
    setCostsData([])
    setLifespanData([])
    setFailureByMachineData([])
    setFailureByTypeData([])
    setScrapReasonData([])

    await loadData()
    setRefreshing(false)
  }

  // Format for cost display
  const formatCurrency = (value: number) => `R${value.toFixed(2)}`

  // Table columns for various reports
  const costColumns = [
    {
      title: 'Machine ID',
      dataIndex: 'machineId',
      key: 'machineId'
    },
    {
      title: 'Total Tyres',
      dataIndex: 'tyreCount',
      key: 'tyreCount',
      sorter: (a: TyreCostData, b: TyreCostData) => a.tyreCount - b.tyreCount
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost: number) => formatCurrency(cost),
      sorter: (a: TyreCostData, b: TyreCostData) => a.totalCost - b.totalCost
    },
    {
      title: 'Average Cost Per Tyre',
      dataIndex: 'averageCost',
      key: 'averageCost',
      render: (cost: number) => formatCurrency(cost),
      sorter: (a: TyreCostData, b: TyreCostData) =>
        a.averageCost - b.averageCost
    }
  ]

  const lifespanColumns = [
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site'
    },
    {
      title: 'Total Tyres',
      dataIndex: 'totalTyres',
      key: 'totalTyres',
      sorter: (a: TyreLifespanData, b: TyreLifespanData) =>
        a.totalTyres - b.totalTyres
    },
    {
      title: 'Average Lifespan (Days)',
      dataIndex: 'averageLifespanDays',
      key: 'averageLifespanDays',
      render: (days: number) => Math.round(days),
      sorter: (a: TyreLifespanData, b: TyreLifespanData) =>
        a.averageLifespanDays - b.averageLifespanDays
    }
  ]

  const failureColumns = [
    {
      title: 'ID',
      dataIndex: 'entityId',
      key: 'entityId'
    },
    {
      title: 'Total Tyres',
      dataIndex: 'totalTyres',
      key: 'totalTyres',
      sorter: (a: FailureRateData, b: FailureRateData) =>
        a.totalTyres - b.totalTyres
    },
    {
      title: 'Failed Tyres',
      dataIndex: 'failedTyres',
      key: 'failedTyres',
      sorter: (a: FailureRateData, b: FailureRateData) =>
        a.failedTyres - b.failedTyres
    },
    {
      title: 'Failure Rate',
      dataIndex: 'failureRate',
      key: 'failureRate',
      render: (rate: number) => (
        <div>
          <Progress
            percent={Math.round(rate * 100)}
            size='small'
            status={rate > 0.25 ? 'exception' : 'normal'}
          />
        </div>
      ),
      sorter: (a: FailureRateData, b: FailureRateData) =>
        a.failureRate - b.failureRate
    }
  ]

  const scrapColumns = [
    {
      title: 'Failure Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: FailureReasonData, b: FailureReasonData) => a.count - b.count
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${percentage.toFixed(1)}%`,
      sorter: (a: FailureReasonData, b: FailureReasonData) =>
        a.percentage - b.percentage
    }
  ]

  // Columns for fitment logs as rotation history
  const rotationColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    },
    {
      title: 'Operation',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (type: string) => (
        <Tag color={type === 'Fitment' ? 'green' : 'orange'}>{type}</Tag>
      ),
      filters: [
        { text: 'Fitment', value: 'Fitment' },
        { text: 'Removal', value: 'Removal' }
      ],
      onFilter: (value: any, record: any) => record.operationType === value
    },
    {
      title: 'Tyre Serial',
      dataIndex: 'tyreSerial',
      key: 'tyreSerial'
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicleId',
      key: 'vehicleId'
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: 'Performed By',
      dataIndex: 'performedBy',
      key: 'performedBy'
    }
  ]

  // Prepare data for charts
  const costChartData = costsData.map(item => ({
    name: item.machineId,
    Cost: item.totalCost
  }))

  const lifespanChartData = lifespanData.map(item => ({
    name: item.site,
    Days: Math.round(item.averageLifespanDays)
  }))

  const failureByMachineChartData = failureByMachineData.map(item => ({
    name: item.entityId,
    Rate: parseFloat((item.failureRate * 100).toFixed(1))
  }))

  const scrapPieChartData = scrapReasonData.map(item => ({
    name: item.reason,
    value: item.count
  }))

  // Define tabs as items array for Ant Design Tabs
  const tabItems = [
    {
      key: 'costs',
      label: (
        <span>
          <DollarOutlined /> Tyre Costs
        </span>
      ),
      children: (
        <Card className='report-card'>
          {costsData.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className='mb-4'>
                <Col xs={24} md={8}>
                  <Statistic
                    title='Total Tyre Expenditure'
                    value={costsData.reduce(
                      (sum, item) => sum + item.totalCost,
                      0
                    )}
                    precision={2}
                    prefix='R'
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title='Total Tyres'
                    value={costsData.reduce(
                      (sum, item) => sum + item.tyreCount,
                      0
                    )}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title='Average Cost Per Tyre'
                    value={
                      costsData.reduce((sum, item) => sum + item.totalCost, 0) /
                      costsData.reduce((sum, item) => sum + item.tyreCount, 0)
                    }
                    precision={2}
                    prefix='R'
                  />
                </Col>
              </Row>

              <Divider />

              <div className='report-chart-container mb-4'>
                <BarChart
                  width={700}
                  height={300}
                  data={costsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='machineId' />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey='totalCost' fill='#3f8600' name='Total Cost' />
                </BarChart>
              </div>

              <Title level={4}>Cost Breakdown by Machine</Title>
              <Table
                dataSource={costsData}
                columns={costColumns}
                rowKey='machineId'
                pagination={false}
              />
            </>
          ) : (
            <div className='report-loading'>
              {loading ? (
                <Spin size='large' />
              ) : (
                <Empty description='No cost data available' />
              )}
            </div>
          )}
        </Card>
      )
    },
    {
      key: 'lifespan',
      label: (
        <span>
          <ClockCircleOutlined /> Lifespan
        </span>
      ),
      children: (
        <Card className='report-card'>
          {lifespanData.length > 0 ? (
            <>
              <Row gutter={[16, 16]} className='mb-4'>
                <Col xs={24} md={8}>
                  <Statistic
                    title='Average Lifespan (All Sites)'
                    value={
                      lifespanData.reduce(
                        (sum, item) =>
                          sum + item.averageLifespanDays * item.totalTyres,
                        0
                      ) /
                      lifespanData.reduce(
                        (sum, item) => sum + item.totalTyres,
                        0
                      )
                    }
                    precision={0}
                    suffix='days'
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title='Total Tyres Tracked'
                    value={lifespanData.reduce(
                      (sum, item) => sum + item.totalTyres,
                      0
                    )}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title='Best Performing Site'
                    value={
                      lifespanData.sort(
                        (a, b) => b.averageLifespanDays - a.averageLifespanDays
                      )[0]?.site || 'N/A'
                    }
                    suffix={`(${Math.round(
                      lifespanData.sort(
                        (a, b) => b.averageLifespanDays - a.averageLifespanDays
                      )[0]?.averageLifespanDays || 0
                    )} days)`}
                  />
                </Col>
              </Row>

              <Divider />

              <div className='report-chart-container mb-4'>
                <BarChart
                  width={700}
                  height={300}
                  data={lifespanData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='site' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey='averageLifespanDays'
                    fill='#1677ff'
                    name='Average Lifespan (Days)'
                  />
                </BarChart>
              </div>

              <Title level={4}>Lifespan Breakdown by Site</Title>
              <Table
                dataSource={lifespanData}
                columns={lifespanColumns}
                rowKey='site'
                pagination={false}
              />
            </>
          ) : (
            <div className='report-loading'>
              {loading ? (
                <Spin size='large' />
              ) : (
                <Empty description='No lifespan data available' />
              )}
            </div>
          )}
        </Card>
      )
    },
    {
      key: 'failure',
      label: (
        <span>
          <WarningOutlined /> Failure Analysis
        </span>
      ),
      children: (
        <>
          <Card className='mb-4'>
            <Title level={4}>Failure Rate per Machine</Title>
            <Text className='text-gray-500'>
              Analysis of tyre failure rates across different machines
            </Text>

            {loading || failureByMachineData.length === 0 ? (
              <div className='py-8 flex justify-center'>
                <Spin size='large' />
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]} className='mt-4 mb-6'>
                  <Col span={24} lg={12}>
                    <Table
                      dataSource={failureByMachineData}
                      columns={failureColumns}
                      rowKey='entityId'
                      pagination={false}
                    />
                  </Col>
                  <Col span={24} lg={12}>
                    <div className='h-full flex justify-center items-center'>
                      <BarChart
                        width={400}
                        height={300}
                        data={failureByMachineChartData}
                      >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey='Rate'
                          fill='#ff8042'
                          label={{
                            position: 'center',
                            content: (props: any) => {
                              const { x, y, width, height, value } = props
                              if (
                                x === undefined ||
                                y === undefined ||
                                width === undefined ||
                                height === undefined
                              ) {
                                return null
                              }
                              const xPos = Number(x) + Number(width) / 2
                              const yPos = Number(y) + Number(height) / 2
                              return (
                                <text
                                  x={xPos}
                                  y={yPos}
                                  fill='#fff'
                                  textAnchor='middle'
                                  dominantBaseline='middle'
                                >
                                  {value}%
                                </text>
                              )
                            }
                          }}
                        />
                      </BarChart>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Card>

          <Card>
            <Title level={4}>Failure Rate per Tyre Type</Title>
            <Text className='text-gray-500'>
              Analysis of failure rates by tyre type
            </Text>

            {loading || failureByTypeData.length === 0 ? (
              <div className='py-8 flex justify-center'>
                <Spin size='large' />
              </div>
            ) : (
              <>
                <div className='mb-4 mt-4'>
                  <Select
                    placeholder='Filter by Tyre Type'
                    style={{ width: 240 }}
                    allowClear
                    onChange={value => setSelectedTyreType(value)}
                    value={selectedTyreType}
                  >
                    {failureByTypeData.map(item => (
                      <Option key={item.entityId} value={item.entityId}>
                        {item.entityId}
                      </Option>
                    ))}
                  </Select>
                </div>
                <Table
                  dataSource={
                    selectedTyreType
                      ? failureByTypeData.filter(
                          item => item.entityId === selectedTyreType
                        )
                      : failureByTypeData
                  }
                  columns={failureColumns.map(col => ({
                    ...col,
                    title: col.title === 'ID' ? 'Tyre Type' : col.title
                  }))}
                  rowKey='entityId'
                  pagination={false}
                />
              </>
            )}
          </Card>
        </>
      )
    },
    {
      key: 'rotation',
      label: (
        <span>
          <HistoryOutlined /> Tyre Rotation
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Tyre Rotation and Usage Logs</Title>
          <Text className='text-gray-500'>
            History of tyre fitment and removal operations
          </Text>

          {loading ? (
            <div className='py-8 flex justify-center'>
              <Spin size='large' />
            </div>
          ) : (
            <Table
              dataSource={logs}
              columns={rotationColumns}
              rowKey='id'
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      )
    },
    {
      key: 'scrap',
      label: (
        <span>
          <FileTextOutlined /> Scrap Analysis
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Scrap Analysis by Failure Reason</Title>
          <Text className='text-gray-500'>
            Breakdown of tyre failures by reason
          </Text>

          {loading || scrapReasonData.length === 0 ? (
            <div className='py-8 flex justify-center'>
              <Spin size='large' />
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]} className='mt-4'>
                <Col span={24} lg={10}>
                  <Table
                    dataSource={scrapReasonData}
                    columns={scrapColumns}
                    rowKey='reason'
                    pagination={false}
                  />
                </Col>
                <Col span={24} lg={14}>
                  <div
                    className='h-full flex justify-center items-center'
                    style={{ padding: '20px' }}
                  >
                    <PieChart
                      width={600}
                      height={400}
                      margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
                    >
                      <Pie
                        data={scrapPieChartData}
                        cx='50%'
                        cy='45%'
                        labelLine={{
                          stroke: '#333',
                          strokeWidth: 1.5
                        }}
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={95}
                        fill='#8884d8'
                        dataKey='value'
                        paddingAngle={3}
                      >
                        {scrapPieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const entry = props.payload
                          return [`${entry.name}: ${value} tyres`, 'Count']
                        }}
                      />
                      <Legend
                        layout='horizontal'
                        verticalAlign='bottom'
                        align='center'
                      />
                    </PieChart>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Card>
      )
    },
    {
      key: 'transmission',
      label: (
        <span>
          <FieldTimeOutlined /> Transmission Hours
        </span>
      ),
      children: (
        <Card className='report-card'>
          <div className='text-center mb-6'>
            <Title level={3}>Transmission Hours Analytics</Title>
            <Text type='secondary'>
              View detailed analysis of tyre performance based on hour meter
              readings
            </Text>
          </div>

          <Row gutter={[16, 16]} className='mb-4'>
            <Col span={24} className='text-center'>
              <Button
                type='primary'
                size='large'
                href='/sitemanager/reports/transmission-hours'
              >
                View Transmission Hours Dashboard
              </Button>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className='metric-card'>
                <Statistic
                  title='Hours per mm Wear'
                  value='Analyze'
                  valueStyle={{ fontSize: '16px', color: '#1677ff' }}
                  prefix={<FieldTimeOutlined />}
                />
                <Text type='secondary'>
                  Track tyre efficiency based on wear rate
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className='metric-card'>
                <Statistic
                  title='Cost per Hour'
                  value='Compare'
                  valueStyle={{ fontSize: '16px', color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                />
                <Text type='secondary'>Evaluate cost effectiveness</Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className='metric-card'>
                <Statistic
                  title='Brand Performance'
                  value='Benchmark'
                  valueStyle={{ fontSize: '16px', color: '#faad14' }}
                />
                <Text type='secondary'>Compare brands against each other</Text>
              </Card>
            </Col>
          </Row>
        </Card>
      )
    }
  ]

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <Title level={2}>Site Manager Reports</Title>
        <Button
          type='primary'
          icon={<ReloadOutlined />}
          loading={refreshing}
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </div>

      <Tabs
        activeKey={selectedTab}
        onChange={setSelectedTab}
        type='card'
        size='large'
        className='site-manager-report-tabs'
        items={tabItems}
      />
    </div>
  )
}

export default SiteManagerReports
