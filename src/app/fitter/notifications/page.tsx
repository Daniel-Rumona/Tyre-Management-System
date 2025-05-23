'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  List,
  Badge,
  Typography,
  Tag,
  Button,
  Tabs,
  Empty,
  Divider,
  Avatar,
  Tooltip,
  Space
} from 'antd'
import {
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  CarOutlined
} from '@ant-design/icons'
import { useUser } from '../../../contexts/UserContext'

const { Title, Text } = Typography
const { TabPane } = Tabs

// Mock notifications data - would come from an API in production
const NOTIFICATIONS = [
  {
    id: 'N001',
    type: 'inspection',
    title: 'Inspection Due',
    message: 'Machine IBL001 is due for tyre inspection today',
    machine: 'IBL001',
    date: '2023-08-25',
    status: 'urgent',
    read: false
  },
  {
    id: 'N002',
    type: 'tyre_issue',
    title: 'Tyre Wear Alert',
    message: 'Tyre on IBL002 (Left Front) is showing unusual wear pattern',
    machine: 'IBL002',
    position: 'Left Front',
    date: '2023-08-24',
    status: 'warning',
    read: false
  },
  {
    id: 'N003',
    type: 'system',
    title: 'System Maintenance',
    message:
      'System will be under maintenance on August 30th from 22:00 to 23:00',
    date: '2023-08-23',
    status: 'info',
    read: true
  },
  {
    id: 'N004',
    type: 'tyre_pressure',
    title: 'Low Pressure Alert',
    message: 'Tyre on IDL001 (Right Rear) has low pressure, please check',
    machine: 'IDL001',
    position: 'Right Rear',
    date: '2023-08-22',
    status: 'warning',
    read: true
  },
  {
    id: 'N005',
    type: 'inspection',
    title: 'Inspection Approved',
    message:
      'Your inspection report for IBL003 has been approved by Supervisor',
    machine: 'IBL003',
    date: '2023-08-20',
    status: 'success',
    read: true
  }
]

// Mock scheduled inspections
const SCHEDULED_INSPECTIONS = [
  {
    id: 'S001',
    machine: 'IBL001',
    dueDate: '2023-08-25',
    status: 'urgent',
    priority: 'high'
  },
  {
    id: 'S002',
    machine: 'IBL002',
    dueDate: '2023-08-26',
    status: 'upcoming',
    priority: 'medium'
  },
  {
    id: 'S003',
    machine: 'IDL001',
    dueDate: '2023-08-28',
    status: 'upcoming',
    priority: 'low'
  }
]

// Get icon for notification type
const getNotificationIcon = (type: string, status: string) => {
  const color = getStatusColor(status)

  switch (type) {
    case 'inspection':
      return <ClockCircleOutlined style={{ color }} />
    case 'tyre_issue':
      return <ExclamationCircleOutlined style={{ color }} />
    case 'tyre_pressure':
      return <ToolOutlined style={{ color }} />
    case 'system':
      return <InfoCircleOutlined style={{ color }} />
    default:
      return <BellOutlined style={{ color }} />
  }
}

// Get color for notification status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'urgent':
      return '#f5222d' // Red
    case 'warning':
      return '#faad14' // Orange
    case 'success':
      return '#52c41a' // Green
    case 'info':
      return '#1677ff' // Blue
    case 'upcoming':
      return '#722ed1' // Purple
    default:
      return '#8c8c8c' // Grey
  }
}

const NotificationsPage = () => {
  const { userData } = useUser()
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState('all')

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    )
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.read
    if (activeTab === 'inspections') return notification.type === 'inspection'
    if (activeTab === 'issues')
      return ['tyre_issue', 'tyre_pressure'].includes(notification.type)
    return false
  })

  // Count unread notifications
  const unreadCount = notifications.filter(
    notification => !notification.read
  ).length

  return (
    <div className='notifications-page'>
      <div className='flex justify-between items-center mb-6'>
        <Title level={2}>
          Notifications {unreadCount > 0 && <Badge count={unreadCount} />}
        </Title>

        <Button
          type='link'
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type='card'
        className='mb-6'
      >
        <TabPane tab={<span>All Notifications</span>} key='all' />
        <TabPane
          tab={
            <span>
              Unread <Badge count={unreadCount} style={{ marginLeft: 5 }} />
            </span>
          }
          key='unread'
        />
        <TabPane tab={<span>Inspections</span>} key='inspections' />
        <TabPane tab={<span>Tyre Issues</span>} key='issues' />
      </Tabs>

      {/* Alert for today's inspections */}
      {SCHEDULED_INSPECTIONS.some(
        inspection =>
          new Date(inspection.dueDate).toDateString() ===
          new Date().toDateString()
      ) && (
        <Card className='mb-6 border-orange-500'>
          <div className='flex items-center'>
            <Avatar
              size='large'
              icon={<ExclamationCircleOutlined />}
              style={{ backgroundColor: '#faad14', marginRight: 16 }}
            />
            <div>
              <Text strong>Inspections Due Today</Text>
              <div>
                You have scheduled inspections that need to be completed today.
                <Button type='link' size='small' href='/fitter/inspections'>
                  View inspections
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {filteredNotifications.length > 0 ? (
          <List
            itemLayout='horizontal'
            dataSource={filteredNotifications}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button
                    key='mark'
                    type='text'
                    size='small'
                    icon={item.read ? <CheckOutlined /> : <CloseOutlined />}
                    onClick={() => markAsRead(item.id)}
                  >
                    {item.read ? 'Read' : 'Mark as read'}
                  </Button>
                ]}
                className={!item.read ? 'bg-blue-50' : ''}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={getNotificationIcon(item.type, item.status)}
                      style={{
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: getStatusColor(item.status)
                      }}
                    />
                  }
                  title={
                    <div className='flex items-center'>
                      {!item.read && (
                        <Badge status='processing' className='mr-2' />
                      )}
                      <span>{item.title}</span>
                    </div>
                  }
                  description={
                    <div>
                      <div>{item.message}</div>
                      <div className='mt-1'>
                        <Space>
                          {item.machine && (
                            <Tag icon={<CarOutlined />} color='blue'>
                              {item.machine}
                            </Tag>
                          )}
                          {item.position && (
                            <Tag color='purple'>{item.position}</Tag>
                          )}
                          <Text type='secondary' className='text-xs'>
                            {new Date(item.date).toLocaleDateString()}
                          </Text>
                        </Space>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description='No notifications found' />
        )}
      </Card>
    </div>
  )
}

export default NotificationsPage
