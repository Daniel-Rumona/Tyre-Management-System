'use client'

import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Modal, Select } from 'antd'

const { Option } = Select

const TyreForm = ({ open, onCancel, onSubmit, initialValues }: any) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues)
    else form.resetFields()
  }, [initialValues, form])

  return (
    <Modal
      title={initialValues ? 'Edit Tyre' : 'Add New Tyre'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item
          name='serialNumber'
          label='Serial Number'
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='brand' label='Brand' rules={[{ required: true }]}>
          <Select>
            <Option value='Bridgestone'>Bridgestone</Option>
            <Option value='Michelin'>Michelin</Option>
            <Option value='Apollo'>Apollo</Option>
          </Select>
        </Form.Item>
        <Form.Item name='size' label='Size' rules={[{ required: true }]}>
          <Select>
            <Option value='26.5R25'>26.5R25</Option>
            <Option value='17.5R25'>17.5R25</Option>
            <Option value='445-65R22.5'>445-65R22.5</Option>
            <Option value='12.00R20'>12.00R20</Option>
            <Option value='12.00R24'>12.00R24</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='supplier'
          label='Supplier'
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='cost' label='Cost' rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TyreForm
