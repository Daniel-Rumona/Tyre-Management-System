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
import { db } from '@/firebase/firebaseConfig' // adjust if different
import { useAuth } from '@/hooks/useAuth' // assumed custom hook

interface FailureReason {
  id?: string
  name: string
  code: string
  active: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
  createdBy?: string
  updatedBy?: string
}

export default function FailureReasonSettings () {
  const [data, setData] = useState<FailureReason[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [editing, setEditing] = useState<FailureReason | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useAuth() // assuming user.uid is available

  const fetchData = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'failureReasons'))
    const items = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FailureReason[]
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

  const handleEdit = (record: FailureReason) => {
    form.setFieldsValue(record)
    setEditing(record)
    setModalOpen(true)
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    await deleteDoc(doc(db, 'failureReasons', id))
    message.success('Deleted')
    fetchData()
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const payload: Omit<FailureReason, 'id'> = {
      ...values,
      active: true,
      updatedAt: Timestamp.now(),
      updatedBy: user.uid
    }

    if (editing && editing.id) {
      await updateDoc(doc(db, 'failureReasons', editing.id), payload)
      message.success('Updated successfully')
    } else {
      await addDoc(collection(db, 'failureReasons'), {
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
    {
      title: 'Reason Name',
      dataIndex: 'name'
    },
    {
      title: 'Code',
      dataIndex: 'code'
    },
    {
      title: 'Actions',
      render: (_: any, record: FailureReason) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Delete this reason?'
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
      <Space className='mb-4'>
        <Button type='primary' onClick={handleAdd} icon={<PlusOutlined />}>
          Add Failure Reason
        </Button>
      </Space>

      <Table
        rowKey='id'
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={false}
      />

      <Modal
        title={editing ? 'Edit Failure Reason' : 'Add Failure Reason'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText='Save'
      >
        <Form layout='vertical' form={form}>
          <Form.Item
            name='name'
            label='Reason Name'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='code'
            label='Reason Code'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
