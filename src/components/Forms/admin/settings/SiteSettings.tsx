'use client'
import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
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

interface Site {
  id?: string
  name: string
  client: string
  location?: string
  active: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
  createdBy?: string
  updatedBy?: string
}

export default function SiteSettings () {
  const [data, setData] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [editing, setEditing] = useState<Site | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth()

  const fetchData = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'sites'))
    const items = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Site[]
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

  const handleEdit = (record: Site) => {
    form.setFieldsValue(record)
    setEditing(record)
    setModalOpen(true)
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    await deleteDoc(doc(db, 'sites', id))
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
      await updateDoc(doc(db, 'sites', editing.id), payload)
      message.success('Updated successfully')
    } else {
      await addDoc(collection(db, 'sites'), {
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
    { title: 'Client', dataIndex: 'client' },
    { title: 'Location', dataIndex: 'location' },
    {
      title: 'Active',
      dataIndex: 'active',
      render: (value: boolean) => (value ? 'Yes' : 'No')
    },
    {
      title: 'Actions',
      render: (_: any, record: Site) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Delete this site?'
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
        Add Site
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
        title={editing ? 'Edit Site' : 'Add Site'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
      >
        <Form layout='vertical' form={form}>
          <Form.Item name='name' label='Site Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='client'
            label='Client Name'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='location' label='Location'>
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
