'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Typography,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Row,
  Col,
  Statistic,
  Tabs,
  Tooltip,
  Badge,
  Form,
  Drawer,
  Descriptions,
  Empty
} from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  HistoryOutlined,
  ToolOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useUser } from '../../../contexts/UserContext'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

// Mock data for tyres - would come from an API in production
// This combines available tyres and fitted tyres
const ALL_TYRES = [
  // Available tyres
  {
    id: 'T001',
    serialNumber: 'BS265001',
    brand: 'Bridgestone',
    size: '26.5R25',
    status: 'Available',
    location: 'Main Warehouse',
    acquisitionDate: '2023-04-10',
    originalTreadDepth: 60.0,
    currentTreadDepth: 60.0,
    lastInspectionDate: null,
    costPerHour: null,
    hoursRun: 0,
    totalCost: 45000,
    notes: 'New tyre, ready for fitment'
  },
  {
    id: 'T002',
    serialNumber: 'BS265002',
    brand: 'Bridgestone',
    size: '26.5R25',
    status: 'Available',
    location: 'Main Warehouse',
    acquisitionDate: '2023-04-10',
    originalTreadDepth: 60.0,
    currentTreadDepth: 60.0,
    lastInspectionDate: null,
    costPerHour: null,
    hoursRun: 0,
    totalCost: 45000,
    notes: 'New tyre, ready for fitment'
  },
  {
    id: 'T003',
    serialNumber: 'MC265001',
    brand: 'Michelin',
    size: '26.5R25',
    status: 'Available',
    location: 'Main Warehouse',
    acquisitionDate: '2023-05-05',
    originalTreadDepth: 62.0,
    currentTreadDepth: 62.0,
    lastInspectionDate: null,
    costPerHour: null,
    hoursRun: 0,
    totalCost: 48000,
    notes: 'New tyre, ready for fitment'
  },
  {
    id: 'T004',
    serialNumber: 'AP265001',
    brand: 'Apollo',
    size: '26.5R25',
    status: 'Available',
    location: 'Workshop',
    acquisitionDate: '2023-06-15',
    originalTreadDepth: 58.0,
    currentTreadDepth: 58.0,
    lastInspectionDate: null,
    costPerHour: null,
    hoursRun: 0,
    totalCost: 42000,
    notes: 'New tyre, ready for fitment'
  },
  {
    id: 'T005',
    serialNumber: 'BS175001',
    brand: 'Bridgestone',
    size: '17.5R25',
    status: 'Available',
    location: 'Workshop',
    acquisitionDate: '2023-05-20',
    originalTreadDepth: 50.0,
    currentTreadDepth: 50.0,
    lastInspectionDate: null,
    costPerHour: null,
    hoursRun: 0,
    totalCost: 28000,
    notes: 'New tyre, ready for fitment'
  },

  // Fitted tyres
  {
    id: 'T009',
    serialNumber: 'BS265003',
    brand: 'Bridgestone',
    size: '26.5R25',
    status: 'Fitted',
    location: 'IBL001 - Left Front',
    machine: 'IBL001',
    position: 'Left Front',
    acquisitionDate: '2023-05-20',
    installDate: '2023-07-15',
    hoursAtInstall: 2450,
    originalTreadDepth: 60.0,
    currentTreadDepth: 48.7,
    lastInspectionDate: '2023-08-10',
    costPerHour: 28.48,
    hoursRun: 300,
    totalCost: 45000,
    wearRate: 0.038,
    notes: 'Wearing normally, pressure adjusted during last inspection'
  },
  {
    id: 'T010',
    serialNumber: 'MC265004',
    brand: 'Michelin',
    size: '26.5R25',
    status: 'Fitted',
    location: 'IBL001 - Right Front',
    machine: 'IBL001',
    position: 'Right Front',
    acquisitionDate: '2023-05-20',
    installDate: '2023-07-15',
    hoursAtInstall: 2450,
    originalTreadDepth: 62.0,
    currentTreadDepth: 51.8,
    lastInspectionDate: '2023-07-25',
    costPerHour: 60.76,
    hoursRun: 130,
    totalCost: 48000,
    wearRate: 0.078,
    notes: 'Slight uneven wear on outer edge'
  },
  {
    id: 'T011',
    serialNumber: 'BS265005',
    brand: 'Bridgestone',
    size: '26.5R25',
    status: 'Fitted',
    location: 'IBL002 - Left Rear',
    machine: 'IBL002',
    position: 'Left Rear',
    acquisitionDate: '2023-05-25',
    installDate: '2023-06-30',
    hoursAtInstall: 3200,
    originalTreadDepth: 60.0,
    currentTreadDepth: 55.2,
    lastInspectionDate: '2023-07-20',
    costPerHour: 22.5,
    hoursRun: 180,
    totalCost: 45000,
    wearRate: 0.027,
    notes: 'Good condition'
  },

  // Removed tyres
  {
    id: 'T015',
    serialNumber: 'AP175001',
    brand: 'Apollo',
    size: '17.5R25',
    status: 'Scrapped',
    location: 'Scrap Yard',
    acquisitionDate: '2023-04-15',
    originalTreadDepth: 45.0,
    currentTreadDepth: 38.3,
    lastInspectionDate: '2023-06-15',
    costPerHour: 86.15,
    hoursRun: 325,
    totalCost: 28000,
    wearRate: 0.0207,
    notes: 'Scrapped due to sidewall damage'
  },
  {
    id: 'T016',
    serialNumber: 'BS265006',
    brand: 'Bridgestone',
    size: '26.5R25',
    status: 'Repair',
    location: 'Workshop - Repair Bay',
    acquisitionDate: '2023-03-10',
    originalTreadDepth: 60.0,
    currentTreadDepth: 40.5,
    lastInspectionDate: '2023-07-05',
    costPerHour: 34.12,
    hoursRun: 680,
    totalCost: 45000,
    wearRate: 0.029,
    notes: 'Undergoing repair for tread penetration'
  },
  // Retreaded tyre
  {
    id: 'T020',
    serialNumber: 'RT265001',
    brand: 'Retread - Bridgestone',
    size: '26.5R25',
    status: 'Available',
    location: 'Workshop',
    acquisitionDate: '2023-01-15',
    originalTreadDepth: 60.0,
    currentTreadDepth: 58.0, // After retread
    lastInspectionDate: '2023-08-01',
    costPerHour: 18.75,
    hoursRun: 820, // Before retread
    totalCost: 25000, // Original cost plus retread cost
    notes: 'Retread completed on 2023-08-01, ready for new fitment'
  }
]

