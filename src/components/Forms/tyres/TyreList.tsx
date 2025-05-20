'use client'

import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  message,
  Tag,
  Row,
  Col,
  Statistic,
  Select,
  Input,
  Card
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined
} from '@ant-design/icons'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where
} from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import TyreForm from './TyreForm'
import FitmentForm from './FitmentForm'
import Link from 'next/link'
import { motion } from 'framer-motion'
import RemoveTyreForm from './RemoveTyreForm'
import TyreTimelineModal from './TyreTimelineModal'

const { Option } = Select
const { Search } = Input

const TyreList = () => {
  const [tyres, setTyres] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [fitModal, setFitModal] = useState(false)
  const [currentTyre, setCurrentTyre] = useState<any>(null)

  const [search, setSearch] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSupplier, setFilterSupplier] = useState('')

  //   Tyre Removal
  const [removeOpen, setRemoveOpen] = useState(false)

  //   Tyre Timeline
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [historyTyreId, setHistoryTyreId] = useState<string | null>(null)

  const openFitment = (tyre: any) => {
    setCurrentTyre(tyre)
    setFitModal(true)
  }

  const handleFitSubmit = async (values: any) => {
    try {
      await addDoc(collection(db, 'fitments'), {
        tyreId: currentTyre.id,
        ...values
      })
      await updateDoc(doc(db, 'tyres', currentTyre.id), {
        status: 'Fitted'
      })
      message.success('Tyre fitted successfully.')
      setFitModal(false)
      fetchTyres()
    } catch (err) {
      message.error('Fitment failed.')
    }
  }

  const fetchTyres = async () => {
    const snapshot = await getDocs(collection(db, 'tyres'))
    const tyreData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    setTyres(tyreData)
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'tyres', editing.id), values)
        message.success('Tyre updated')
      } else {
        await addDoc(collection(db, 'tyres'), {
          ...values,
          status: 'In Stock',
          createdAt: new Date()
        })
        message.success('Tyre added')
      }
      setOpen(false)
      setEditing(null)
      fetchTyres()
    } catch (err) {
      message.error('Error saving tyre')
    }
  }

  const handleRemoveSubmit = async (values: any) => {
    try {
      // 1. Get latest fitment for the tyre
      const fitSnap = await getDocs(
        query(collection(db, 'fitments'), where('tyreId', '==', currentTyre.id))
      )

      let latestFitId = ''
      let latestDate = 0

      fitSnap.forEach(docSnap => {
        const data = docSnap.data()
        const fitTime = new Date(data.fitDate).getTime()
        if (fitTime > latestDate) {
          latestDate = fitTime
          latestFitId = docSnap.id
        }
      })

      if (!latestFitId) throw new Error('No fitment found')

      // 2. Update fitment document with removal info
      await updateDoc(doc(db, 'fitments', latestFitId), {
        removeReason: values.removeReason,
        removeDate: values.removeDate.toISOString()
      })

      // 3. Update tyre status
      await updateDoc(doc(db, 'tyres', currentTyre.id), {
        status: 'Removed'
      })

      message.success('Tyre removed successfully.')
      setRemoveOpen(false)
      fetchTyres()
    } catch (err) {
      message.error('Removal failed.')
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTyres()
  }, [])

  const filtered = tyres.filter(
    t =>
      (!filterBrand || t.brand === filterBrand) &&
      (!filterStatus || t.status === filterStatus) &&
      (!filterSupplier || t.supplier === filterSupplier) &&
      (t.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
        t.brand?.toLowerCase().includes(search.toLowerCase()) ||
        t.supplier?.toLowerCase().includes(search.toLowerCase()))
  )

  const counts = {
    inStock: tyres.filter(t => t.status === 'In Stock').length,
    fitted: tyres.filter(t => t.status === 'Fitted').length,
    removed: tyres.filter(t => t.status === 'Removed').length
  }

  return (
    <>
      {/* 🔢 Metrics */}
      <Row gutter={16} className='mb-6'>
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <Statistic
                title='In Stock'
                value={counts.inStock}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Statistic
                title='Fitted'
                value={counts.fitted}
                prefix={<ClockCircleOutlined style={{ color: '#1677ff' }} />}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Statistic
                title='Removed'
                value={counts.removed}
                prefix={<StopOutlined style={{ color: '#f5222d' }} />}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 🔍 Filters */}
      <Row gutter={8} className='mb-4' wrap>
        <Col xs={24} sm={5}>
          <Select
            allowClear
            placeholder='Brand'
            className='w-full'
            onChange={val => setFilterBrand(val || '')}
          >
            {[...new Set(tyres.map(t => t.brand))].map(b => (
              <Option key={b} value={b}>
                {b}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={5}>
          <Select
            allowClear
            placeholder='Status'
            className='w-full'
            onChange={val => setFilterStatus(val || '')}
          >
            {[...new Set(tyres.map(t => t.status))].map(s => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={5}>
          <Select
            allowClear
            placeholder='Supplier'
            className='w-full'
            onChange={val => setFilterSupplier(val || '')}
          >
            {[...new Set(tyres.map(t => t.supplier))].map(s => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={5}>
          <Search
            placeholder='Search'
            onSearch={val => setSearch(val)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            className='w-full'
            onClick={() => setOpen(true)}
          >
            Add Tyre
          </Button>
        </Col>
      </Row>

      {/* 📋 Table */}
      <Table
        rowKey='id'
        dataSource={filtered}
        columns={[
          { title: 'Serial Number', dataIndex: 'serialNumber' },
          { title: 'Brand', dataIndex: 'brand' },
          { title: 'Size', dataIndex: 'size' },
          { title: 'Supplier', dataIndex: 'supplier' },
          { title: 'Cost', dataIndex: 'cost' },
          {
            title: 'Status',
            dataIndex: 'status',
            render: status => (
              <Tag
                color={
                  status === 'In Stock'
                    ? 'green'
                    : status === 'Fitted'
                    ? 'blue'
                    : 'red'
                }
              >
                {status}
              </Tag>
            )
          },
          {
            title: 'Actions',
            render: (_, record) => (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditing(record)
                    setOpen(true)
                  }}
                />
                <Button
                  type='default'
                  onClick={() => openFitment(record)}
                  className='ml-2'
                >
                  Fit
                </Button>{' '}
                <Button
                  danger
                  onClick={() => {
                    setCurrentTyre(record)
                    setRemoveOpen(true)
                  }}
                >
                  Remove
                </Button>
                <Button
                  type='link'
                  onClick={() => {
                    setHistoryTyreId(record.id)
                    setHistoryModalOpen(true)
                  }}
                >
                  History
                </Button>
              </>
            )
          }
        ]}
      />

      <TyreForm
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
        initialValues={editing}
      />

      <FitmentForm
        open={fitModal}
        onCancel={() => setFitModal(false)}
        onSubmit={handleFitSubmit}
      />

      <RemoveTyreForm
        open={removeOpen}
        onCancel={() => setRemoveOpen(false)}
        onSubmit={handleRemoveSubmit}
      />

      {historyTyreId && (
        <TyreTimelineModal
          tyreId={historyTyreId}
          open={historyModalOpen}
          onClose={() => {
            setHistoryModalOpen(false)
            setHistoryTyreId(null)
          }}
        />
      )}
    </>
  )
}

export default TyreList
