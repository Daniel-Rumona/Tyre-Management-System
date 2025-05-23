'use client'

import React, { useState } from 'react'
import {
  Card,
  Table,
  Typography,
  Tag,
  Button,
  DatePicker,
  Select,
  Space,
  Descriptions,
  Badge,
  Dropdown,
  Tooltip,
  Form,
  Row,
  Col,
  Statistic,
  Input,
  Modal,
  InputNumber
} from 'antd'
import {
  ToolOutlined,
  ExportOutlined,
  FilterOutlined,
  DownOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useUser } from '../../../contexts/UserContext'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

// Mock available tyres data - would come from an API in production
const AVAILABLE_TYRES = [
  {
    id: 'T001',
    serialNumber: 'BS265001',
    brand: 'Bridgestone',
    size: '26.5R25'
  },
  {
    id: 'T002',
    serialNumber: 'BS265002',
    brand: 'Bridgestone',
    size: '26.5R25'
  },
  { id: 'T003', serialNumber: 'MC265001', brand: 'Michelin', size: '26.5R25' },
  { id: 'T004', serialNumber: 'AP265001', brand: 'Apollo', size: '26.5R25' },
  {
    id: 'T005',
    serialNumber: 'BS175001',
    brand: 'Bridgestone',
    size: '17.5R25'
  },
  {
    id: 'T006',
    serialNumber: 'MC446001',
    brand: 'Michelin',
    size: '445-65R22.5'
  },
  {
    id: 'T007',
    serialNumber: 'BS120001',
    brand: 'Bridgestone',
    size: '12.00R20'
  },
  {
    id: 'T008',
    serialNumber: 'BS124001',
    brand: 'Bridgestone',
    size: '12.00R24'
  }
]

// Mock fitted tyres - would come from an API in production
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

// Mock fitment log data - would come from an API in production
const FITMENT_LOGS = [
  {
    id: 'FL001',
    date: '2023-08-15',
    machine: 'IBL001',
    position: 'Left Front',
    serialNumber: 'BS265003',
    brand: 'Bridgestone',
    size: '26.5R25',
    operationType: 'Fitment',
    hoursAtOperation: 2450,
    treadDepth: 60.0,
    pressure: 85,
    operator: 'Tyre Fitter',
    notes: 'New tyre fitted'
  },
  {
    id: 'FL002',
    date: '2023-08-15',
    machine: 'IBL001',
    position: 'Right Front',
    serialNumber: 'MC265004',
    brand: 'Michelin',
    size: '26.5R25',
    operationType: 'Fitment',
    hoursAtOperation: 2450,
    treadDepth: 62.0,
    pressure: 85,
    operator: 'Tyre Fitter',
    notes: 'New tyre fitted'
  },
  {
    id: 'FL003',
    date: '2023-08-14',
    machine: 'IBL002',
    position: 'Right Rear',
    serialNumber: 'MC265004',
    brand: 'Michelin',
    size: '26.5R25',
    operationType: 'Removal',
    hoursAtOperation: 4325,
    treadDepth: 34.5,
    pressure: 75,
    operator: 'Tyre Fitter',
    removalReason: 'Crown Damaged',
    notes: 'Significant damage to crown area, not suitable for repair'
  },
  {
    id: 'FL004',
    date: '2023-08-13',
    machine: 'IDL001',
    position: 'Left Rear',
    serialNumber: 'BS120001',
    brand: 'Bridgestone',
    size: '12.00R20',
    operationType: 'Fitment',
    hoursAtOperation: 1850,
    treadDepth: 55.0,
    pressure: 70,
    operator: 'Tyre Fitter',
    notes: 'Replacement after puncture repair'
  },
  {
    id: 'FL005',
    date: '2023-08-10',
    machine: 'IDL001',
    position: 'Left Rear',
    serialNumber: 'BS120001',
    brand: 'Bridgestone',
    size: '12.00R20',
    operationType: 'Removal',
    hoursAtOperation: 1780,
    treadDepth: 52.5,
    pressure: 40,
    operator: 'Tyre Fitter',
    removalReason: 'Tread Penetration',
    notes: 'Puncture in tread area, sent for repair'
  },
  {
    id: 'FL006',
    date: '2023-08-05',
    machine: 'IBL003',
    position: 'Spare',
    serialNumber: 'AP265001',
    brand: 'Apollo',
    size: '26.5R25',
    operationType: 'Fitment',
    hoursAtOperation: 0,
    treadDepth: 58.0,
    pressure: 80,
    operator: 'Tyre Fitter',
    notes: 'New spare tyre added to inventory for IBL003'
  },
  {
    id: 'FL007',
    date: '2023-08-01',
    machine: 'IBOLT1',
    position: 'Right Front',
    serialNumber: 'BS175001',
    brand: 'Bridgestone',
    size: '17.5R25',
    operationType: 'Removal',
    hoursAtOperation: 3250,
    treadDepth: 5.2,
    pressure: 65,
    operator: 'Tyre Fitter',
    removalReason: 'Worn out',
    notes: 'Tread worn below minimum allowed depth'
  }
]

