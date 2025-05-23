'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Select, 
  Space, 
  Typography,
  Statistic,
  Row,
  Col,
  Progress,
  Tabs,
  Badge,
  Drawer,
  Descriptions,
  List,
  Avatar
} from 'antd'
import { 
  SearchOutlined, 
  BarChartOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  CaretRightOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select

const SupervisorTyres = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedTyre, setSelectedTyre] = useState<any>(null)

  // Sample data for tyres
  const tyres = [
    {
      id: 'T001',
      serial: 'SN123456',
      brand: 'Michelin',
      model: 'X Mine D2',
      size: '27.00R49',
      location: 'Main Workshop',
      status: 'In Service',
      machine: 'Haul Truck 01',
      position: 'Front Left',
      installDate: '2023-01-15',
      treadDepth: 78,
      hours: 1200,
      history: [
        { date: '2023-01-15', event: 'Installation', details: 'Installed on Haul Truck 01, Front Left' },
        { date: '2023-03-10', event: 'Inspection', details: 'Tread depth: 85%, Pressure adjusted' },
        { date: '2023-05-20', event: 'Inspection', details: 'Tread depth: 78%, No issues detected' }
      ]
    },
    {
      id: 'T002',
      serial: 'SN234567',
      brand: 'Bridgestone',
      model: 'VSDL',
      size: '27.00R49',
      location: 'Main Workshop',
      status: 'In Stock',
      machine: '',
      position: '',
      installDate: '',
      treadDepth: 100,
      hours: 0,
      history: [
        { date: '2023-02-10', event: 'Received', details: 'Added to inventory' },
        { date: '2023-04-05', event: 'Inspection', details: 'Quality check passed' }
      ]
    },
    {
      id: 'T003',
      serial: 'SN345678',
      brand: 'Goodyear',
      model: 'RT-4A',
      size: '24.00R35',
      location: 'North Pit',
      status: 'In Service',
      machine: 'Loader 03',
      position: 'Rear Right',
      installDate: '2022-11-20',
      treadDepth: 45,
      hours: 2100,
      history: [
        { date: '2022-11-20', event: 'Installation', details: 'Installed on Loader 03, Rear Right' },
        { date: '2023-01-15', event: 'Inspection', details: 'Tread depth: 72%, Minor cuts observed' },
        { date: '2023-03-25', event: 'Inspection', details: 'Tread depth: 58%, Wear accelerating' },
        { date: '2023-05-30', event: 'Inspection', details: 'Tread depth: 45%, Scheduled for rotation' }
      ]
    },
    {
      id: 'T004',
      serial: 'SN456789',
      brand: 'Michelin',
      model: 'X Mine D2',
      size: '27.00R49',
      location: 'South Pit',
      status: 'Needs Replacement',
      machine: 'Haul Truck 05',
      position: 'Rear Left',
      installDate: '2022-08-10',
      treadDepth: 12,
      hours: 3200,
      history: [
        { date: '2022-08-10', event: 'Installation', details: 'Installed on Haul Truck 05, Rear Left' },
        { date: '2022-10-20', event: 'Inspection', details: 'Tread depth: 80%, No issues detected' },
        { date: '2023-01-05', event: 'Inspection', details: 'Tread depth: 60%, Normal wear pattern' },
        { date: '2023-03-15', event: 'Inspection', details: 'Tread depth: 30%, Accelerated wear noted' },
        { date: '2023-06-01', event: 'Inspection', details: 'Tread depth: 12%, Replacement required' }
      ]
    },
    {
      id: 'T005',
      serial: 'SN567890',
      brand: 'Bridgestone',
      model: 'VRDP',
      size: '24.00R35',
      location: 'Workshop B',
      status: 'Under Repair',
      machine: 'Formerly on Loader 02',
      position: 'Previously Front Right',
      installDate: '2022-09-15',
      treadDepth: 55,
      hours: 1800,
      history: [
        { date: '2022-09-15', event: 'Installation', details: 'Installed on Loader 02, Front Right' },
        { date: '2022-12-10', event: 'Inspection', details: 'Tread depth: 85%, No issues detected' },
        { date: '2023-03-05', event: 'Inspection', details: 'Tread depth: 70%, Normal wear pattern' },
        { date: '2023-05-25', event: 'Damage Report', details: 'Sidewall puncture detected' },
        { date: '2023-05-26', event: 'Removal', details: 'Removed for repair' }
      ]
    }
  ]

  // Filter tyres based on search and filters
  const filteredTyres = tyres.filter(tyre => {
    // Filter by search text
    const matchesSearch = 
      tyre.serial.toLowerCase().includes(searchText.toLowerCase()) ||
      tyre.brand.toLowerCase().includes(searchText.toLowerCase()) ||
      tyre.model.toLowerCase().includes(searchText.toLowerCase()) ||
      tyre.machine.toLowerCase().includes(searchText.toLowerCase())
    
    // Filter by status
    const matchesStatus = statusFilter ? tyre.status === statusFilter : true
    
    return matchesSearch && matchesStatus
  })

  // Handle opening the tyre details drawer
  const handleViewTyre = (tyre: any) => {
    setSelectedTyre(tyre)
    setDrawerVisible(true)
  }

  // Get status color based on tyre status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Service':
        return 'green'
      case 'In Stock':
        return 'blue'
      case 'Under Repair':
        return 'orange'
      case 'Needs Replacement':
        return 'red'
      default:
        return 'default'
    }
  }

  // Get condition color based on tread depth
  const getConditionColor = (treadDepth: number) => {
    if (treadDepth >= 70) return 'green'
    if (treadDepth >= 40) return 'orange'
    return 'red'
  }

  // Columns configuration for the tyres table
  const columns = [
    {
      title: 'Serial',
      dataIndex: 'serial',
      key: 'serial',
    },
    {
      title: 'Brand/Model',
      key: 'brand',
      render: (tyre: any) => `${tyre.brand} ${tyre.model}`
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine',
      render: (machine: string) => machine || '-'
    },
    {
      title: 'Condition',
      key: 'condition',
      render: (tyre: any) => (
        <Progress 
          percent={tyre.treadDepth} 
          size="small" 
          status={tyre.treadDepth < 20 ? "exception" : undefined}
          strokeColor={getConditionColor(tyre.treadDepth)}
        />
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, tyre: any) => (
        <Button type="primary" onClick={() => handleViewTyre(tyre)}>
          View Details
        </Button>
      )
    }
  ]

  return (
    <>
      <Title level={2} className='mb-4'>Tyre Management</Title>
      
      {/* Summary stats */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Tyres" 
              value={tyres.length} 
              valueStyle={{ color: '#1677ff' }}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="In Service" 
              value={tyres.filter(t => t.status === 'In Service').length} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Under Repair" 
              value={tyres.filter(t => t.status === 'Under Repair').length} 
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Needs Replacement" 
              value={tyres.filter(t => t.status === 'Needs Replacement').length} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Filters and search */}
      <Card className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by serial, brand, model, or machine"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          <div>
            <Select
              placeholder="Filter by status"
              style={{ width: 160 }}
              onChange={value => setStatusFilter(value)}
              allowClear
              value={statusFilter}
            >
              <Option value="In Service">In Service</Option>
              <Option value="In Stock">In Stock</Option>
              <Option value="Under Repair">Under Repair</Option>
              <Option value="Needs Replacement">Needs Replacement</Option>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Tyres table */}
      <Card>
        <Table
          dataSource={filteredTyres}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      {/* Tyre details drawer */}
      {selectedTyre && (
        <Drawer
          title={`Tyre Details: ${selectedTyre.serial}`}
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={600}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Information" key="1">
              <Descriptions bordered column={1} className="mb-4">
                <Descriptions.Item label="Serial Number">{selectedTyre.serial}</Descriptions.Item>
                <Descriptions.Item label="Brand / Model">{selectedTyre.brand} {selectedTyre.model}</Descriptions.Item>
                <Descriptions.Item label="Size">{selectedTyre.size}</Descriptions.Item>
                <Descriptions.Item label="Current Location">{selectedTyre.location}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedTyre.status)}>{selectedTyre.status}</Tag>
                </Descriptions.Item>
                {selectedTyre.machine && (
                  <Descriptions.Item label="Machine">{selectedTyre.machine}</Descriptions.Item>
                )}
                {selectedTyre.position && (
                  <Descriptions.Item label="Position">{selectedTyre.position}</Descriptions.Item>
                )}
                {selectedTyre.installDate && (
                  <Descriptions.Item label="Installation Date">{selectedTyre.installDate}</Descriptions.Item>
                )}
                <Descriptions.Item label="Tread Depth">
                  <Progress 
                    percent={selectedTyre.treadDepth} 
                    status={selectedTyre.treadDepth < 20 ? "exception" : undefined}
                    strokeColor={getConditionColor(selectedTyre.treadDepth)}
                  />
                </Descriptions.Item>
                {selectedTyre.hours > 0 && (
                  <Descriptions.Item label="Hours in Operation">{selectedTyre.hours}</Descriptions.Item>
                )}
              </Descriptions>
              
              <div className="flex justify-end mt-4">
                <Space>
                  <Button type="primary">Update Status</Button>
                  <Button>Schedule Inspection</Button>
                </Space>
              </div>
            </TabPane>
            
            <TabPane tab="History" key="2">
              <List
                itemLayout="horizontal"
                dataSource={selectedTyre.history}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<CaretRightOutlined />} />}
                      title={<span><Text strong>{item.date}</Text> - {item.event}</span>}
                      description={item.details}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Drawer>
      )}
    </>
  )
}

export default SupervisorTyres 