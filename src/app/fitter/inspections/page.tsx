'use client'

import React, { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Typography,
  Tabs,
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  message,
  Upload,
  Modal,
  Divider,
  Space
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useUser } from '../../../contexts/UserContext'
import type { ColumnsType } from 'antd/es/table'
import type { UploadProps } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

// Define tyre status options
const TYRE_STATUS = [
  { value: 'good', label: 'Good', color: 'green' },
  { value: 'fair', label: 'Fair', color: 'blue' },
  { value: 'monitor', label: 'Monitor', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' }
]

// Mock machines and tyres data
const MACHINES = [
  { id: 'IBL001', name: 'IBL001 - LHD', type: 'LHD' },
  { id: 'IBL002', name: 'IBL002 - LHD', type: 'LHD' },
  { id: 'IBL003', name: 'IBL003 - LHD', type: 'LHD' },
  { id: 'IDL001', name: 'IDL001 - Drill Rig', type: 'Drill Rig' },
  { id: 'IDL002', name: 'IDL002 - Drill Rig', type: 'Drill Rig' }
]

// Mock fitted tyres for inspection
const FITTED_TYRES = [
  {
    id: 'FT001',
    tyreId: 'T009',
    serialNumber: 'BS265003',
    brand: 'Bridgestone',
    size: '26.5R25',
    machine: 'IBL001',
    position: 'Left Front',
    installDate: '2023-07-15',
    hoursAtInstall: 2450
  },
  {
    id: 'FT002',
    tyreId: 'T010',
    serialNumber: 'MC265004',
    brand: 'Michelin',
    size: '26.5R25',
    machine: 'IBL001',
    position: 'Right Front',
    installDate: '2023-07-15',
    hoursAtInstall: 2450
  },
  {
    id: 'FT003',
    tyreId: 'T011',
    serialNumber: 'BS265005',
    brand: 'Bridgestone',
    size: '26.5R25',
    machine: 'IBL002',
    position: 'Left Rear',
    installDate: '2023-06-30',
    hoursAtInstall: 3200
  }
]

// Mock inspection history
const INSPECTION_HISTORY = [
  {
    id: 'I001',
    tyreId: 'T009',
    tyreSerial: 'BS265003',
    machine: 'IBL001',
    position: 'Left Front',
    date: '2023-07-25',
    treadDepth: 52.3,
    pressure: 85,
    status: 'good',
    notes: 'Tyre in good condition, normal wear pattern',
    inspector: 'Tyre Fitter',
    transHours: 2580
  },
  {
    id: 'I002',
    tyreId: 'T010',
    tyreSerial: 'MC265004',
    machine: 'IBL001',
    position: 'Right Front',
    date: '2023-07-25',
    treadDepth: 51.8,
    pressure: 80,
    status: 'fair',
    notes: 'Slight uneven wear on outer edge',
    inspector: 'Tyre Fitter',
    transHours: 2580
  },
  {
    id: 'I003',
    tyreId: 'T009',
    tyreSerial: 'BS265003',
    machine: 'IBL001',
    position: 'Left Front',
    date: '2023-08-10',
    treadDepth: 48.7,
    pressure: 83,
    status: 'fair',
    notes: 'Wearing normally, pressure adjusted',
    inspector: 'Tyre Fitter',
    transHours: 2750
  }
]

// Define scheduled inspections
const SCHEDULED_INSPECTIONS = [
  {
    id: 'S001',
    machine: 'IBL001',
    dueDate: '2023-08-25',
    status: 'pending',
    assignedTo: 'Tyre Fitter',
    priority: 'high'
  },
  {
    id: 'S002',
    machine: 'IBL002',
    dueDate: '2023-08-26',
    status: 'pending',
    assignedTo: 'Tyre Fitter',
    priority: 'medium'
  },
  {
    id: 'S003',
    machine: 'IDL001',
    dueDate: '2023-08-28',
    status: 'pending',
    assignedTo: 'Tyre Fitter',
    priority: 'low'
  }
]

// Get status color for display
const getStatusColor = (status: string) => {
  const statusObj = TYRE_STATUS.find(s => s.value === status)
  return statusObj?.color || 'default'
}

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

// For file upload previews
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

const InspectionsPage = () => {
  const { userData } = useUser()
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('scheduled')
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [selectedTyre, setSelectedTyre] = useState<string | null>(null)
  const [currentHours, setCurrentHours] = useState<number>(0)

  // For image upload
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // For displaying tyres on a specific machine
  const [machineTyres, setMachineTyres] = useState<typeof FITTED_TYRES>([])

  // Handle machine selection
  const handleMachineSelect = (machineId: string) => {
    setSelectedMachine(machineId)

    // Filter tyres for this machine
    const tyresForMachine = FITTED_TYRES.filter(
      tyre => tyre.machine === machineId
    )
    setMachineTyres(tyresForMachine)

    // Simulate getting machine hours
    const simulatedHours = Math.floor(2000 + Math.random() * 5000)
    setCurrentHours(simulatedHours)
  }

  // Handle tyre selection
  const handleTyreSelect = (tyreId: string) => {
    setSelectedTyre(tyreId)
  }

  // Handle form submission
  const handleInspectionSubmit = (values: any) => {
    console.log('Inspection values:', values)
    // Here we would save the inspection to the database

    // Handle file uploads
    const fileUrls = fileList.map(file => ({
      uid: file.uid,
      name: file.name,
      url: URL.createObjectURL(file.originFileObj as Blob)
    }))

    console.log('Uploaded files:', fileUrls)

    message.success('Inspection recorded successfully')
    form.resetFields()
    setFileList([])
    setSelectedMachine(null)
    setSelectedTyre(null)
  }

  // Image upload handlers
  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  // Table columns for history
  const historyColumns: ColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: text => new Date(text).toLocaleDateString()
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine'
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: 'Serial Number',
      dataIndex: 'tyreSerial',
      key: 'tyreSerial'
    },
    {
      title: 'Tread Depth',
      dataIndex: 'treadDepth',
      key: 'treadDepth',
      render: depth => `${depth} mm`
    },
    {
      title: 'Pressure',
      dataIndex: 'pressure',
      key: 'pressure',
      render: pressure => `${pressure} psi`
    },
    {
      title: 'Trans Hours',
      dataIndex: 'transHours',
      key: 'transHours'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    }
  ]

  // Table columns for scheduled inspections
  const scheduledColumns: ColumnsType<any> = [
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine'
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      render: text => new Date(text).toLocaleDateString()
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: priority => (
        <Tag color={getPriorityColor(priority)}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        if (status === 'pending') {
          return (
            <Tag icon={<ClockCircleOutlined />} color='processing'>
              Pending
            </Tag>
          )
        } else if (status === 'completed') {
          return (
            <Tag icon={<CheckCircleOutlined />} color='success'>
              Completed
            </Tag>
          )
        }
        return <Tag color='default'>{status}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type='primary'
          size='small'
          onClick={() => {
            handleMachineSelect(record.machine)
            setActiveTab('new')
          }}
        >
          Start Inspection
        </Button>
      )
    }
  ]

  return (
    <div className='inspections-page'>
      <Title level={2} className='mb-6'>
        Tyre Inspections
      </Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type='card'
        className='mb-6'
      >
        <TabPane
          tab={
            <span>
              <ClockCircleOutlined /> Scheduled ({SCHEDULED_INSPECTIONS.length})
            </span>
          }
          key='scheduled'
        >
          <Card>
            <Table
              columns={scheduledColumns}
              dataSource={SCHEDULED_INSPECTIONS}
              rowKey='id'
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <PlusOutlined /> New Inspection
            </span>
          }
          key='new'
        >
          <Card>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleInspectionSubmit}
              initialValues={{
                date: dayjs(),
                transHours: currentHours
              }}
            >
              <div className='mb-6'>
                <Text type='secondary'>
                  Complete this form to record a new tyre inspection. Required
                  fields are marked with an asterisk (*).
                </Text>
              </div>

              <Form.Item
                name='machine'
                label='Select Machine'
                rules={[{ required: true, message: 'Please select a machine' }]}
              >
                <Select
                  placeholder='Select machine'
                  onChange={handleMachineSelect}
                  value={selectedMachine}
                  showSearch
                  optionFilterProp='children'
                >
                  {MACHINES.map(machine => (
                    <Option key={machine.id} value={machine.id}>
                      {machine.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name='tyre'
                label='Select Tyre'
                rules={[{ required: true, message: 'Please select a tyre' }]}
              >
                <Select
                  placeholder='Select tyre'
                  onChange={handleTyreSelect}
                  disabled={!selectedMachine}
                >
                  {machineTyres.map(tyre => (
                    <Option key={tyre.id} value={tyre.id}>
                      {tyre.serialNumber} - {tyre.position} - {tyre.brand}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name='date'
                label='Inspection Date'
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name='transHours'
                label='Current Transmission Hours'
                rules={[{ required: true, message: 'Please enter hours' }]}
                tooltip='Current hour meter reading of the machine'
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.1}
                  disabled={!selectedMachine}
                  value={currentHours}
                />
              </Form.Item>

              <Form.Item
                name='treadDepth'
                label='Tread Depth (mm)'
                rules={[
                  { required: true, message: 'Please enter tread depth' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.1}
                  disabled={!selectedTyre}
                />
              </Form.Item>

              <Form.Item
                name='pressure'
                label='Pressure (psi)'
                rules={[{ required: true, message: 'Please enter pressure' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  disabled={!selectedTyre}
                />
              </Form.Item>

              <Form.Item
                name='status'
                label='Tyre Condition'
                rules={[{ required: true, message: 'Please select condition' }]}
              >
                <Select
                  placeholder='Select tyre condition'
                  disabled={!selectedTyre}
                >
                  {TYRE_STATUS.map(status => (
                    <Option key={status.value} value={status.value}>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name='notes' label='Notes'>
                <Input.TextArea rows={3} disabled={!selectedTyre} />
              </Form.Item>

              <Form.Item name='photos' label='Upload Photos'>
                <Upload
                  listType='picture-card'
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={() => false} // Prevent auto upload
                  disabled={!selectedTyre}
                >
                  {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Text type='secondary'>
                  Upload up to 4 photos of the tyre condition.
                </Text>
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<FileImageOutlined />}
                  size='large'
                  disabled={!selectedTyre}
                >
                  Record Inspection
                </Button>
              </Form.Item>
            </Form>

            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt='tyre photo'
                style={{ width: '100%' }}
                src={previewImage}
              />
            </Modal>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextOutlined /> Inspection History
            </span>
          }
          key='history'
        >
          <Card>
            <div className='mb-4'>
              <Space size='middle'>
                <Form.Item
                  label='Filter by Machine'
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder='All Machines'
                    allowClear
                    style={{ width: 200 }}
                    onChange={value => console.log('Filter by machine:', value)}
                  >
                    {MACHINES.map(machine => (
                      <Option key={machine.id} value={machine.id}>
                        {machine.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label='Date Range' style={{ marginBottom: 0 }}>
                  <DatePicker.RangePicker
                    onChange={dates => console.log('Date range:', dates)}
                  />
                </Form.Item>
              </Space>
            </div>

            <Table
              columns={historyColumns}
              dataSource={INSPECTION_HISTORY}
              rowKey='id'
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default InspectionsPage
