'use client'

import { useEffect, useState } from 'react'
import { Card, Form, InputNumber, Button, message, Spin } from 'antd'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useAuth } from '@/hooks/useAuth'

interface GlobalConfig {
  lowStockThreshold: number
  treadDepthAlertMm: number
  defaultInspectionIntervalDays: number
  updatedAt?: any
  updatedBy?: string
}

export default function GlobalSettings () {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  const globalRef = doc(db, 'configuration', 'global')

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(globalRef)
      if (snap.exists()) {
        form.setFieldsValue(snap.data())
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const onSave = async () => {
    const values = await form.validateFields()
    setSaving(true)
    await setDoc(
      globalRef,
      {
        ...values,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid
      },
      { merge: true }
    )
    setSaving(false)
    message.success('Settings saved')
  }

  if (loading) return <Spin />

  return (
    <Card title='Global Settings'>
      <Form layout='vertical' form={form}>
        <Form.Item
          label='Low Stock Warning Threshold (Tyre count)'
          name='lowStockThreshold'
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label='Tread Depth Alert (mm)'
          name='treadDepthAlertMm'
          rules={[{ required: true }]}
        >
          <InputNumber min={1} step={0.5} />
        </Form.Item>

        <Form.Item
          label='Default Inspection Interval (days)'
          name='defaultInspectionIntervalDays'
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item>
          <Button type='primary' onClick={onSave} loading={saving}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
