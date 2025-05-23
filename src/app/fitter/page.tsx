'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Typography,
  Tag,
  Badge,
  Divider,
  List,
  Avatar,
  Progress,
  Tabs,
  Space,
  Calendar,
  Tooltip
} from 'antd'
import {
  ToolOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  BellOutlined,
  HistoryOutlined,
  DatabaseOutlined,
  RightOutlined,
  CarOutlined,
  LineChartOutlined,
  ArrowUpOutlined
} from '@ant-design/icons'
import { useUser } from '../../contexts/UserContext'
import { useNavigate, Link } from 'react-router-dom'

const { Title, Text } = Typography
const { TabPane } = Tabs

const FitterDashboardPage = () => {
  const { userData } = useUser()
  const router = useNavigate()
  const [pendingTasks, setPendingTasks] = useState(3)
  const [completedTasks, setCompletedTasks] = useState(12)
  const [unreadNotifications, setUnreadNotifications] = useState(2)
  const [activeTab, setActiveTab] = useState('tasks')

  // Sample data for upcoming inspections
  const upcomingInspections = [
    {
      id: '1',
      machine: 'IBL001',
      location: 'North Pit',
      time: '10:30 AM',
      priority: 'High',
      tyrePosition: 'Left Front'
    },
    {
      id: '2',
      machine: 'IBL002',
      location: 'South Pit',
      time: '1:15 PM',
      priority: 'Medium',
      tyrePosition: 'Right Rear'
    },
    {
      id: '3',
      machine: 'IDL001',
      location: 'Main Workshop',
      time: '3:45 PM',
      priority: 'Low',
      tyrePosition: 'Left Rear'
    }
  ]

  // Sample data for recent fitments
  const recentFitments = [
    {
      id: '101',
      date: '2023-08-15',
      machine: 'IBL001',
      position: 'Left Front',
      serialNumber: 'BS265003',
      brand: 'Bridgestone',
      wearRate: 0.038
    },
    {
      id: '102',
      date: '2023-08-14',
      machine: 'IBL002',
      position: 'Right Rear',
      serialNumber: 'MC265004',
      brand: 'Michelin',
      wearRate: 0.042
    }
  ]

  // Sample data for critical alerts
  const criticalAlerts = [
    {
      id: 'A001',
      machine: 'IBL003',
      position: 'Right Front',
      issue: 'Low tread depth',
      status: 'critical',
      remainingLife: 15
    },
    {
      id: 'A002',
      machine: 'IDL002',
      position: 'Left Rear',
      issue: 'Abnormal wear pattern',
      status: 'warning',
      remainingLife: 35
    }
  ]

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'green'
      default:
        return 'blue'
    }
  }

  // Navigation shortcuts
  const shortcuts = [
    {
      title: 'Record Fitment/Removal',
      description: 'Log tyre fitments and removals',
      icon: <ToolOutlined style={{ fontSize: '24px' }} />,
      color: '#1677ff',
      link: '/fitter/fitment'
    },
    {
      title: 'View Fitment Logs',
      description: 'Browse fitment history',
      icon: <HistoryOutlined style={{ fontSize: '24px' }} />,
      color: '#52c41a',
      link: '/fitter/fitment-logs'
    },
    {
      title: 'Tyre Inventory',
      description: 'View all tyres in system',
      icon: <DatabaseOutlined style={{ fontSize: '24px' }} />,
      color: '#fa8c16',
      link: '/fitter/tyres'
    },
    {
      title: 'Perform Inspection',
      description: 'Record tyre inspection data',
      icon: <ClockCircleOutlined style={{ fontSize: '24px' }} />,
      color: '#722ed1',
      link: '/fitter/inspections'
    },
    {
      title: 'Lookup Serial',
      description: 'Search tyre history by serial',
      icon: <SearchOutlined style={{ fontSize: '24px' }} />,
      color: '#eb2f96',
      link: '/fitter/serial-history'
    },
    {
      title: 'View Notifications',
      description: `${unreadNotifications} unread alerts`,
      icon: <BellOutlined style={{ fontSize: '24px' }} />,
      color: '#fa8c16',
      link: '/fitter/notifications',
      badge: unreadNotifications
    }
  ]

  // Get current date and time for display
  const currentDate = new Date()
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate)

  // Calculate task completion rate
  const completionRate = Math.round(
    (completedTasks / (completedTasks + pendingTasks)) * 100
  )

  return (
    <div className='fitter-dashboard'>
      {/* Header Section with Welcome Card */}
      <Card
        className='mb-6 overflow-hidden border-0 shadow'
        style={{
          background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
          borderRadius: '12px'
        }}
      >
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center text-white'>
          <div>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              Welcome, {userData?.name || 'Tyre Fitter'}
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              {userData?.site || 'Workshop'} • {formattedDate}
            </Text>
            <div className='mt-2'>
              <Tag icon={<CheckCircleOutlined />} color='success'>
                {completionRate}% Task Completion Rate
              </Tag>
            </div>
          </div>
          <div className='mt-4 md:mt-0'>
            <Space>
              <Button
                type='primary'
                ghost
                icon={<BellOutlined />}
                onClick={() => router('/fitter/notifications')}
              >
                Alerts{' '}
                {unreadNotifications > 0 && (
                  <Badge
                    count={unreadNotifications}
                    style={{ marginLeft: 5 }}
                  />
                )}
              </Button>
              <Button
                type='primary'
                onClick={() => router('/fitter/inspections')}
              >
                Start Inspection
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Quick Action Shortcuts Grid */}
      <div className='mb-8'>
        <Text strong className='text-lg mb-4 block'>
          Quick Actions
        </Text>
        <Row gutter={[16, 16]}>
          {shortcuts.map((item, index) => (
            <Col xs={12} sm={8} md={6} lg={4} key={index}>
              <Card
                hoverable
                onClick={() => router(item.link)}
                className='h-full text-center'
                bodyStyle={{ padding: '12px' }}
              >
                <div
                  className='flex items-center justify-center rounded-full mx-auto mb-2'
                  style={{
                    backgroundColor: `${item.color}10`,
                    width: '50px',
                    height: '50px'
                  }}
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <div>
                  <div className='flex justify-center items-center'>
                    <Text strong style={{ fontSize: '14px' }}>
                      {item.title}
                    </Text>
                    {item.badge && (
                      <Badge count={item.badge} style={{ marginLeft: 5 }} />
                    )}
                  </div>
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    {item.description}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Dashboard Content */}
      <Row gutter={[16, 16]}>
        {/* Main Content Column */}
        <Col xs={24} lg={16}>
          {/* Task & Schedule Section */}
          <Card className='mb-4'>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span>
                    <ClockCircleOutlined /> Today's Tasks
                  </span>
                }
                key='tasks'
              >
                <List
                  itemLayout='horizontal'
                  dataSource={upcomingInspections}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Link key='start' to={`/fitter/inspections`}>
                          <Button type='primary' size='small'>
                            Start
                          </Button>
                        </Link>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<CarOutlined />}
                            style={{
                              backgroundColor: getPriorityColor(item.priority)
                            }}
                          />
                        }
                        title={
                          <Space>
                            <span>
                              <b>{item.machine}</b>
                            </span>
                            <Tag color={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            <div>
                              {item.tyrePosition} • {item.location}
                            </div>
                            <div>
                              <ClockCircleOutlined style={{ marginRight: 4 }} />{' '}
                              {item.time}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div className='text-right mt-4'>
                  <Link to='/fitter/inspections'>
                    <Button type='link'>
                      View All Tasks <RightOutlined />
                    </Button>
                  </Link>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ExclamationCircleOutlined /> Critical Alerts
                  </span>
                }
                key='alerts'
              >
                <List
                  itemLayout='horizontal'
                  dataSource={criticalAlerts}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Link key='inspect' to={`/fitter/inspections`}>
                          <Button
                            type='primary'
                            danger={item.status === 'critical'}
                            size='small'
                          >
                            Inspect Now
                          </Button>
                        </Link>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<ExclamationCircleOutlined />}
                            style={{
                              backgroundColor:
                                item.status === 'critical'
                                  ? '#f5222d'
                                  : '#fa8c16'
                            }}
                          />
                        }
                        title={
                          <Space>
                            <span>
                              <b>
                                {item.machine} - {item.position}
                              </b>
                            </span>
                            <Tag
                              color={
                                item.status === 'critical' ? 'red' : 'orange'
                              }
                            >
                              {item.status === 'critical'
                                ? 'Critical'
                                : 'Warning'}
                            </Tag>
                          </Space>
                        }
                        description={item.issue}
                      />
                      <div style={{ marginRight: 16 }}>
                        <Tooltip title='Estimated remaining life'>
                          <Progress
                            type='circle'
                            percent={item.remainingLife}
                            width={50}
                            format={percent => `${percent}%`}
                            status={
                              item.status === 'critical'
                                ? 'exception'
                                : 'normal'
                            }
                          />
                        </Tooltip>
                      </div>
                    </List.Item>
                  )}
                />
                <div className='text-right mt-4'>
                  <Link to='/fitter/notifications'>
                    <Button type='link'>
                      View All Alerts <RightOutlined />
                    </Button>
                  </Link>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined /> Schedule
                  </span>
                }
                key='schedule'
              >
                <div
                  className='calendar-mini'
                  style={{ maxHeight: '300px', overflow: 'auto' }}
                >
                  <Calendar fullscreen={false} />
                </div>
              </TabPane>
            </Tabs>
          </Card>

          {/* Recent Fitments */}
          <Card
            title={
              <span>
                <HistoryOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Recent Fitments
              </span>
            }
            extra={
              <Link to='/fitter/fitment-logs'>
                <Button type='link'>
                  View All Logs <RightOutlined />
                </Button>
              </Link>
            }
          >
            <List
              itemLayout='horizontal'
              dataSource={recentFitments}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Link
                      key='view'
                      to={`/fitter/serial-history?serial=${item.serialNumber}`}
                    >
                      <Button
                        type='link'
                        size='small'
                        icon={<LineChartOutlined />}
                      >
                        History
                      </Button>
                    </Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<ToolOutlined />}
                        style={{ backgroundColor: '#1677ff' }}
                      />
                    }
                    title={
                      <div className='flex items-center'>
                        <span className='mr-2'>
                          {item.machine} - {item.position}
                        </span>
                        <Tag color='blue'>{item.serialNumber}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>
                          {item.brand} • Fitted on{' '}
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                        <div>
                          Wear rate:{' '}
                          <Text
                            type={item.wearRate > 0.04 ? 'danger' : 'secondary'}
                          >
                            {item.wearRate.toFixed(3)} mm/hr
                            {item.wearRate > 0.04 && (
                              <ArrowUpOutlined style={{ color: 'red' }} />
                            )}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <div className='text-center mt-4'>
              <Link to='/fitter/fitment'>
                <Button type='primary' icon={<ToolOutlined />}>
                  Record New Fitment
                </Button>
              </Link>
            </div>
          </Card>
        </Col>

        {/* Sidebar Column */}
        <Col xs={24} lg={8}>
          {/* Stats Cards */}
          <Card className='mb-4'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title='Pending Tasks'
                  value={pendingTasks}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title='Completed Today'
                  value={completedTasks}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title='Available Tyres'
                  value={28}
                  prefix={<ToolOutlined style={{ color: '#1677ff' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title='Total Inspections'
                  value={76}
                  prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <div className='flex justify-between items-center'>
              <Text type='secondary'>Weekly task completion</Text>
              <Text strong>72%</Text>
            </div>
            <Progress percent={72} status='active' strokeColor='#1677ff' />
            <div className='mt-4'>
              <Link to='/fitter/inspections'>
                <Button type='link' block>
                  View Detailed Reports <RightOutlined />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Tyre Health Overview */}
          <Card
            title={
              <span>
                <LineChartOutlined style={{ marginRight: 8 }} />
                Tyre Fleet Health
              </span>
            }
            className='mb-4'
          >
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-1'>
                <Text>Excellent</Text>
                <Text strong>42%</Text>
              </div>
              <Progress
                percent={42}
                status='success'
                strokeColor='#52c41a'
                showInfo={false}
              />
            </div>
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-1'>
                <Text>Good</Text>
                <Text strong>30%</Text>
              </div>
              <Progress percent={30} strokeColor='#1677ff' showInfo={false} />
            </div>
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-1'>
                <Text>Fair</Text>
                <Text strong>20%</Text>
              </div>
              <Progress percent={20} strokeColor='#fa8c16' showInfo={false} />
            </div>
            <div className='mb-3'>
              <div className='flex justify-between items-center mb-1'>
                <Text>Poor</Text>
                <Text strong>8%</Text>
              </div>
              <Progress percent={8} status='exception' showInfo={false} />
            </div>
            <div className='text-center mt-4'>
              <Link to='/fitter/tyres'>
                <Button type='primary' ghost block>
                  View Tyre Inventory
                </Button>
              </Link>
            </div>
          </Card>

          {/* Quick Links */}
          <Card title='Quick Resources'>
            <List
              size='small'
              dataSource={[
                { title: 'Inspection Guidelines', link: '#' },
                { title: 'Tyre Rotation Patterns', link: '#' },
                { title: 'Wear Pattern Guide', link: '#' },
                { title: 'Safety Procedures', link: '#' }
              ]}
              renderItem={item => (
                <List.Item>
                  <Link to={item.link}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default FitterDashboardPage
