'use client'

import React from 'react'
import { Form, Input, Select, InputNumber, Button, message } from 'antd'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

const { Option } = Select

const TyreForm = () => {
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    try {
      await addDoc(collection(db, 'tyres'), {
        ...values,
        status: 'In Stock',
        createdAt: serverTimestamp()
      })
      message.success('Tyre registered successfully!')
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to register tyre.')
    }
  }

  return (
    <Form layout='vertical' form={form} onFinish={handleSubmit}>
      <Form.Item
        name='serialNumber'
        label='Serial Number'
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name='brand' label='Brand' rules={[{ required: true }]}>
        <Select placeholder='Select tyre brand'>
          <Option value='Bridgestone'>Bridgestone</Option>
          <Option value='Michelin'>Michelin</Option>
          <Option value='Apollo'>Apollo</Option>
          <Option value='Other'>Other</Option>
        </Select>
      </Form.Item>

      <Form.Item name='size' label='Tyre Size' rules={[{ required: true }]}>
        <Select placeholder='Select tyre size'>
          <Option value='26.5R25'>26.5R25 (LHDs)</Option>
          <Option value='17.5R25'>17.5R25 (LHDs)</Option>
          <Option value='445-65R22.5'>445-65R22.5 (Manitou)</Option>
          <Option value='12.00R20'>12.00R20 (Bolters)</Option>
          <Option value='12.00R24'>12.00R24 (Drill Rigs)</Option>
        </Select>
      </Form.Item>

      <Form.Item name='supplier' label='Supplier' rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name='cost' label='Cost' rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} prefix='$' />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' block>
          Register Tyre
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TyreForm