// Define tyre statuses
const TYRE_STATUSES = [
  { value: 'Available', label: 'Available', color: 'blue' },
  { value: 'Fitted', label: 'Fitted', color: 'green' },
  { value: 'Repair', label: 'In Repair', color: 'orange' },
  { value: 'Scrapped', label: 'Scrapped', color: 'red' },
  { value: 'Retread', label: 'Retread', color: 'purple' }
]

// Define tyre brands
const BRANDS = [...new Set(ALL_TYRES.map(tyre => tyre.brand))]

// Define tyre sizes
const SIZES = [...new Set(ALL_TYRES.map(tyre => tyre.size))]

// Get status color
const getStatusColor = (status: string) => {
  const statusObj = TYRE_STATUSES.find(s => s.value === status)
  return statusObj?.color || 'default'
}

// Get condition based on tread wear
const getTyreCondition = (tyre: any) => {
  if (!tyre.originalTreadDepth || !tyre.currentTreadDepth) return null

  const wearPercentage =
    (tyre.currentTreadDepth / tyre.originalTreadDepth) * 100

  if (wearPercentage > 75) return { status: 'Excellent', color: 'green' }
  if (wearPercentage > 50) return { status: 'Good', color: 'blue' }
  if (wearPercentage > 25) return { status: 'Fair', color: 'orange' }
  return { status: 'Poor', color: 'red' }
}