// Mock machines
const MACHINES = [
  { id: 'IBL001', name: 'IBL001 - LHD' },
  { id: 'IBL002', name: 'IBL002 - LHD' },
  { id: 'IBL003', name: 'IBL003 - LHD' },
  { id: 'IDL001', name: 'IDL001 - Drill Rig' },
  { id: 'IDL002', name: 'IDL002 - Drill Rig' },
  { id: 'IBOLT1', name: 'IBOLT1 - Bolter' },
  { id: 'IMAN01', name: 'IMAN01 - Manitou' }
]

// Define positions based on requirements
const POSITIONS = [
  'Left Front',
  'Right Front',
  'Left Rear',
  'Right Rear',
  'Spare'
]

// Define removal reasons based on requirements
const REMOVAL_REASONS = [
  'Worn out',
  'Crown Damaged',
  'Sidewall Damaged',
  'Tread Penetration',
  'Bead Damaged',
  'Impact Damaged',
  'Rim Damaged'
]

// Define tyre brands
const BRANDS = ['Bridgestone', 'Michelin', 'Apollo']

// Define tyre sizes from requirements
const SIZES = ['26.5R25', '17.5R25', '445-65R22.5', '12.00R20', '12.00R24']

const FitmentLogsPage = () => {
  const { userData } = useUser()
  const [data, setData] = useState(FITMENT_LOGS)
  const [filteredData, setFilteredData] = useState(FITMENT_LOGS)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // State for fitment and removal operations
  const [fitFormVisible, setFitFormVisible] = useState(false)
  const [removeFormVisible, setRemoveFormVisible] = useState(false)
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [availablePositions, setAvailablePositions] =
    useState<string[]>(POSITIONS)
  const [currentHours, setCurrentHours] = useState<number>(0)
  const [fitForm] = Form.useForm()
  const [removeForm] = Form.useForm()

  // State for filters
  const [filters, setFilters] = useState({
    dateRange: null,
    machine: null,
    position: null,
    operationType: null,
    brand: null,
    size: null
  })

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: any) => {
    const newFilters = { ...filters, [filterName]: value }
    setFilters(newFilters)

    // Apply all active filters
    let result = [...FITMENT_LOGS]

    if (
      newFilters.dateRange &&
      newFilters.dateRange[0] &&
      newFilters.dateRange[1]
    ) {
      const startDate = dayjs(newFilters.dateRange[0])
      const endDate = dayjs(newFilters.dateRange[1])
      result = result.filter(item => {
        const itemDate = dayjs(item.date)
        return (
          itemDate.isAfter(startDate) &&
          itemDate.isBefore(endDate.add(1, 'day'))
        )
      })
    }

    if (newFilters.machine) {
      result = result.filter(item => item.machine === newFilters.machine)
    }

    if (newFilters.position) {
      result = result.filter(item => item.position === newFilters.position)
    }

    if (newFilters.operationType) {
      result = result.filter(
        item => item.operationType === newFilters.operationType
      )
    }

    if (newFilters.brand) {
      result = result.filter(item => item.brand === newFilters.brand)
    }

    if (newFilters.size) {
      result = result.filter(item => item.size === newFilters.size)
    }

    setFilteredData(result)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      dateRange: null,
      machine: null,
      position: null,
      operationType: null,
      brand: null,
      size: null
    })
    setFilteredData(FITMENT_LOGS)
  }

  // View record details
  const viewRecord = (record: any) => {
    setSelectedRecord(record)
  }

  // Handle machine selection for fitment
  const handleMachineSelect = (machineId: string) => {
    setSelectedMachine(machineId)

    // Simulate getting machine hours - would come from an API in production
    const simulatedHours = Math.floor(2000 + Math.random() * 5000)
    setCurrentHours(simulatedHours)

    // Determine occupied positions - would be calculated based on actual data
    const fittedTyresForMachine = FITTED_TYRES.filter(
      tyre => tyre.machine === machineId
    )
    const occupiedPositions = fittedTyresForMachine.map(tyre => tyre.position)
    const availablePos = POSITIONS.filter(
      pos => !occupiedPositions.includes(pos)
    )

    setAvailablePositions(availablePos)

    // Update form values
    fitForm.setFieldsValue({ transHours: simulatedHours })
  }

  // Handle form submission for fitment
  const handleFitmentSubmit = (values: any) => {
    console.log('Fitment values:', values)

    // In a real app, we would send this data to an API
    // For now, just add it to our local data

    // Find the selected tyre details
    const selectedTyre = AVAILABLE_TYRES.find(tyre => tyre.id === values.tyre)

    // Create a new log entry
    const newLog = {
      id: `FL${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split('T')[0],
      machine: values.machine,
      position: values.position,
      serialNumber: selectedTyre?.serialNumber || '',
      brand: selectedTyre?.brand || '',
      size: selectedTyre?.size || '',
      operationType: 'Fitment',
      hoursAtOperation: values.transHours,
      treadDepth: values.treadDepth,
      pressure: values.pressure,
      operator: userData?.name || 'Tyre Fitter',
      notes: values.notes || ''
    }

    // Add to logs
    const updatedLogs = [newLog, ...data]
    setData(updatedLogs)
    setFilteredData(updatedLogs)

    // Close modal and reset form
    setFitFormVisible(false)
    fitForm.resetFields()
    setSelectedMachine(null)
  }

  // Handle form submission for removal
  const handleRemovalSubmit = (values: any) => {
    console.log('Removal values:', values)

    // Find the selected tyre details
    const selectedTyre = FITTED_TYRES.find(
      tyre => tyre.id === values.fittedTyre
    )

    // Create a new log entry
    const newLog = {
      id: `FL${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split('T')[0],
      machine: values.machine,
      position: selectedTyre?.position || '',
      serialNumber: selectedTyre?.serialNumber || '',
      brand: selectedTyre?.brand || '',
      size: selectedTyre?.size || '',
      operationType: 'Removal',
      hoursAtOperation: values.transHours,
      treadDepth: values.finalTreadDepth,
      pressure: 0, // Removed tyres don't have pressure
      operator: userData?.name || 'Tyre Fitter',
      removalReason: values.removalReason,
      notes: values.notes || ''
    }

    // Add to logs
    const updatedLogs = [newLog, ...data]
    setData(updatedLogs)
    setFilteredData(updatedLogs)

    // Close modal and reset form
    setRemoveFormVisible(false)
    removeForm.resetFields()
  }

  // Calculate aggregate statistics
  const fitmentCount = filteredData.filter(
    log => log.operationType === 'Fitment'
  ).length
  const removalCount = filteredData.filter(
    log => log.operationType === 'Removal'
  ).length

  // Table columns definition
  const columns: ColumnsType<any> = [
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
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      render: text => (
        <Link to={`/fitter/serial-history?serial=${text}`}>
          <Text style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</Text>
        </Link>
      )
    },
    {
      title: 'Type',
      dataIndex: 'operationType',
      key: 'operationType',
      render: type => (
        <Tag color={type === 'Fitment' ? 'green' : 'orange'}>{type}</Tag>
      )
    },
    {
      title: 'Hours',
      dataIndex: 'hoursAtOperation',
      key: 'hoursAtOperation'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type='primary'
          size='small'
          icon={<EyeOutlined />}
          onClick={() => viewRecord(record)}
        >
          View
        </Button>
      )
    }
  ]

  return (
    <div className='fitment-logs-page'>
      <Title level={2} className='mb-6'>
        Tyre Fitment Logs
      </Title>

      {/* Operation Buttons */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} md={24}>
          <Card>
            <Space size='middle'>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                size='large'
                onClick={() => setFitFormVisible(true)}
              >
                Fit New Tyre
              </Button>
              <Button
                type='primary'
                danger
                icon={<MinusCircleOutlined />}
                size='large'
                onClick={() => setRemoveFormVisible(true)}
              >
                Remove Tyre
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title='Total Records'
              value={filteredData.length}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card>
            <Statistic
              title='Fitments'
              value={fitmentCount}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card>
            <Statistic
              title='Removals'
              value={removalCount}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className='mb-6'>
        <div className='flex flex-col md:flex-row justify-between mb-4'>
          <Title level={4} className='mb-4 md:mb-0'>
            Filters
          </Title>
          <Button onClick={resetFilters} icon={<FilterOutlined />}>
            Reset Filters
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label='Date Range'>
              <RangePicker
                style={{ width: '100%' }}
                value={filters.dateRange}
                onChange={dates => handleFilterChange('dateRange', dates)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item label='Machine'>
              <Select
                style={{ width: '100%' }}
                placeholder='All Machines'
                allowClear
                value={filters.machine}
                onChange={value => handleFilterChange('machine', value)}
              >
                {MACHINES.map(machine => (
                  <Option key={machine.id} value={machine.id}>
                    {machine.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item label='Position'>
              <Select
                style={{ width: '100%' }}
                placeholder='All Positions'
                allowClear
                value={filters.position}
                onChange={value => handleFilterChange('position', value)}
              >
                {POSITIONS.map(position => (
                  <Option key={position} value={position}>
                    {position}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item label='Operation'>
              <Select
                style={{ width: '100%' }}
                placeholder='All Operations'
                allowClear
                value={filters.operationType}
                onChange={value => handleFilterChange('operationType', value)}
              >
                <Option value='Fitment'>Fitment</Option>
                <Option value='Removal'>Removal</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item label='Brand'>
              <Select
                style={{ width: '100%' }}
                placeholder='All Brands'
                allowClear
                value={filters.brand}
                onChange={value => handleFilterChange('brand', value)}
              >
                {BRANDS.map(brand => (
                  <Option key={brand} value={brand}>
                    {brand}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Results Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey='id'
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Record Details Modal */}
      {selectedRecord && (
        <Card
          title={`${selectedRecord.operationType} Details`}
          className='mt-6'
          bordered={true}
          extra={
            <Button onClick={() => setSelectedRecord(null)} size='small'>
              Close
            </Button>
          }
        >
          <Descriptions
            bordered
            column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label='Date'>
              {new Date(selectedRecord.date).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label='Machine'>
              {selectedRecord.machine}
            </Descriptions.Item>
            <Descriptions.Item label='Position'>
              {selectedRecord.position}
            </Descriptions.Item>
            <Descriptions.Item label='Serial Number'>
              <Link
                to={`/fitter/serial-history?serial=${selectedRecord.serialNumber}`}
              >
                {selectedRecord.serialNumber}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label='Brand'>
              {selectedRecord.brand}
            </Descriptions.Item>
            <Descriptions.Item label='Size'>
              {selectedRecord.size}
            </Descriptions.Item>
            <Descriptions.Item label='Operation'>
              <Tag
                color={
                  selectedRecord.operationType === 'Fitment'
                    ? 'green'
                    : 'orange'
                }
              >
                {selectedRecord.operationType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Hours'>
              {selectedRecord.hoursAtOperation}
            </Descriptions.Item>
            <Descriptions.Item label='Tread Depth'>
              {selectedRecord.treadDepth} mm
            </Descriptions.Item>
            <Descriptions.Item label='Pressure'>
              {selectedRecord.pressure} psi
            </Descriptions.Item>
            <Descriptions.Item label='Operator'>
              {selectedRecord.operator}
            </Descriptions.Item>
            {selectedRecord.removalReason && (
              <Descriptions.Item label='Removal Reason'>
                <Tag color='red'>{selectedRecord.removalReason}</Tag>
              </Descriptions.Item>
            )}
            <Descriptions.Item label='Notes' span={3}>
              {selectedRecord.notes || 'No notes provided'}
            </Descriptions.Item>
          </Descriptions>

          <div className='flex justify-end mt-4'>
            <Space>
              <Button>Print Record</Button>
              <Button type='primary' icon={<ArrowRightOutlined />}>
                View Tyre History
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* Fit Tyre Modal */}
      <Modal
        title='Fit New Tyre'
        open={fitFormVisible}
        onCancel={() => setFitFormVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={fitForm}
          layout='vertical'
          onFinish={handleFitmentSubmit}
          initialValues={{ transHours: currentHours }}
        >
          <div className='mb-6'>
            <Text type='secondary'>
              Complete this form to record fitting a new tyre to a machine. All
              fields are required.
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
            name='transHours'
            label='Transmission Hours at Fitment'
            rules={[
              {
                required: true,
                message: 'Please enter the current transmission hours'
              }
            ]}
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
            name='position'
            label='Tyre Position'
            rules={[{ required: true, message: 'Please select a position' }]}
          >
            <Select placeholder='Select position' disabled={!selectedMachine}>
              {availablePositions.map(position => (
                <Option key={position} value={position}>
                  {position}
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
              placeholder='Select tyre by serial number'
              disabled={!selectedMachine}
              showSearch
              optionFilterProp='children'
            >
              {AVAILABLE_TYRES.map(tyre => (
                <Option key={tyre.id} value={tyre.id}>
                  {tyre.serialNumber} - {tyre.brand} {tyre.size}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='treadDepth'
            label='Initial Tread Depth (mm)'
            rules={[
              { required: true, message: 'Please enter initial tread depth' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.1}
              disabled={!selectedMachine}
            />
          </Form.Item>

          <Form.Item
            name='pressure'
            label='Initial Pressure (psi)'
            rules={[
              { required: true, message: 'Please enter initial pressure' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              disabled={!selectedMachine}
            />
          </Form.Item>

          <Form.Item name='notes' label='Notes'>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item className='text-right'>
            <Space>
              <Button onClick={() => setFitFormVisible(false)}>Cancel</Button>
              <Button
                type='primary'
                htmlType='submit'
                icon={<SaveOutlined />}
                disabled={!selectedMachine}
              >
                Record Fitment
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Remove Tyre Modal */}
      <Modal
        title='Remove Tyre'
        open={removeFormVisible}
        onCancel={() => setRemoveFormVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={removeForm}
          layout='vertical'
          onFinish={handleRemovalSubmit}
        >
          <div className='mb-6'>
            <Text type='secondary'>
              Complete this form to record removing a tyre from a machine. All
              fields are required.
            </Text>
          </div>

          <Form.Item
            name='machine'
            label='Select Machine'
            rules={[{ required: true, message: 'Please select a machine' }]}
          >
            <Select
              placeholder='Select machine'
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
            name='fittedTyre'
            label='Select Tyre to Remove'
            rules={[{ required: true, message: 'Please select a tyre' }]}
            dependencies={['machine']}
          >
            <Select
              placeholder='Select fitted tyre'
              showSearch
              optionFilterProp='children'
            >
              {FITTED_TYRES.map(tyre => (
                <Option key={tyre.id} value={tyre.id}>
                  {tyre.serialNumber} - {tyre.position} - {tyre.brand}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='transHours'
            label='Current Transmission Hours'
            rules={[
              {
                required: true,
                message: 'Please enter the current transmission hours'
              }
            ]}
            tooltip='Current hour meter reading of the machine'
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.1} />
          </Form.Item>

          <Form.Item
            name='removalReason'
            label='Reason for Removal'
            rules={[{ required: true, message: 'Please select a reason' }]}
          >
            <Select placeholder='Select reason for removal'>
              {REMOVAL_REASONS.map(reason => (
                <Option key={reason} value={reason}>
                  {reason}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='finalTreadDepth'
            label='Final Tread Depth (mm)'
            rules={[
              { required: true, message: 'Please enter final tread depth' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.1} />
          </Form.Item>

          <Form.Item name='notes' label='Notes'>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item className='text-right'>
            <Space>
              <Button onClick={() => setRemoveFormVisible(false)}>
                Cancel
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                icon={<MinusCircleOutlined />}
                danger
              >
                Record Removal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FitmentLogsPage
