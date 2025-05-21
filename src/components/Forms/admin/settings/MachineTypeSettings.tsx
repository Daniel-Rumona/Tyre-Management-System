'use client'
import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useAuth } from '@/hooks/useAuth'

interface MachineType {
  id?: string
  name: string
  description?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  createdBy?: string
  updatedBy?: string
}

export default function MachineTypeSettings () {
  const [data, setData] = useState<MachineType[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [editing, setEditing] = useState<MachineType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()

  const fetchData = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'machineTypes'))
    const items = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MachineType[]
    setData(items)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = () => {
    form.resetFields()
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (record: MachineType) => {
    form.setFieldsValue(record)
    setEditing(record)
    setModalOpen(true)
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    await deleteDoc(doc(db, 'machineTypes', id))
    message.success('Deleted')
    fetchData()
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const payload = {
      ...values,
      updatedAt: Timestamp.now(),
      updatedBy: user.uid
    }

    if (editing && editing.id) {
      await updateDoc(doc(db, 'machineTypes', editing.id), payload)
      message.success('Updated successfully')
    } else {
      await addDoc(collection(db, 'machineTypes'), {
        ...payload,
        createdAt: Timestamp.now(),
        createdBy: user.uid
      })
      message.success('Added successfully')
    }

    setModalOpen(false)
    fetchData()
  }

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      render: (_: any, record: MachineType) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Delete this type?'
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type='link' danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        className='mb-4'
        onClick={handleAdd}
      >
        Add Machine Type
      </Button>
      <Table
        rowKey='id'
        dataSource={data}
        loading={loading}
        columns={columns}
        pagination={false}
      />
      <Modal
        open={modalOpen}
        title={editing ? 'Edit Machine Type' : 'Add Machine Type'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
      >
        <Form layout='vertical' form={form}>
          <Form.Item name='name' label='Type Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Description'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
