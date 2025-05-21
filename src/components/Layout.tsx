'use client'

import React, { useEffect, useState } from 'react'
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Breadcrumb,
  Drawer,
  Form,
  Input,
  Button,
  Spin
} from 'antd'
import {
  AppstoreOutlined,
  ToolOutlined,
  FileSearchOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { MenuProps } from 'antd'
import { useUser, getRoleBasePath } from '@/contexts/UserContext'

const { Header, Sider, Content } = Layout

const routeMap: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/register': 'Register',

  // Admin
  '/admin': 'Dashboard',
  '/admin/tyres': 'Tyres',
  '/admin/settings': 'System Settings',
  '/admin/machines': 'Machines',
  '/admin/inspections': 'Inspections',
  '/admin/reports': 'Reports',
  '/admin/users': 'Users',
  '/admin/setup-users': 'User Setup',
  
  // Director
  '/director': 'Director Dashboard',
  '/director/reports': 'Reports Overview',
  '/director/reports/supplier': 'Supplier Performance',
  '/director/reports/spend': 'Spend Analysis',
  '/director/reports/scrap': 'Scrap Analysis',
  '/director/reports/failures': 'Failure Trends',
  
  // Fitter
  '/fitter': 'Dashboard',
  '/fitter/tyres': 'Tyres',
  '/fitter/inspections': 'Inspections',
  '/fitter/fitment-logs': 'Fitment Logs',
  
  // Supervisor
  '/supervisor': 'Dashboard',
  '/supervisor/inspections': 'Inspections',
  '/supervisor/reports': 'Reports',
  
  // Site Manager
  '/sitemanager': 'Dashboard',
  '/sitemanager/tyres': 'Tyres',
  '/sitemanager/inspections': 'Inspections',
  '/sitemanager/reports': 'Reports'
}

const allRoutesByRole: Record<string, MenuProps['items']> = {
  'Tyre Fitter': [
    {
      key: '/fitter',
      icon: <DashboardOutlined />,
      label: <Link href='/fitter'>Dashboard</Link>
    },
    {
      key: '/fitter/tyres',
      icon: <AppstoreOutlined />,
      label: <Link href='/fitter/tyres'>Tyres</Link>
    },
    {
      key: '/fitter/inspections',
      icon: <FileSearchOutlined />,
      label: <Link href='/fitter/inspections'>Inspections</Link>
    },
    {
      key: '/fitter/fitment-logs',
      icon: <ToolOutlined />,
      label: <Link href='/fitter/fitment-logs'>Fitment Logs</Link>
    }
  ],
  'Supervisor': [
    {
      key: '/supervisor',
      icon: <DashboardOutlined />,
      label: <Link href='/supervisor'>Dashboard</Link>
    },
    {
      key: '/supervisor/inspections',
      icon: <FileSearchOutlined />,
      label: <Link href='/supervisor/inspections'>Inspections</Link>
    },
    {
      key: '/supervisor/reports',
      icon: <SettingOutlined />,
      label: <Link href='/supervisor/reports'>Reports</Link>
    }
  ],
  'Site Manager': [
    {
      key: '/sitemanager',
      icon: <DashboardOutlined />,
      label: <Link href='/sitemanager'>Dashboard</Link>
    },
    {
      key: '/sitemanager/tyres',
      icon: <AppstoreOutlined />,
      label: <Link href='/sitemanager/tyres'>Tyres</Link>
    },
    {
      key: '/sitemanager/inspections',
      icon: <FileSearchOutlined />,
      label: <Link href='/sitemanager/inspections'>Inspections</Link>
    },
    {
      key: '/sitemanager/reports',
      icon: <SettingOutlined />,
      label: <Link href='/sitemanager/reports'>Reports</Link>
    }
  ],
  'Admin': [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link href='/admin'>Dashboard</Link>
    },
    {
      key: '/admin/tyres',
      icon: <AppstoreOutlined />,
      label: <Link href='/admin/tyres'>Tyres</Link>
    },
    {
      key: '/admin/settings',
      icon: <ToolOutlined />,
      label: <Link href='/admin/settings'>System Settings</Link>
    },
    {
      key: '/admin/machines',
      icon: <PieChartOutlined />,
      label: <Link href='/admin/machines'>Machines</Link>
    },
    {
      key: '/admin/inspections',
      icon: <FileSearchOutlined />,
      label: <Link href='/admin/inspections'>Inspections</Link>
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link href='/admin/users'>Users</Link>
    },
    {
      key: '/admin/setup-users',
      icon: <UserOutlined />,
      label: <Link href='/admin/setup-users'>User Setup</Link>
    },
    {
      key: '/admin/reports',
      icon: <BarChartOutlined />,
      label: <Link href='/admin/reports'>Reports</Link>
    }
  ],
  'Director': [
    {
      key: '/director',
      icon: <DashboardOutlined />,
      label: <Link href='/director/'>Dashboard</Link>
    },
    {
      key: '/director/reports',
      icon: <FileSearchOutlined />,
      label: 'Reports',
      children: [
        {
          key: '/director/reports',
          label: (
            <Link href='/director/reports'>
              <BarChartOutlined style={{ marginRight: 8 }} />
              Overview
            </Link>
          )
        },
        {
          key: '/director/reports/supplier',
          label: (
            <Link href='/director/reports/supplier'>
              <TeamOutlined style={{ marginRight: 8 }} />
              Supplier Performance
            </Link>
          )
        },
        {
          key: '/director/reports/spend',
          label: (
            <Link href='/director/reports/spend'>
              <DollarOutlined style={{ marginRight: 8 }} />
              Spend Analysis
            </Link>
          )
        },
        {
          key: '/director/reports/scrap',
          label: (
            <Link href='/director/reports/scrap'>
              <PieChartOutlined style={{ marginRight: 8 }} />
              Scrap Analysis
            </Link>
          )
        },
        {
          key: '/director/reports/failures',
          label: (
            <Link href='/director/reports/failures'>
              <FileSearchOutlined style={{ marginRight: 8 }} />
              Failure Trends
            </Link>
          )
        }
      ]
    }
  ]
}

const SystemLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { userData, loading, logout } = useUser()

  // No role assigned yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  // No user data, redirect to login
  if (!userData) {
    router.push('/login')
    return null
  }

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((part, i, arr) => {
      const href = '/' + arr.slice(0, i + 1).join('/')
      return { title: routeMap[href] || part }
    })

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className='text-white text-center py-4 text-lg font-bold'>TMS</div>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          items={allRoutesByRole[userData.role] || []}
        />
      </Sider>
      <Layout style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Header className='bg-white flex items-center justify-between px-4 shadow-sm'>
          <div className="flex items-center">
            <Breadcrumb items={breadcrumbs} />
            {userData && (
              <span className="ml-4 text-sm bg-blue-100 px-2 py-1 rounded">
                {userData.role}
              </span>
            )}
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'account',
                  icon: <UserOutlined />,
                  label: 'Manage Account',
                  onClick: () => setDrawerOpen(true)
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  onClick: logout
                }
              ]
            }}
            trigger={['click']}
          >
            <div className="flex items-center cursor-pointer">
              <span className="mr-2 hidden md:inline text-black">
                {userData?.name || userData?.email}
              </span>
              <Avatar
                style={{ backgroundColor: '#1677ff' }}
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </Header>
        <Content
          className='p-6 bg-gray-50'
          style={{ flex: 1, overflowY: 'auto' }}
        >
          {children}
        </Content>
      </Layout>

      <Drawer
        title='Manage Account'
        placement='right'
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Form layout='vertical'>
          <Form.Item label='Email'>
            <Input type='email' placeholder={userData?.email || 'user@example.com'} disabled />
          </Form.Item>
          <Form.Item label='Name'>
            <Input placeholder={userData?.name || 'Your Name'} disabled />
          </Form.Item>
          <Form.Item label='Role'>
            <Input placeholder={userData?.role} disabled />
          </Form.Item>
          <Form.Item label='Site'>
            <Input placeholder={userData?.site} disabled />
          </Form.Item>
        </Form>
      </Drawer>
    </Layout>
  )
}

export default SystemLayout
