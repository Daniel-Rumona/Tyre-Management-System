import React from 'react'
import { Tabs } from 'antd'
import FailureReasonSettings from '@/components/Forms/admin/settings/FailureReasons'
import GlobalSettings from '@/components/Forms/admin/settings/GlobalSettings'
import MachineTypeSettings from '@/components/Forms/admin/settings/MachineTypeSettings'
import SiteSettings from '@/components/Forms/admin/settings/SiteSettings'

const { TabPane } = Tabs

export default function AdminSettingsPage () {
  const items = [
    {
      key: '1',
      label: 'Global Settings',
      children: <GlobalSettings />
    },
    {
      key: '2',
      label: 'Failure Reasons',
      children: <FailureReasonSettings />
    },
    {
      key: '3',
      label: 'Machine Types',
      children: <MachineTypeSettings />
    },
    {
      key: '4',
      label: 'Sites',
      children: <SiteSettings />
    }
  ]

  return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold mb-4'>System Settings</h2>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  )
}
