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
  Divider
} from 'antd'
import { 
  SearchOutlined, 
  FilterOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

export default function SupervisorInspections() {
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<any>(null)
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
      notes: 'Regular wear pattern observed. Tread depth at 60%.',
      images: ['inspection1.jpg']
    },
    {
      id: '2',
      date: '2023-06-14',
      fitter: 'Jane Smith',
      machine: 'M456',
      tyrePosition: 'Rear Right',
      tyreSerial: 'T123789',
      status: 'Approved',
      notes: 'Good condition overall. No issues detected.',
      images: ['inspection2.jpg', 'inspection3.jpg']
    },
    {
      id: '3',
      date: '2023-06-13',
      fitter: 'John Doe',
      machine: 'M789',
      tyrePosition: 'Front Right',
      tyreSerial: 'T456123',
      status: 'Requires Action',
      notes: 'Significant sidewall damage detected. Immediate replacement recommended.',
      images: ['inspection4.jpg']
    },
    {
      id: '4',
      date: '2023-06-12',
      fitter: 'Sarah Johnson',
      machine: 'M123',
      tyrePosition: 'Rear Left',
      tyreSerial: 'T789123',
      status: 'Pending Review',
      notes: 'Minor cuts on tread. Monitor during next inspection.',
      images: ['inspection5.jpg']
    },
    {
      id: '5',
      date: '2023-06-11',
      fitter: 'Mike Williams',
      machine: 'M456',
      tyrePosition: 'Front Left',
      tyreSerial: 'T456789',
      status: 'Approved',
      notes: 'Tread wear even. Pressure within optimal range.',
      images: ['inspection6.jpg']
    }
  ]

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
    
    // Filter by date range
    let matchesDate = true
    if (dateRange && dateRange[0] && dateRange[1]) {
      const inspectionDate = dayjs(inspection.date)
      matchesDate = inspectionDate.isAfter(dateRange[0]) && inspectionDate.isBefore(dateRange[1])
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Handle opening the inspection details modal
  const handleViewInspection = (inspection: any) => {
    setSelectedInspection(inspection)
    form.setFieldsValue({
      rating: 0,
      feedback: '',
      status: inspection.status
    })
    setIsModalVisible(true)
  }

  // Handle form submission for inspection approval/rejection
  const handleSubmit = (values: any) => {
    console.log('Inspection updated:', { id: selectedInspection.id, ...values })
    // Here you would normally update the inspection status in your backend
    setIsModalVisible(false)
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
      title: 'Tyre Position',
      dataIndex: 'tyrePosition',
      key: 'tyrePosition'
    },
    {
      title: 'Tyre Serial',
      dataIndex: 'tyreSerial',
      key: 'tyreSerial'
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
        <Button type="primary" onClick={() => handleViewInspection(record)}>
          View Details
        </Button>
      )
    }
  ]

  return (
    <>
      <Title level={2} className='mb-4'>Tyre Inspections</Title>
      
      {/* Filters and search */}
      <Card className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by fitter, machine, or serial number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <RangePicker 
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
              allowClear
            />
            <Select
              placeholder="Filter by status"
              style={{ width: 160 }}
              onChange={value => setStatusFilter(value)}
              allowClear
              value={statusFilter}
            >
              <Option value="Pending Review">Pending Review</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Requires Action">Requires Action</Option>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Inspections table */}
      <Card>
        <Table
          dataSource={filteredInspections}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
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
          
          {/* Supervisor review form */}
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="rating"
              label="Quality Rating"
              rules={[{ required: true, message: 'Please rate the inspection quality' }]}
            >
              <Rate />
            </Form.Item>
            
            <Form.Item
              name="feedback"
              label="Feedback"
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
                <Option value="Rejected">
                  <CloseCircleOutlined /> Reject
                </Option>
              </Select>
            </Form.Item>
            
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  )
} 