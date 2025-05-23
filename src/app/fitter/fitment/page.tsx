'use client'

import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  Divider,
  Radio,
  InputNumber,
  message,
  Tabs
} from 'antd'
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  CheckOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import { useUser } from '../../../contexts/UserContext'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

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

// Mock machine data - would come from an API in production
const MACHINES = [
  { id: 'IBL001', name: 'IBL001 - LHD', type: 'LHD' },
  { id: 'IBL002', name: 'IBL002 - LHD', type: 'LHD' },
  { id: 'IBL003', name: 'IBL003 - LHD', type: 'LHD' },
  { id: 'IDL001', name: 'IDL001 - Drill Rig', type: 'Drill Rig' },
  { id: 'IDL002', name: 'IDL002 - Drill Rig', type: 'Drill Rig' },
  { id: 'IBOLT1', name: 'IBOLT1 - Bolter', type: 'Bolter' },
  { id: 'IMAN01', name: 'IMAN01 - Manitou', type: 'Manitou' }
]

// Mock tyre data - would come from an API in production
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

const FitmentPage = () => {
  const { userData } = useUser()
  const [form] = Form.useForm()
  const [removalForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('fitment')
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)
  const [availablePositions, setAvailablePositions] =
    useState<string[]>(POSITIONS)
  const [currentHours, setCurrentHours] = useState<number>(0)

  // Handle machine selection - in a real app, this would fetch the machine's current hours
  // and determine which positions are already occupied
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
  }

  // Handle form submission for fitment
  const handleFitmentSubmit = (values: any) => {
    console.log('Fitment values:', values)
    message.success('Tyre fitment recorded successfully')
    form.resetFields()
    setSelectedMachine(null)
  }

  // Handle form submission for removal
  const handleRemovalSubmit = (values: any) => {
    console.log('Removal values:', values)
    message.success('Tyre removal recorded successfully')
    removalForm.resetFields()
  }

  return (
    <div className='fitment-page'>
      <Title level={2} className='mb-6'>
        Tyre Fitment Operations
      </Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type='card'
        className='mb-6'
      >
        <TabPane tab='Tyre Fitment' key='fitment'>
          <Card>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleFitmentSubmit}
              initialValues={{ transHours: currentHours }}
            >
              <div className='mb-6'>
                <Text type='secondary'>
                  Complete this form to record fitting a new tyre to a machine.
                  All fields are required.
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
                rules={[
                  { required: true, message: 'Please select a position' }
                ]}
              >
                <Select
                  placeholder='Select position'
                  disabled={!selectedMachine}
                >
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
                  {
                    required: true,
                    message: 'Please enter initial tread depth'
                  }
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

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<SaveOutlined />}
                  size='large'
                  disabled={!selectedMachine}
                >
                  Record Fitment
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab='Tyre Removal' key='removal'>
          <Card>
            <Form
              form={removalForm}
              layout='vertical'
              onFinish={handleRemovalSubmit}
            >
              <div className='mb-6'>
                <Text type='secondary'>
                  Complete this form to record removing a tyre from a machine.
                  All fields are required.
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

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  icon={<MinusCircleOutlined />}
                  size='large'
                  danger
                >
                  Record Removal
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>

      <div className='text-right mt-4'>
        <Link to='/fitter/fitment-logs'>
          <Button type='default' icon={<HistoryOutlined />}>
            View Fitment History Logs
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default FitmentPage
