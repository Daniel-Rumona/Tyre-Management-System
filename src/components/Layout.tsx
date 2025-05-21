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
  Button
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
  '/admin/users': 'Users',

  // Director
  '/director': 'Director Dashboard',
  '/director/reports': 'Reports Overview',
  '/director/reports/supplier': 'Supplier Performance',
  '/director/reports/spend': 'Spend Analysis',
  '/director/reports/scrap': 'Scrap Analysis',
  '/director/reports/failures': 'Failure Trends'
}

const allRoutesByRole: Record<string, MenuProps['items']> = {
  Admin: [
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
    }
  ],
  Fitter: [
    {
      key: '/admin/tyres',
      icon: <AppstoreOutlined />,
      label: <Link href='/admin/tyres'>Tyres</Link>
    },
    {
      key: '/admin/inspections',
      icon: <FileSearchOutlined />,
      label: <Link href='/admin/inspections'>Inspections</Link>
    }
  ],
  Supervisor: [
    {
      key: '/admin/inspections',
      icon: <FileSearchOutlined />,
      label: <Link href='/admin/inspections'>Inspections</Link>
    },
    {
      key: '/admin/reports',
      icon: <BarChartOutlined />,
      label: <Link href='/admin/reports'>Reports</Link>
    }
  ],
  Director: [
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
  const [role, setRole] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole') || 'Admin'
    }
    return 'Admin'
  })
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push('/login')
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
          items={allRoutesByRole[role] || []}
        />
      </Sider>
      <Layout style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Header className='bg-white flex items-center justify-between px-4 shadow-sm'>
          <Breadcrumb items={breadcrumbs} />
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
                  onClick: handleLogout
                }
              ]
            }}
            trigger={['click']}
          >
            <Avatar
              style={{ backgroundColor: '#1677ff', cursor: 'pointer' }}
              icon={<UserOutlined />}
            />
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
            <Input type='email' placeholder='user@example.com' />
          </Form.Item>
          <Form.Item label='Password'>
            <Input.Password placeholder='New password' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' block>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Layout>
  )
}

export default SystemLayout
