'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Modal, 
  Form, 
  Rate, 
  Typography,
  Divider,
  Tabs,
  Statistic,
  Row,
  Col,
  Progress,
  Dropdown,
  Menu
} from 'antd'
import { 
  SearchOutlined, 
  FilterOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  BarChartOutlined,
  TeamOutlined,
  ToolOutlined,
  PieChartOutlined,
  EllipsisOutlined,
  ClockCircleOutlined,
  WarningOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { TabPane } = Tabs

export default function SiteManagerInspections() {
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [siteFilter, setSiteFilter] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('1')
  const [form] = Form.useForm()

  // Sample data for inspections
  const inspections = [
    {
      id: '1',
      date: '2023-06-15',
      fitter: 'John Doe',
      machine: 'M123',
      tyrePosition: 'Front Left',
      tyreSerial: 'T789456',
      status: 'Pending Review',
      site: 'North Pit',
      supervisor: 'Mike Brown',
      notes: 'Regular wear pattern observed. Tread depth at 60%.',
      images: ['inspection1.jpg'],
      priority: 'Medium'
    },
    {
      id: '2',
      date: '2023-06-14',
      fitter: 'Jane Smith',
      machine: 'M456',
      tyrePosition: 'Rear Right',
      tyreSerial: 'T123789',
      status: 'Approved',
      site: 'South Pit',
      supervisor: 'Sarah Wilson',
      notes: 'Good condition overall. No issues detected.',
      images: ['inspection2.jpg', 'inspection3.jpg'],
      priority: 'Low'
    },
    {
      id: '3',
      date: '2023-06-13',
      fitter: 'John Doe',
      machine: 'M789',
      tyrePosition: 'Front Right',
      tyreSerial: 'T456123',
      status: 'Requires Action',
      site: 'Main Workshop',
      supervisor: 'Mike Brown',
      notes: 'Significant sidewall damage detected. Immediate replacement recommended.',
      images: ['inspection4.jpg'],
      priority: 'High'
    },
    {
      id: '4',
      date: '2023-06-12',
      fitter: 'Sarah Johnson',
      machine: 'M123',
      tyrePosition: 'Rear Left',
      tyreSerial: 'T789123',
      status: 'Pending Review',
      site: 'North Pit',
      supervisor: 'Mike Brown',
      notes: 'Minor cuts on tread. Monitor during next inspection.',
      images: ['inspection5.jpg'],
      priority: 'Medium'
    },
    {
      id: '5',
      date: '2023-06-11',
      fitter: 'Mike Williams',
      machine: 'M456',
      tyrePosition: 'Front Left',
      tyreSerial: 'T456789',
      status: 'Approved',
      site: 'South Pit',
      supervisor: 'Sarah Wilson',
      notes: 'Tread wear even. Pressure within optimal range.',
      images: ['inspection6.jpg'],
      priority: 'Low'
    },
    {
      id: '6',
      date: '2023-06-10',
      fitter: 'James Taylor',
      machine: 'M789',
      tyrePosition: 'Rear Right',
      tyreSerial: 'T123456',
      status: 'Requires Action',
      site: 'Main Workshop',
      supervisor: 'David Clark',
      notes: 'Significant uneven wear on inner edge. Alignment issue suspected.',
      images: ['inspection7.jpg'],
      priority: 'High'
    },
    {
      id: '7',
      date: '2023-06-09',
      fitter: 'Emma Davis',
      machine: 'M456',
      tyrePosition: 'Front Right',
      tyreSerial: 'T987654',
      status: 'Approved',
      site: 'North Pit',
      supervisor: 'Mike Brown',
      notes: 'Normal wear pattern. Pressure adjusted to optimal level.',
      images: ['inspection8.jpg'],
      priority: 'Low'
    }
  ]

  // Sites for filtering
  const sites = ['North Pit', 'South Pit', 'Main Workshop']

  // Filter inspections based on search and filters
  const filteredInspections = inspections.filter(inspection => {
    // Filter by search text
    const matchesSearch = 
      inspection.fitter.toLowerCase().includes(searchText.toLowerCase()) ||
      inspection.machine.toLowerCase().includes(searchText.toLowerCase()) ||
      inspection.tyreSerial.toLowerCase().includes(searchText.toLowerCase()) ||
      inspection.notes.toLowerCase().includes(searchText.toLowerCase())
    
    // Filter by status
    const matchesStatus = statusFilter ? inspection.status === statusFilter : true
    
    // Filter by site
    const matchesSite = siteFilter ? inspection.site === siteFilter : true
    
    // Filter by date range
    let matchesDate = true
    if (dateRange && dateRange[0] && dateRange[1]) {
      const inspectionDate = dayjs(inspection.date)
      matchesDate = inspectionDate.isAfter(dateRange[0]) && inspectionDate.isBefore(dateRange[1])
    }
    
    return matchesSearch && matchesStatus && matchesSite && matchesDate
  })

  // Handle opening the inspection details modal
  const handleViewInspection = (inspection: any) => {
    setSelectedInspection(inspection)
    form.setFieldsValue({
      rating: 0,
      feedback: '',
      status: inspection.status,
      priority: inspection.priority
    })
    setIsModalVisible(true)
  }

  // Handle form submission for inspection approval/rejection
  const handleSubmit = (values: any) => {
    console.log('Inspection updated:', { id: selectedInspection.id, ...values })
    // Here you would normally update the inspection status in your backend
    setIsModalVisible(false)
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'red'
      case 'Medium': return 'orange'
      case 'Low': return 'green'
      default: return 'blue'
    }
  }

  // Columns configuration for the inspections table
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix()
    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
      filters: sites.map(site => ({ text: site, value: site })),
      onFilter: (value: any, record: any) => record.site === value
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
      title: 'Tyre Serial',
      dataIndex: 'tyreSerial',
      key: 'tyreSerial'
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
      filters: [
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' }
      ],
      onFilter: (value: any, record: any) => record.priority === value
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'green' : status === 'Requires Action' ? 'red' : 'orange'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" onClick={() => handleViewInspection(record)}>
            View Details
          </Button>
          <Dropdown 
            menu={{ 
              items: [
                { key: '1', label: 'Export to PDF' },
                { key: '2', label: 'Assign to Supervisor' },
                { key: '3', label: 'Mark as Critical' }
              ] 
            }}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ]

  // Inspection statistics
  const inspectionStats = {
    total: inspections.length,
    pending: inspections.filter(i => i.status === 'Pending Review').length,
    approved: inspections.filter(i => i.status === 'Approved').length,
    requiresAction: inspections.filter(i => i.status === 'Requires Action').length,
    completionRate: Math.round((inspections.filter(i => i.status === 'Approved').length / inspections.length) * 100),
    highPriority: inspections.filter(i => i.priority === 'High').length
  }

  // Inspection statistics by site
  const siteStats = sites.map(site => {
    const siteInspections = inspections.filter(i => i.site === site)
    return {
      site,
      total: siteInspections.length,
      approved: siteInspections.filter(i => i.status === 'Approved').length,
      requiresAction: siteInspections.filter(i => i.status === 'Requires Action').length,
      completionRate: siteInspections.length ? 
        Math.round((siteInspections.filter(i => i.status === 'Approved').length / siteInspections.length) * 100) : 0
    }
  })

  return (
    <div className="site-manager-inspections">
      <Title level={2} className='mb-4'>Tyre Inspections Management</Title>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        className="mb-4"
        size="large"
        style={{ background: '#fff' }}
      >
        <TabPane tab="All Inspections" key="1">
          {/* Summary stats */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card bodyStyle={{ padding: '20px' }}>
                <Statistic 
                  title="Total Inspections" 
                  value={inspectionStats.total} 
                  valueStyle={{ color: '#1677ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card bodyStyle={{ padding: '20px' }}>
                <Statistic 
                  title="Pending Review" 
                  value={inspectionStats.pending} 
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card bodyStyle={{ padding: '20px' }}>
                <Statistic 
                  title="Approved" 
                  value={inspectionStats.approved} 
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card bodyStyle={{ padding: '20px' }}>
                <Statistic 
                  title="Requires Action" 
                  value={inspectionStats.requiresAction} 
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card bodyStyle={{ padding: '20px' }}>
                <Statistic 
                  title="Completion Rate" 
                  value={inspectionStats.completionRate} 
                  suffix="%" 
                  valueStyle={{ color: inspectionStats.completionRate > 70 ? '#52c41a' : '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card bodyStyle={{ padding: '20px' }}>
                <Statistic 
                  title="High Priority" 
                  value={inspectionStats.highPriority} 
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
      
          {/* Filters and search */}
          <Card className="mb-6" bodyStyle={{ padding: '20px' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by fitter, machine, or serial number"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <RangePicker 
                  onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
                  allowClear
                  size="large"
                />
                <Select
                  placeholder="Filter by site"
                  style={{ width: 160 }}
                  onChange={value => setSiteFilter(value)}
                  allowClear
                  value={siteFilter}
                  size="large"
                >
                  {sites.map(site => (
                    <Option key={site} value={site}>{site}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="Filter by status"
                  style={{ width: 180 }}
                  onChange={value => setStatusFilter(value)}
                  allowClear
                  value={statusFilter}
                  size="large"
                >
                  <Option value="Pending Review">Pending Review</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Requires Action">Requires Action</Option>
                </Select>
              </div>
            </div>
          </Card>
          
          {/* Actions toolbar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <Text>Showing {filteredInspections.length} of {inspections.length} inspections</Text>
            </div>
            <Space size="middle">
              <Button icon={<DownloadOutlined />} size="large">Export</Button>
              <Button type="primary" size="large">Schedule Inspection</Button>
            </Space>
          </div>
          
          {/* Inspections table */}
          <Card bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={filteredInspections}
              columns={columns}
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`
              }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="Site Analytics" key="2">
          <Row gutter={[16, 16]} className="mb-6">
            {siteStats.map((site, index) => (
              <Col xs={24} md={8} key={index}>
                <Card 
                  title={site.site} 
                  bordered
                  bodyStyle={{ padding: '20px' }}
                >
                  <Statistic 
                    title="Total Inspections" 
                    value={site.total} 
                    className="mb-4"
                  />
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <Text>Approved</Text>
                      <Text>{site.approved}</Text>
                    </div>
                    <Progress percent={site.approved / site.total * 100} strokeColor="#52c41a" />
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <Text>Requires Action</Text>
                      <Text>{site.requiresAction}</Text>
                    </div>
                    <Progress percent={site.requiresAction / site.total * 100} strokeColor="#ff4d4f" />
                  </div>
                  <div className="mt-4">
                    <Text strong>Completion Rate</Text>
                    <Progress 
                      percent={site.completionRate} 
                      status={site.completionRate > 70 ? "success" : "normal"}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Card title="Performance Indicators" className="mb-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic
                    title="Average Inspection Time"
                    value={32}
                    suffix="min"
                    valueStyle={{ color: '#1677ff' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic
                    title="Inspections Per Day"
                    value={5.3}
                    precision={1}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic
                    title="Issue Detection Rate"
                    value={18}
                    suffix="%"
                    valueStyle={{ color: '#faad14' }}
                    prefix={<ExclamationCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card>
                  <Statistic
                    title="Team Efficiency"
                    value={87}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
      
      {/* Inspection details modal */}
      {selectedInspection && (
        <Modal
          title="Inspection Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={700}
        >
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Text strong>Date:</Text> {selectedInspection.date}
              </div>
              <div>
                <Text strong>Site:</Text> {selectedInspection.site}
              </div>
              <div>
                <Text strong>Supervisor:</Text> {selectedInspection.supervisor}
              </div>
              <div>
                <Text strong>Fitter:</Text> {selectedInspection.fitter}
              </div>
              <div>
                <Text strong>Machine:</Text> {selectedInspection.machine}
              </div>
              <div>
                <Text strong>Tyre Position:</Text> {selectedInspection.tyrePosition}
              </div>
              <div>
                <Text strong>Tyre Serial:</Text> {selectedInspection.tyreSerial}
              </div>
              <div>
                <Text strong>Priority:</Text>{' '}
                <Tag color={getPriorityColor(selectedInspection.priority)}>
                  {selectedInspection.priority}
                </Tag>
              </div>
              <div>
                <Text strong>Status:</Text>{' '}
                <Tag color={selectedInspection.status === 'Approved' ? 'green' : selectedInspection.status === 'Requires Action' ? 'red' : 'orange'}>
                  {selectedInspection.status}
                </Tag>
              </div>
            </div>
            
            <Divider orientation="left">Notes</Divider>
            <p>{selectedInspection.notes}</p>
            
            <Divider orientation="left">Images</Divider>
            <div className="flex gap-2 mb-4">
              {selectedInspection.images.map((image: string, index: number) => (
                <div key={index} className="border p-2 rounded">
                  <p className="text-center text-gray-500">{image}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Divider />
          
          {/* Site Manager review form */}
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="priority"
              label="Update Priority"
              rules={[{ required: true, message: 'Please select a priority' }]}
            >
              <Select>
                <Option value="High">
                  <Tag color="red">High</Tag>
                </Option>
                <Option value="Medium">
                  <Tag color="orange">Medium</Tag>
                </Option>
                <Option value="Low">
                  <Tag color="green">Low</Tag>
                </Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="feedback"
              label="Management Notes"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            
            <Form.Item
              name="status"
              label="Update Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select>
                <Option value="Approved">
                  <CheckCircleOutlined /> Approve
                </Option>
                <Option value="Requires Action">
                  <ExclamationCircleOutlined /> Requires Action
                </Option>
                <Option value="Escalated">
                  <WarningOutlined /> Escalate
                </Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="assignTo"
              label="Assign To"
            >
              <Select placeholder="Select a staff member">
                <Option value="mike">Mike Brown</Option>
                <Option value="sarah">Sarah Wilson</Option>
                <Option value="david">David Clark</Option>
              </Select>
            </Form.Item>
            
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Inspection
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  )
} 