'use client'

import React from 'react'
import { Modal, Form, Select, DatePicker, Input } from 'antd'

const { Option } = Select

const FitmentForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues = {}
}: {
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
  initialValues?: any
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      title='Fit Tyre to Machine'
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Form.Item
          name='machineId'
          label='Machine ID'
          rules={[{ required: true }]}
        >
          <Input placeholder='e.g. IBL001' />
        </Form.Item>
        <Form.Item
          name='position'
          label='Fitment Position'
          rules={[{ required: true }]}
        >
          <Select placeholder='Select position'>
            <Option value='Left Front'>Left Front</Option>
            <Option value='Right Front'>Right Front</Option>
            <Option value='Left Rear'>Left Rear</Option>
            <Option value='Right Rear'>Right Rear</Option>
            <Option value='Spare'>Spare</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='fitDate'
          label='Fitment Date'
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FitmentForm
