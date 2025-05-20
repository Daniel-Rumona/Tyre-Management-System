'use client'

import React from 'react'
import { Modal, Form, Select, DatePicker } from 'antd'

const { Option } = Select

const failureReasons = [
  'Worn Out',
  'Crown Damaged',
  'Sidewall Damaged',
  'Tread Penetration',
  'Bead Damaged',
  'Impact Damaged',
  'Rim Damaged'
]

const RemoveTyreForm = ({
  open,
  onCancel,
  onSubmit
}: {
  open: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      title='Remove Tyre'
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Form.Item
          name='removeReason'
          label='Removal Reason'
          rules={[{ required: true }]}
        >
          <Select placeholder='Select reason'>
            {failureReasons.map(reason => (
              <Option key={reason} value={reason}>
                {reason}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='removeDate'
          label='Removal Date'
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RemoveTyreForm
