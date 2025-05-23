'use client'

import React from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Progress, Button } from 'antd'
import { useUser } from '../../contexts/UserContext'
import {
  CheckCircleOutlined,
  WarningOutlined,
  TeamOutlined,
  BarChartOutlined,
  LineChartOutlined,
  FieldTimeOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const SupervisorDashboard = () => {
  const { userData } = useUser()

  // Sample data for inspections
  const inspections = [
    {
      id: '1',
      date: '2023-06-15',
      fitter: 'John Doe',
      machine: 'M123',
      status: 'Pending Review'
    },
    {
      id: '2',
      date: '2023-06-14',
      fitter: 'Jane Smith',
      machine: 'M456',
      status: 'Approved'
    },
    {
      id: '3',
      date: '2023-06-13',
      fitter: 'John Doe',
      machine: 'M789',
      status: 'Requires Action'
    }
  ]

  // Columns configuration for the table
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Fitter',
      dataIndex: 'fitter',
      key: 'fitter'
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'Approved'
              ? 'green'
              : status === 'Requires Action'
              ? 'red'
              : 'orange'
          }
        >
          {status}
        </Tag>
      )
    }
  ]

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>Supervisor Dashboard</h1>
      <p className='mb-4'>Welcome, {userData?.name || 'Supervisor'}!</p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title='Team Members'
              value={6}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title='Inspections Pending Review'
              value={3}
              prefix={<WarningOutlined />}
            />
            <div className='mt-2'>
              <Link to='/supervisor/inspections'>View inspections</Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title='Completed This Week'
              value={18}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className='mt-4 mb-6'>
        <Col xs={24} md={12}>
          <Card title='Recent Inspections'>
            <Table
              dataSource={inspections}
              columns={columns}
              rowKey='id'
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title='Site Performance'>
            <div className='mb-4'>
              <div className='flex justify-between mb-1'>
                <span>Inspection Completion Rate</span>
                <span>92%</span>
              </div>
              <Progress percent={92} />
            </div>
            <div className='mb-4'>
              <div className='flex justify-between mb-1'>
                <span>Tyre Change Rate</span>
                <span>85%</span>
              </div>
              <Progress percent={85} />
            </div>
            <div>
              <div className='flex justify-between mb-1'>
                <span>Safety Compliance</span>
                <span>98%</span>
              </div>
              <Progress percent={98} />
            </div>
          </Card>
        </Col>
      </Row>

      <Card title='Analytics & Reports' className='mb-4'>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card
              className='shadow hover:shadow-lg transition-shadow'
              variant='borderless'
            >
              <div className='text-center'>
                <BarChartOutlined className='text-4xl text-blue-500 mb-2' />
                <h3 className='text-lg font-medium mb-2'>Tyre Performance</h3>
                <p className='text-gray-500 mb-4'>
                  Access analytics on tyre costs, lifespans, and failure rates
                </p>
                <Link href='/sitemanager/reports?tab=costs'>
                  <Button type='primary'>View Reports</Button>
                </Link>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card
              className='shadow hover:shadow-lg transition-shadow'
              variant='borderless'
            >
              <div className='text-center'>
                <LineChartOutlined className='text-4xl text-green-500 mb-2' />
                <h3 className='text-lg font-medium mb-2'>Failure Analysis</h3>
                <p className='text-gray-500 mb-4'>
                  Review failure patterns and scrap analysis
                </p>
                <Link href='/sitemanager/reports?tab=failure'>
                  <Button type='primary'>View Analysis</Button>
                </Link>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card
              className='shadow hover:shadow-lg transition-shadow'
              variant='borderless'
            >
              <div className='text-center'>
                <FieldTimeOutlined className='text-4xl text-orange-500 mb-2' />
                <h3 className='text-lg font-medium mb-2'>Transmission Hours</h3>
                <p className='text-gray-500 mb-4'>
                  Analyze hour meter readings and tyre performance
                </p>
                <Link href='/sitemanager/reports/transmission-hours'>
                  <Button type='primary'>View Details</Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default SupervisorDashboard
