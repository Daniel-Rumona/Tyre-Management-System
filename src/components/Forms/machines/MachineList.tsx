'use client'

import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Popconfirm,
  message,
  Card,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd'
import {
  PlusOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  Timestamp,
  getDocs
} from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useAuth } from '@/hooks/useAuth'
import type { StatisticProps } from 'antd'
import dynamic from 'next/dynamic'

// dynamically import CountUp so chart code isn’t in initial bundle
const CountUp = dynamic(() => import('react-countup'), { ssr: false })

const formatter: StatisticProps['formatter'] = value => (
  <CountUp end={value as number} separator=',' />
)

const { Option } = Select
const { Text } = Typography

interface Machine {
  id: string
  machineId: string
  typeId: string
  siteId: string
  client: string
  active: boolean
}
interface MachineType {
  id: string
  name: string
}
interface Site {
  id: string
  name: string
}

interface Props {
  initialData: Machine[]
  initialTypes: MachineType[]
  initialSites: Site[]
}

export default function MachineListClient ({
  initialData,
  initialTypes,
  initialSites
}: Props) {
  const [data, setData] = useState<Machine[]>(initialData)
  const [types] = useState<MachineType[]>(initialTypes)
  const [sites] = useState<Site[]>(initialSites)
  const [filtered, setFiltered] = useState<Machine[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [editing, setEditing] = useState<Machine | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()

  // filters
  const [filterClient, setFilterClient] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterSite, setFilterSite] = useState('')
  const [filterActive, setFilterActive] = useState('')

  // re-filter whenever inputs change
  useEffect(() => {
    setFiltered(
      data.filter(
        m =>
          (!filterClient || m.client === filterClient) &&
          (!filterType || m.typeId === filterType) &&
          (!filterSite || m.siteId === filterSite) &&
          (filterActive === '' || m.active === (filterActive === 'true'))
      )
    )
  }, [data, filterClient, filterType, filterSite, filterActive])

  const regenerateList = async () => {
    // if you do need to refetch after add/edit/delete
    setLoading(true)
    const snap = await getDocs(collection(db, 'machines'))
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Machine)))
    setLoading(false)
  }

  const generateMachineId = (typeId: string) => {
    const prefix = typeId.slice(0, 2).toUpperCase()
    const count = data.filter(d => d.typeId === typeId).length + 1
    return `${prefix}-${String(count).padStart(3, '0')}`
  }

  const handleAdd = () => {
    form.resetFields()
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (rec: Machine) => {
    form.setFieldsValue(rec)
    setEditing(rec)
    setModalOpen(true)
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    await deleteDoc(doc(db, 'machines', id))
    message.success('Deleted')
    regenerateList()
  }

  const handleSave = async () => {
    const vals = await form.validateFields()
    const payload = { ...vals, updatedAt: Timestamp.now(), updatedBy: user.uid }
    if (editing) {
      await updateDoc(doc(db, 'machines', editing.id), payload)
      message.success('Updated')
    } else {
      payload.machineId = generateMachineId(vals.typeId)
      await addDoc(collection(db, 'machines'), {
        ...payload,
        createdAt: Timestamp.now(),
        createdBy: user.uid
      })
      message.success('Added')
    }
    setModalOpen(false)
    regenerateList()
  }

  // metrics
  const metrics = [
    { label: 'Total Machines', value: filtered.length },
    { label: 'Active Machines', value: filtered.filter(m => m.active).length },
    {
      label: 'Inactive Machines',
      value: filtered.filter(m => !m.active).length
    }
  ]

  const iconMap: Record<string, JSX.Element> = {
    'Total Machines': <DatabaseOutlined style={{ fontSize: 24 }} />,
    'Active Machines': (
      <CheckCircleOutlined style={{ color: 'green', fontSize: 24 }} />
    ),
    'Inactive Machines': <StopOutlined style={{ color: 'red', fontSize: 24 }} />
  }
  const colorMap: Record<string, string> = {
    'Total Machines': '#f0f2f5',
    'Active Machines': '#f6ffed',
    'Inactive Machines': '#fff1f0'
  }

  const columns = [
    { title: 'Machine ID', dataIndex: 'machineId' },
    {
      title: 'Type',
      dataIndex: 'typeId',
      render: id => types.find(t => t.id === id)?.name || id
    },
    {
      title: 'Site',
      dataIndex: 'siteId',
      render: id => sites.find(s => s.id === id)?.name || id
    },
    { title: 'Client', dataIndex: 'client' },
    {
      title: 'Active',
      dataIndex: 'active',
      render: v => (v ? 'Yes' : 'No')
    },
    {
      title: 'Actions',
      render: (_: any, rec: Machine) => (
        <Space>
          <EditOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => handleEdit(rec)}
          />
          <Popconfirm title='Delete?' onConfirm={() => handleDelete(rec.id)}>
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      {/* client filter */}
      <Row gutter={8} className='mb-4' align='middle'>
        <Col>
          <Space size='middle' align='center'>
            <Text>Machines For:</Text>
            <Text code>{filterClient || 'All'}</Text>
            <Select
              placeholder='Filter by Client'
              allowClear
              style={{ width: 200 }}
              value={filterClient || undefined}
              onChange={v => setFilterClient(v || '')}
            >
              {[...new Set(data.map(m => m.client))].map(c => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>
      </Row>

      {/* metrics */}
      <Row gutter={16} className='mb-4'>
        {metrics.map(m => (
          <Col key={m.label} xs={24} md={8}>
            <Card loading={loading}>
              <Statistic
                title={m.label}
                value={m.value}
                prefix={iconMap[m.label]}
                formatter={formatter}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* other filters & add */}
      <Space className='mb-4'>
        <Select
          placeholder='Filter by Type'
          allowClear
          onChange={v => setFilterType(v || '')}
          style={{ width: 160 }}
        >
          {types.map(t => (
            <Option key={t.id} value={t.id}>
              {t.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder='Filter by Site'
          allowClear
          onChange={v => setFilterSite(v || '')}
          style={{ width: 160 }}
        >
          {sites.map(s => (
            <Option key={s.id} value={s.id}>
              {s.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder='Filter by Status'
          allowClear
          onChange={v => setFilterActive(v === 'true' ? 'true' : 'false')}
          style={{ width: 160 }}
        >
          <Option value='true'>Active</Option>
          <Option value='false'>Inactive</Option>
        </Select>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
          Add Machine
        </Button>
      </Space>

      {/* paginated table */}
      <Table
        rowKey='id'
        loading={loading}
        dataSource={filtered}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      {/* modal */}
      <Modal
        title={editing ? 'Edit Machine' : 'Add Machine'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
      >
        <Form layout='vertical' form={form}>
          <Form.Item
            name='typeId'
            label='Machine Type'
            rules={[{ required: true }]}
          >
            <Select placeholder='Select type'>
              {types.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='siteId' label='Site' rules={[{ required: true }]}>
            <Select placeholder='Select site'>
              {sites.map(s => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='client'
            label='Client Name'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='active' label='Active' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
