'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Button,
  Tag,
  Avatar
} from 'antd'
import {
  DollarOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useUser } from '../../contexts/UserContext'
import { useInspections } from '../../contexts/InspectionsContext'
import { useFitmentLogs } from '../../contexts/FitmentLogsContext'
import { useTyreAnalytics } from '../../contexts/TyreAnalyticsContext'
import type {
  TyreCostData,
  FailureRateData
} from '../../contexts/TyreAnalyticsContext'
import { Link } from 'react-router-dom'

const SiteManagerDashboard = () => {
  const { userData } = useUser()
  const { inspections } = useInspections()
  const { logs } = useFitmentLogs()
  const {
    getTyreCostPerMachine,
    getAverageTyreLifespanPerSite,
    getFailureRatePerMachine,
    getScrapAnalysisByReason
  } = useTyreAnalytics()

  const [costData, setCostData] = useState<TyreCostData[]>([])
  const [averageLifespan, setAverageLifespan] = useState<number>(0)
  const [failureData, setFailureData] = useState<FailureRateData[]>([])
  const [topFailureReason, setTopFailureReason] = useState<string>('Unknown')

  // Load analytics data for dashboard
  useEffect(() => {
    const loadData = async () => {
      // Get cost data
      const costs = await getTyreCostPerMachine()
      setCostData(costs)

      // Get lifespan data
      const lifespan = await getAverageTyreLifespanPerSite()
      if (userData?.site && lifespan.length > 0) {
        const siteStat = lifespan.find(item => item.site === userData.site)
        if (siteStat) {
          setAverageLifespan(Math.round(siteStat.averageLifespanDays))
        } else {
          // Default to average of all sites
          const total = lifespan.reduce(
            (sum, item) => sum + item.averageLifespanDays,
            0
          )
          setAverageLifespan(Math.round(total / lifespan.length))
        }
      }

      // Get failure data
      const failures = await getFailureRatePerMachine()
      setFailureData(failures)

      // Get top failure reason
      const reasons = await getScrapAnalysisByReason()
      if (reasons.length > 0) {
        const sortedReasons = [...reasons].sort((a, b) => b.count - a.count)
        setTopFailureReason(sortedReasons[0].reason)
      }
    }

    loadData()
  }, [userData])

  // Calculate total tyre cost
  const totalTyreCost = costData.reduce((sum, item) => sum + item.totalCost, 0)

  // Find machine with highest failure rate
  const highestFailureMachine =
    failureData.length > 0
      ? failureData.reduce(
          (max, item) => (item.failureRate > max.failureRate ? item : max),
          failureData[0]
        )
      : null

  // Get pending inspections count
  const pendingInspections = inspections.filter(
    i => i.status === 'Pending Review'
  ).length

  // Calculate fitment/removal stats
  const fitmentCount = logs.filter(
    log => log.operationType === 'Fitment'
  ).length
  const removalCount = logs.filter(
    log => log.operationType === 'Removal'
  ).length

  // Recent fitment logs for display
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <>
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Total Tyre Cost'
              value={totalTyreCost}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix='R'
              suffix={null}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          {' '}
          <Card>
            {' '}
            <Statistic
              title='Average Tyre Lifespan'
              value={averageLifespan}
              valueStyle={{ color: '#1677ff' }}
              prefix={<ClockCircleOutlined />}
              suffix='days'
            />{' '}
            <div className='mt-2'>
              {' '}
              <Link href='/sitemanager/reports/transmission-hours'>
                View hours analysis
              </Link>{' '}
            </div>{' '}
          </Card>{' '}
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Pending Inspections'
              value={pendingInspections}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
            <div className='mt-2'>
              <Link href='/sitemanager/inspections'>View inspections</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Fitment/Removal Ratio'
              value={(fitmentCount / (removalCount || 1)).toFixed(1)}
              precision={1}
              valueStyle={{
                color: fitmentCount > removalCount ? '#3f8600' : '#cf1322'
              }}
              prefix={
                fitmentCount > removalCount ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
            />
            <div className='text-xs text-gray-500 mt-1'>
              {fitmentCount} fitments, {removalCount} removals
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title='Tyre Cost Analysis'
            extra={<Link href='/sitemanager/reports?tab=costs'>Details</Link>}
          >
            <div className='mb-4'>
              <p className='text-gray-500'>Top 3 Machines by Cost</p>
            </div>
            {costData.length > 0 ? (
              <div>
                {[...costData]
                  .sort((a, b) => b.totalCost - a.totalCost)
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={item.machineId} className='mb-2'>
                      <div className='flex justify-between mb-1'>
                        <span>{item.machineId}</span>
                        <span>R{item.totalCost.toFixed(2)}</span>
                      </div>
                      <Progress
                        percent={Math.round(
                          (item.totalCost / totalTyreCost) * 100
                        )}
                        showInfo={false}
                        status={index === 0 ? 'exception' : 'normal'}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className='text-center py-4 text-gray-500'>
                No cost data available
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title='Failure Insights'
            extra={<Link href='/sitemanager/reports?tab=failure'>Details</Link>}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title='Top Failure Reason'
                  value={topFailureReason}
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col span={12}>
                {highestFailureMachine && (
                  <Statistic
                    title='Highest Failure Machine'
                    value={highestFailureMachine.entityId}
                    valueStyle={{ fontSize: '16px' }}
                    suffix={
                      <Tag color='red'>
                        {(highestFailureMachine.failureRate * 100).toFixed(0)}%
                      </Tag>
                    }
                  />
                )}
              </Col>

              <Col span={24}>
                <div className='mt-2'>
                  <p className='text-gray-500 mb-2'>Failure Rates by Machine</p>
                  {failureData.length > 0 ? (
                    <div>
                      {[...failureData]
                        .sort((a, b) => b.failureRate - a.failureRate)
                        .slice(0, 3)
                        .map(item => (
                          <div key={item.entityId} className='mb-2'>
                            <div className='flex justify-between mb-1'>
                              <span>{item.entityId}</span>
                              <span>
                                {(item.failureRate * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress
                              percent={Math.round(item.failureRate * 100)}
                              showInfo={false}
                              status={
                                item.failureRate > 0.25 ? 'exception' : 'normal'
                              }
                            />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className='text-center py-2 text-gray-500'>
                      No failure data available
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title='Recent Tyre Activity'
            extra={
              <Link href='/sitemanager/reports?tab=rotation'>View All</Link>
            }
            className='mt-4'
          >
            <Table
              dataSource={recentLogs}
              rowKey='id'
              pagination={false}
              columns={[
                {
                  title: 'Date',
                  dataIndex: 'date',
                  key: 'date'
                },
                {
                  title: 'Operation',
                  dataIndex: 'operationType',
                  key: 'operationType',
                  render: type => (
                    <Tag color={type === 'Fitment' ? 'green' : 'orange'}>
                      {type}
                    </Tag>
                  )
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
                  title: 'Performed By',
                  dataIndex: 'performedBy',
                  key: 'performedBy'
                },
                {
                  title: 'Site',
                  dataIndex: 'site',
                  key: 'site'
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SiteManagerDashboard
