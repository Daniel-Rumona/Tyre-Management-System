'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Badge,
  Tabs,
  Progress,
  Row,
  Col,
  Statistic,
  Empty,
  Button,
  Tooltip,
  Select,
  Tag
} from 'antd'
import {
  FieldTimeOutlined,
  DollarOutlined,
  LineChartOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useTyreAnalytics } from '../../../../contexts/TyreAnalyticsContext'
import type { TransmissionHoursData } from '../../../../contexts/TyreAnalyticsContext'
import { useUser } from '../../../../contexts/UserContext'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const TransmissionHoursPage = () => {
  const {
    getTransmissionHoursData,
    getAverageHoursPerMmByBrand,
    getAverageHoursPerMmBySize,
    getAverageCostPerHourByBrand
  } = useTyreAnalytics()
  const { userData } = useUser()

  const [tyreData, setTyreData] = useState<TransmissionHoursData[]>([])
  const [brandHoursPerMm, setBrandHoursPerMm] = useState<
    { brand: string; hoursPerMm: number }[]
  >([])
  const [sizeHoursPerMm, setSizeHoursPerMm] = useState<
    { size: string; hoursPerMm: number }[]
  >([])
  const [brandCostPerHour, setBrandCostPerHour] = useState<
    { brand: string; costPerHour: number }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [filterBrand, setFilterBrand] = useState<string | null>(null)
  const [filterSize, setFilterSize] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      try {
        // Load all data
        const hours = await getTransmissionHoursData()
        setTyreData(hours)

        const hoursPerMmByBrand = await getAverageHoursPerMmByBrand()
        setBrandHoursPerMm(hoursPerMmByBrand)

        const hoursPerMmBySize = await getAverageHoursPerMmBySize()
        setSizeHoursPerMm(hoursPerMmBySize)

        const costPerHourByBrand = await getAverageCostPerHourByBrand()
        setBrandCostPerHour(costPerHourByBrand)
      } catch (error) {
        console.error('Error loading transmission hours data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate various metrics for summary display
  const avgCostPerHour =
    tyreData.length > 0
      ? tyreData.reduce((sum, tyre) => sum + tyre.costPerHour, 0) /
        tyreData.length
      : 0

  const avgHoursPerMm =
    tyreData.length > 0
      ? tyreData.reduce((sum, tyre) => sum + tyre.hoursPerMm, 0) /
        tyreData.length
      : 0

  const bestPerformingBrand =
    brandHoursPerMm.length > 0
      ? [...brandHoursPerMm].sort((a, b) => b.hoursPerMm - a.hoursPerMm)[0]
      : null

  const mostCostEffectiveBrand =
    brandCostPerHour.length > 0
      ? [...brandCostPerHour].sort((a, b) => a.costPerHour - b.costPerHour)[0]
      : null

  // Filter tyres based on selected filters
  const filteredTyres = tyreData.filter(tyre => {
    let matches = true

    if (filterBrand && tyre.brand !== filterBrand) {
      matches = false
    }

    if (filterSize && tyre.size !== filterSize) {
      matches = false
    }

    return matches
  })

  // Extract unique brands and sizes for filters
  const brands = [...new Set(tyreData.map(tyre => tyre.brand))].sort()
  const sizes = [...new Set(tyreData.map(tyre => tyre.size))].sort()

  // Prepare data for charts
  const brandHoursPerMmChartData = {
    labels: brandHoursPerMm.map(item => item.brand),
    datasets: [
      {
        label: 'Hours per mm Wear',
        data: brandHoursPerMm.map(item => item.hoursPerMm),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1
      }
    ]
  }

  const brandCostPerHourChartData = {
    labels: brandCostPerHour.map(item => item.brand),
    datasets: [
      {
        label: 'Cost per Hour (R)',
        data: brandCostPerHour.map(item => item.costPerHour),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }
    ]
  }

  // Table columns
  const columns = [
    {
      title: 'Tyre ID',
      dataIndex: 'tyreId',
      key: 'tyreId',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Brand & Size',
      key: 'brandSize',
      render: (_: any, record: TransmissionHoursData) => (
        <>
          <div>{record.brand}</div>
          <small className='text-gray-500'>{record.size}</small>
        </>
      )
    },
    {
      title: 'Machine & Position',
      key: 'machinePosition',
      render: (_: any, record: TransmissionHoursData) => (
        <>
          <div>{record.machineId}</div>
          <small className='text-gray-500'>{record.position}</small>
        </>
      )
    },
    {
      title: 'Hours',
      key: 'hours',
      render: (_: any, record: TransmissionHoursData) => (
        <Tooltip
          title={`Initial: ${record.initialHours} | Final: ${record.finalHours}`}
        >
          <Badge
            status='processing'
            text={record.totalHours.toLocaleString()}
          />
        </Tooltip>
      ),
      sorter: (a: TransmissionHoursData, b: TransmissionHoursData) =>
        a.totalHours - b.totalHours
    },
    {
      title: 'Tread Wear',
      key: 'wear',
      render: (_: any, record: TransmissionHoursData) => (
        <Tooltip
          title={`Original: ${record.originalTreadDepth}mm | Remaining: ${record.remainingTreadDepth}mm`}
        >
          <div>
            <span className='mr-2'>{record.wearMm}mm</span>
            <Progress
              percent={record.percentageUsed}
              size='small'
              status={record.percentageUsed > 75 ? 'exception' : 'normal'}
              showInfo={false}
            />
            <div className='text-xs text-gray-500'>
              {record.percentageUsed.toFixed(0)}% used
            </div>
          </div>
        </Tooltip>
      ),
      sorter: (a: TransmissionHoursData, b: TransmissionHoursData) =>
        a.percentageUsed - b.percentageUsed
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_: any, record: TransmissionHoursData) => (
        <>
          <div>
            <FieldTimeOutlined className='mr-1' />
            <span className='mr-1'>{record.hoursPerMm.toFixed(0)} hrs/mm</span>
            {record.hoursPerMm > avgHoursPerMm ? (
              <Tag color='green'>Above Avg</Tag>
            ) : (
              <Tag color='orange'>Below Avg</Tag>
            )}
          </div>
          <div className='mt-1'>
            <DollarOutlined className='mr-1' />
            <span>R{record.costPerHour.toFixed(2)}/hr</span>
            {record.costPerHour < avgCostPerHour ? (
              <Tag color='green' className='ml-1'>
                Cost-Effective
              </Tag>
            ) : (
              <Tag color='orange' className='ml-1'>
                Costly
              </Tag>
            )}
          </div>
        </>
      )
    },
    {
      title: 'Value',
      key: 'value',
      render: (_: any, record: TransmissionHoursData) => (
        <>
          <div>
            <span>Cost: R{record.tyreCost.toLocaleString()}</span>
          </div>
          <div className='mt-1'>
            <Tooltip
              title={`Value Used: R${record.valueUsed.toFixed(
                2
              )} | Value Lost: R${record.valueLost.toFixed(2)}`}
            >
              <span>
                Used: {record.percentageUsed.toFixed(0)}% (R
                {record.valueUsed.toFixed(0)})
              </span>
            </Tooltip>
          </div>
        </>
      ),
      sorter: (a: TransmissionHoursData, b: TransmissionHoursData) =>
        a.tyreCost - b.tyreCost
    }
  ]
  // ---- Chart configs for Highcharts ----

  const brandHoursPerMmOptions = {
    chart: { type: 'bar', height: 320 },
    title: { text: null },
    xAxis: {
      categories: brandHoursPerMm.map(item => item.brand),
      title: { text: 'Brand' }
    },
    yAxis: {
      min: 0,
      title: { text: 'Hours per mm Wear', align: 'high' },
      labels: { overflow: 'justify' }
    },
    tooltip: { valueSuffix: ' hrs/mm' },
    plotOptions: { bar: { dataLabels: { enabled: true } } },
    series: [
      {
        name: 'Hours per mm Wear',
        data: brandHoursPerMm.map(item =>
          parseFloat(item.hoursPerMm.toFixed(2))
        ),
        color: '#1d9bf0'
      }
    ],
    credits: { enabled: false }
  }

  const brandCostPerHourOptions = {
    chart: { type: 'bar', height: 320 },
    title: { text: null },
    xAxis: {
      categories: brandCostPerHour.map(item => item.brand),
      title: { text: 'Brand' }
    },
    yAxis: {
      min: 0,
      title: { text: 'Cost per Hour (R)', align: 'high' },
      labels: {
        formatter: function () {
          // @ts-ignore
          return `R${this.value.toLocaleString()}`
        }
      }
    },
    tooltip: { valuePrefix: 'R' },
    plotOptions: { bar: { dataLabels: { enabled: true, format: 'R{y:.2f}' } } },
    series: [
      {
        name: 'Cost per Hour (R)',
        data: brandCostPerHour.map(item =>
          parseFloat(item.costPerHour.toFixed(2))
        ),
        color: '#ff3b3b'
      }
    ],
    credits: { enabled: false }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Transmission Hours Analytics</h1>
        <div>
          <span className='mr-2 text-gray-600'>Site:</span>
          <span className='font-medium'>{userData?.site || 'All Sites'}</span>
        </div>
      </div>

      {/* Summary cards */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Average Cost per Hour'
              value={avgCostPerHour}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix='R'
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Average Hours per mm'
              value={avgHoursPerMm}
              precision={0}
              valueStyle={{ color: '#1677ff' }}
              suffix='hrs/mm'
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Best Performing Brand'
              value={bestPerformingBrand?.brand || 'N/A'}
              valueStyle={{ fontSize: '16px' }}
              suffix={
                bestPerformingBrand ? (
                  <Tag color='green'>
                    {bestPerformingBrand.hoursPerMm.toFixed(0)} hrs/mm
                  </Tag>
                ) : null
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Most Cost-Effective Brand'
              value={mostCostEffectiveBrand?.brand || 'N/A'}
              valueStyle={{ fontSize: '16px' }}
              suffix={
                mostCostEffectiveBrand ? (
                  <Tag color='green'>
                    R{mostCostEffectiveBrand.costPerHour.toFixed(2)}/hr
                  </Tag>
                ) : null
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <div className='mb-4 flex flex-wrap gap-4'>
        <Select
          placeholder='Filter by Brand'
          style={{ width: 200 }}
          allowClear
          onChange={value => setFilterBrand(value)}
          options={brands.map(brand => ({ value: brand, label: brand }))}
        />

        <Select
          placeholder='Filter by Size'
          style={{ width: 200 }}
          allowClear
          onChange={value => setFilterSize(value)}
          options={sizes.map(size => ({ value: size, label: size }))}
        />
      </div>

      {/* Main content tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'details',
            label: (
              <span>
                <SettingOutlined /> Tyre Details
              </span>
            ),
            children: (
              <Table
                dataSource={filteredTyres}
                columns={columns}
                rowKey='tyreId'
                loading={loading}
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: (
                    <Empty description='No transmission hours data available' />
                  )
                }}
              />
            )
          },
          {
            key: 'performance',
            label: (
              <span>
                <BarChartOutlined /> Brand Performance
              </span>
            ),
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title='Hours per mm by Brand'>
                    {brandHoursPerMm.length > 0 ? (
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={brandHoursPerMmOptions}
                      />
                    ) : (
                      <Empty description='No hours per mm data available' />
                    )}
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Col xs={24} md={12}>
                    <Card title='Cost per Hour by Brand'>
                      {brandCostPerHour.length > 0 ? (
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={brandCostPerHourOptions}
                        />
                      ) : (
                        <Empty description='No cost per hour data available' />
                      )}
                    </Card>
                  </Col>
                </Col>
                <Col xs={24}>
                  <Card title='Performance Comparison'>
                    <Table
                      dataSource={brands.map(brand => {
                        const hoursData = brandHoursPerMm.find(
                          item => item.brand === brand
                        )
                        const costData = brandCostPerHour.find(
                          item => item.brand === brand
                        )

                        return {
                          brand,
                          hoursPerMm: hoursData?.hoursPerMm || 0,
                          costPerHour: costData?.costPerHour || 0
                        }
                      })}
                      rowKey='brand'
                      pagination={false}
                      columns={[
                        {
                          title: 'Brand',
                          dataIndex: 'brand',
                          key: 'brand'
                        },
                        {
                          title: 'Hours per mm',
                          dataIndex: 'hoursPerMm',
                          key: 'hoursPerMm',
                          render: value => value.toFixed(0),
                          sorter: (a, b) => a.hoursPerMm - b.hoursPerMm
                        },
                        {
                          title: 'Cost per Hour (R)',
                          dataIndex: 'costPerHour',
                          key: 'costPerHour',
                          render: value => value.toFixed(2),
                          sorter: (a, b) => a.costPerHour - b.costPerHour
                        },
                        {
                          title: 'Performance Rating',
                          key: 'rating',
                          render: (_, record) => {
                            // Calculate a simple performance score (higher hours/mm and lower cost/hour is better)
                            const hoursScore =
                              record.hoursPerMm / (avgHoursPerMm || 1)
                            const costScore =
                              (avgCostPerHour || 1) / record.costPerHour
                            const score = (hoursScore + costScore) / 2

                            let color = 'red'
                            if (score > 1.2) color = 'green'
                            else if (score > 0.8) color = 'orange'

                            return (
                              <Progress
                                percent={Math.min(score * 50, 100)}
                                steps={5}
                                strokeColor={color}
                                size='small'
                              />
                            )
                          }
                        }
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            )
          },
          {
            key: 'size',
            label: (
              <span>
                <LineChartOutlined /> Size Analysis
              </span>
            ),
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Card title='Performance by Tyre Size'>
                    <Table
                      dataSource={sizeHoursPerMm}
                      rowKey='size'
                      pagination={false}
                      columns={[
                        {
                          title: 'Tyre Size',
                          dataIndex: 'size',
                          key: 'size'
                        },
                        {
                          title: 'Hours per mm',
                          dataIndex: 'hoursPerMm',
                          key: 'hoursPerMm',
                          render: value => value.toFixed(0),
                          sorter: (a, b) => a.hoursPerMm - b.hoursPerMm
                        },
                        {
                          title: 'Compared to Average',
                          key: 'comparison',
                          render: (_, record) => {
                            const ratio =
                              record.hoursPerMm / (avgHoursPerMm || 1)
                            let color = 'green'
                            let text = 'Above average'

                            if (ratio < 0.8) {
                              color = 'red'
                              text = 'Below average'
                            } else if (ratio < 1) {
                              color = 'orange'
                              text = 'Near average'
                            }

                            return (
                              <Tag color={color}>
                                {text} ({(ratio * 100).toFixed(0)}%)
                              </Tag>
                            )
                          }
                        },
                        {
                          title: 'Best Brand for Size',
                          key: 'bestBrand',
                          render: (_, record) => {
                            // Find tyres of this size, grouped by brand
                            const tyresOfSize = tyreData.filter(
                              t => t.size === record.size
                            )

                            if (tyresOfSize.length === 0) return 'N/A'

                            const brandPerformance = tyresOfSize.reduce(
                              (acc, tyre) => {
                                if (!acc[tyre.brand]) {
                                  acc[tyre.brand] = {
                                    totalHoursPerMm: 0,
                                    count: 0
                                  }
                                }

                                acc[tyre.brand].totalHoursPerMm +=
                                  tyre.hoursPerMm
                                acc[tyre.brand].count += 1

                                return acc
                              },
                              {} as Record<
                                string,
                                { totalHoursPerMm: number; count: number }
                              >
                            )

                            const bestBrand = Object.entries(brandPerformance)
                              .map(([brand, stats]) => ({
                                brand,
                                avgHoursPerMm:
                                  stats.totalHoursPerMm / stats.count
                              }))
                              .sort(
                                (a, b) => b.avgHoursPerMm - a.avgHoursPerMm
                              )[0]

                            return bestBrand ? (
                              <span>
                                <strong>{bestBrand.brand}</strong> (
                                {bestBrand.avgHoursPerMm.toFixed(0)} hrs/mm)
                              </span>
                            ) : (
                              'N/A'
                            )
                          }
                        }
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            )
          }
        ]}
      />
    </div>
  )
}

export default TransmissionHoursPage