const TyresPage = () => {
  const { userData } = useUser()
  const [tyres, setTyres] = useState(ALL_TYRES)
  const [filteredTyres, setFilteredTyres] = useState(ALL_TYRES)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [viewType, setViewType] = useState<'table' | 'grid'>('table')
  const [selectedTyre, setSelectedTyre] = useState<any>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  // Calculate statistics
  const availableTyres = tyres.filter(t => t.status === 'Available').length
  const fittedTyres = tyres.filter(t => t.status === 'Fitted').length
  const inRepairTyres = tyres.filter(t => t.status === 'Repair').length
  const scrappedTyres = tyres.filter(t => t.status === 'Scrapped').length

  // Filter tyres based on search and filters
  useEffect(() => {
    let result = [...ALL_TYRES]

    // Apply search
    if (searchText) {
      const lowercaseSearch = searchText.toLowerCase()
      result = result.filter(
        tyre =>
          tyre.serialNumber.toLowerCase().includes(lowercaseSearch) ||
          tyre.brand.toLowerCase().includes(lowercaseSearch) ||
          tyre.size.toLowerCase().includes(lowercaseSearch) ||
          (tyre.location &&
            tyre.location.toLowerCase().includes(lowercaseSearch))
      )
    }

    // Apply status filter
    if (selectedStatus) {
      result = result.filter(tyre => tyre.status === selectedStatus)
    }

    // Apply brand filter
    if (selectedBrand) {
      result = result.filter(tyre => tyre.brand === selectedBrand)
    }

    // Apply size filter
    if (selectedSize) {
      result = result.filter(tyre => tyre.size === selectedSize)
    }

    setFilteredTyres(result)
  }, [searchText, selectedStatus, selectedBrand, selectedSize])

  // View tyre details
  const viewTyreDetails = (tyre: any) => {
    setSelectedTyre(tyre)
    setDrawerVisible(true)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchText('')
    setSelectedStatus(null)
    setSelectedBrand(null)
    setSelectedSize(null)
  }

  // Define table columns
  const columns: ColumnsType<any> = [
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber),
      render: (text, record) => (
        <Link href={`/fitter/serial-history?serial=${text}`}>
          <Text strong style={{ color: '#1677ff', cursor: 'pointer' }}>
            {text}
          </Text>
        </Link>
      )
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      sorter: (a, b) => a.brand.localeCompare(b.brand)
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      sorter: (a, b) => a.size.localeCompare(b.size)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true
    },
    {
      title: 'Tread Depth',
      dataIndex: 'currentTreadDepth',
      key: 'currentTreadDepth',
      sorter: (a, b) => (a.currentTreadDepth || 0) - (b.currentTreadDepth || 0),
      render: depth => (depth ? `${depth} mm` : '-')
    },
    {
      title: 'Condition',
      key: 'condition',
      render: (_, record) => {
        const condition = getTyreCondition(record)
        return condition ? (
          <Tag color={condition.color}>{condition.status}</Tag>
        ) : (
          '-'
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type='primary'
          size='small'
          icon={<EyeOutlined />}
          onClick={() => viewTyreDetails(record)}
        >
          View
        </Button>
      )
    }
  ]

  return (
    <div className='tyres-page'>
      <Title level={2} className='mb-6'>
        Tyre Inventory
      </Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={12} sm={12} md={8}>
          <Card>
            <Statistic
              title='Total Tyres'
              value={tyres.length}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8}>
          <Card>
            <Statistic
              title='Available Tyres'
              value={availableTyres}
              valueStyle={{ color: '#1677ff' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8}>
          <Card>
            <Statistic
              title='Fitted Tyres'
              value={fittedTyres}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card className='mb-6'>
        <div className='mb-4 flex flex-col md:flex-row md:justify-between md:items-center'>
          <div className='mb-4 md:mb-0 flex-1 md:mr-4'>
            <Input.Search
              placeholder='Search by serial number, brand, size, or location'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: '100%' }}
              allowClear
            />
          </div>
          <div className='flex'>
            <Space>
              <Button
                icon={<UnorderedListOutlined />}
                type={viewType === 'table' ? 'primary' : 'default'}
                onClick={() => setViewType('table')}
              />
              <Button
                icon={<AppstoreOutlined />}
                type={viewType === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewType('grid')}
              />
              <Button icon={<FilterOutlined />} onClick={resetFilters}>
                Reset
              </Button>
            </Space>
          </div>
        </div>

        <div className='flex flex-wrap gap-4'>
          <Form.Item label='Status' className='mb-0'>
            <Select
              style={{ width: 140 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder='All Statuses'
              allowClear
            >
              {TYRE_STATUSES.map(status => (
                <Option key={status.value} value={status.value}>
                  <Tag color={status.color}>{status.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Brand' className='mb-0'>
            <Select
              style={{ width: 140 }}
              value={selectedBrand}
              onChange={setSelectedBrand}
              placeholder='All Brands'
              allowClear
            >
              {BRANDS.map(brand => (
                <Option key={brand} value={brand}>
                  {brand}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Size' className='mb-0'>
            <Select
              style={{ width: 140 }}
              value={selectedSize}
              onChange={setSelectedSize}
              placeholder='All Sizes'
              allowClear
            >
              {SIZES.map(size => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Card>

      {/* Tyres Display - Table View */}
      {viewType === 'table' && (
        <Card>
          <Table
            columns={columns}
            dataSource={filteredTyres}
            rowKey='id'
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      {/* Tyres Display - Grid View */}
      {viewType === 'grid' && (
        <div className='mb-6'>
          {filteredTyres.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredTyres.map(tyre => {
                const condition = getTyreCondition(tyre)
                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={tyre.id}>
                    <Card
                      hoverable
                      onClick={() => viewTyreDetails(tyre)}
                      cover={
                        <div className='h-32 flex items-center justify-center bg-gray-50'>
                          <img
                            alt='Tyre'
                            src='/placeholder-tyre.png'
                            style={{
                              maxHeight: '100%',
                              maxWidth: '100%',
                              objectFit: 'contain'
                            }}
                            onError={e => {
                              // If image fails to load, replace with text
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.parentElement!.innerHTML = `<div class="text-xl font-bold">${tyre.size}</div>`
                            }}
                          />
                        </div>
                      }
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <Link
                          href={`/fitter/serial-history?serial=${tyre.serialNumber}`}
                        >
                          <Text strong style={{ color: '#1677ff' }}>
                            {tyre.serialNumber}
                          </Text>
                        </Link>
                        <Tag color={getStatusColor(tyre.status)}>
                          {tyre.status}
                        </Tag>
                      </div>
                      <div className='mb-2'>
                        <div>{tyre.brand}</div>
                        <div>{tyre.size}</div>
                      </div>
                      <div className='flex justify-between items-center'>
                        <div>
                          {tyre.currentTreadDepth && (
                            <Text type='secondary'>
                              {tyre.currentTreadDepth} mm
                            </Text>
                          )}
                        </div>
                        {condition && (
                          <Tag color={condition.color}>{condition.status}</Tag>
                        )}
                      </div>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          ) : (
            <Empty description='No tyres match your filters' />
          )}
        </div>
      )}

      {/* Tyre Details Drawer */}
      <Drawer
        title={`Tyre Details: ${selectedTyre?.serialNumber}`}
        placement='right'
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
        extra={
          <Space>
            <Link
              href={`/fitter/serial-history?serial=${selectedTyre?.serialNumber}`}
            >
              <Button type='primary'>Full History</Button>
            </Link>
          </Space>
        }
      >
        {selectedTyre && (
          <div>
            <div className='mb-4'>
              <Tag
                color={getStatusColor(selectedTyre.status)}
                style={{ fontSize: '14px', padding: '4px 8px' }}
              >
                {selectedTyre.status}
              </Tag>
            </div>

            <Descriptions
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label='Serial Number'>
                {selectedTyre.serialNumber}
              </Descriptions.Item>
              <Descriptions.Item label='Brand'>
                {selectedTyre.brand}
              </Descriptions.Item>
              <Descriptions.Item label='Size'>
                {selectedTyre.size}
              </Descriptions.Item>
              <Descriptions.Item label='Location'>
                {selectedTyre.location}
              </Descriptions.Item>

              <Descriptions.Item label='Acquisition Date'>
                {selectedTyre.acquisitionDate
                  ? new Date(selectedTyre.acquisitionDate).toLocaleDateString()
                  : '-'}
              </Descriptions.Item>

              <Descriptions.Item label='Original Tread'>
                {selectedTyre.originalTreadDepth
                  ? `${selectedTyre.originalTreadDepth} mm`
                  : '-'}
              </Descriptions.Item>

              <Descriptions.Item label='Current Tread'>
                {selectedTyre.currentTreadDepth
                  ? `${selectedTyre.currentTreadDepth} mm`
                  : '-'}
              </Descriptions.Item>

              {selectedTyre.status === 'Fitted' && (
                <>
                  <Descriptions.Item label='Installed On'>
                    {selectedTyre.installDate
                      ? new Date(selectedTyre.installDate).toLocaleDateString()
                      : '-'}
                  </Descriptions.Item>

                  <Descriptions.Item label='Machine'>
                    {selectedTyre.machine || '-'}
                  </Descriptions.Item>

                  <Descriptions.Item label='Position'>
                    {selectedTyre.position || '-'}
                  </Descriptions.Item>

                  <Descriptions.Item label='Hours Run'>
                    {selectedTyre.hoursRun || 0} hrs
                  </Descriptions.Item>

                  <Descriptions.Item label='Wear Rate'>
                    {selectedTyre.wearRate
                      ? `${selectedTyre.wearRate.toFixed(3)} mm/hr`
                      : '-'}
                  </Descriptions.Item>
                </>
              )}

              <Descriptions.Item label='Last Inspection'>
                {selectedTyre.lastInspectionDate
                  ? new Date(
                      selectedTyre.lastInspectionDate
                    ).toLocaleDateString()
                  : 'Never inspected'}
              </Descriptions.Item>

              <Descriptions.Item label='Condition'>
                {getTyreCondition(selectedTyre) ? (
                  <Tag color={getTyreCondition(selectedTyre)?.color}>
                    {getTyreCondition(selectedTyre)?.status}
                  </Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            </Descriptions>

            <div className='mt-4'>
              <Title level={5}>Notes</Title>
              <Text>{selectedTyre.notes || 'No notes available'}</Text>
            </div>

            <div className='mt-6'>
              <Row gutter={[16, 16]}>
                {selectedTyre.status === 'Available' && (
                  <Col>
                    <Link href={`/fitter/fitment`}>
                      <Button type='primary' icon={<ToolOutlined />}>
                        Fit This Tyre
                      </Button>
                    </Link>
                  </Col>
                )}
                <Col>
                  <Link
                    href={`/fitter/serial-history?serial=${selectedTyre.serialNumber}`}
                  >
                    <Button icon={<HistoryOutlined />}>
                      View Complete History
                    </Button>
                  </Link>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default TyresPage
