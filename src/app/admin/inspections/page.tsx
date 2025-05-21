'use client'
import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Upload,
  message,
  Space,
  Select,
  Row,
  Col,
  Card
} from 'antd'
import {
  PlusOutlined,
  UploadOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useAuth } from '@/hooks/useAuth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import InspectionCalendar from './calendar/page'

const { Option } = Select

export default function InspectionList () {
  const [data, setData] = useState<any[]>([])
  const [tyres, setTyres] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const { user } = useAuth()
  const storage = getStorage()

  const fetchData = async () => {
    setLoading(true)
    const [snap, tyreSnap] = await Promise.all([
      getDocs(collection(db, 'inspections')),
      getDocs(collection(db, 'tyres'))
    ])
    const inspections = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const tyres = tyreSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setData(inspections)
    setTyres(tyres)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = () => {
    form.resetFields()
    setModalOpen(true)
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    let imageUrl = ''

    if (values.image && values.image.file) {
      const file = values.image.file.originFileObj
      const storageRef = ref(storage, `inspections/${Date.now()}-${file.name}`)
      await uploadBytes(storageRef, file)
      imageUrl = await getDownloadURL(storageRef)
    }

    await addDoc(collection(db, 'inspections'), {
      tyreId: values.tyreId,
      date: Timestamp.fromDate(values.date.toDate()),
      treadDepth: values.treadDepth,
      pressure: values.pressure,
      notes: values.notes || '',
      imageUrl,
      createdAt: Timestamp.now(),
      createdBy: user.uid
    })

    message.success('Inspection logged')
    setModalOpen(false)
    fetchData()
  }

  const columns = [
    {
      title: 'Tyre Serial',
      dataIndex: 'tyreId',
      render: (id: string) => tyres.find(t => t.id === id)?.serialNumber || id
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (d: any) => {
        const date = d?.toDate ? d.toDate() : new Date(d)
        return dayjs(date).format('YYYY-MM-DD')
      }
    },
    {
      title: 'Tread Depth (mm)',
      dataIndex: 'treadDepth'
    },
    {
      title: 'Pressure (kPa)',
      dataIndex: 'pressure'
    },
    {
      title: 'Notes',
      dataIndex: 'notes'
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      render: (url: string) =>
        url && (
          <a href={url} target='_blank' rel='noopener noreferrer'>
            View
          </a>
        )
    }
  ]

  return (
    <>
      <Row className='mb-4' justify='space-between'>
        <Col>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className='mr-2'
          >
            Add Inspection
          </Button>
          <Button
            icon={<CalendarOutlined />}
            onClick={() => setCalendarOpen(true)}
          >
            View Calendar
          </Button>
        </Col>
      </Row>

      <Card title='Inspection Logs'>
        <Table
          rowKey='id'
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title='Add Inspection'
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
      >
        <Form layout='vertical' form={form}>
          <Form.Item
            name='tyreId'
            label='Tyre Serial Number'
            rules={[{ required: true }]}
          >
            <Select showSearch placeholder='Select Tyre'>
              {tyres.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.serialNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='date'
            label='Inspection Date'
            rules={[{ required: true }]}
          >
            <DatePicker className='w-full' />
          </Form.Item>
          <Form.Item
            name='treadDepth'
            label='Tread Depth (mm)'
            rules={[{ required: true }]}
          >
            <InputNumber className='w-full' min={0} step={0.1} />
          </Form.Item>
          <Form.Item
            name='pressure'
            label='Pressure (kPa)'
            rules={[{ required: true }]}
          >
            <InputNumber className='w-full' min={0} />
          </Form.Item>
          <Form.Item name='notes' label='Notes'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name='image' label='Upload Photo' valuePropName='file'>
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Inspection Calendar'
        open={calendarOpen}
        onCancel={() => setCalendarOpen(false)}
        footer={null}
        width={1000}
      >
        <InspectionCalendar />
      </Modal>
    </>
  )
}
