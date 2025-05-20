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
  TeamOutlined
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = Layout

const routeMap: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/register': 'Register',
  '/admin': 'Dashboard',
  '/admin/tyres': 'Tyres',
  '/admin/machines': 'Machines',
  '/admin/inspections': 'Inspections',
  '/admin/reports': 'Reports',
  '/admin/users': 'Users'
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
      key: '/admin/machines',
      icon: <ToolOutlined />,
      label: <Link href='/admin/machines'>Machines</Link>
    },
    {
      key: '/admin/inspections',
      icon: <FileSearchOutlined />,
      label: <Link href='/admin/inspections'>Inspections</Link>
    },
    {
      key: '/admin/reports',
      icon: <SettingOutlined />,
      label: <Link href='/admin/reports'>Reports</Link>
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
      icon: <SettingOutlined />,
      label: <Link href='/admin/reports'>Reports</Link>
    }
  ],
  Director: [
    {
      key: '/admin/reports',
      icon: <SettingOutlined />,
      label: <Link href='/admin/reports'>Reports</Link>
    }
  ]
}

const SystemLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [role, setRole] = useState<string>('Admin') // Replace with real role from auth
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // TODO: Firebase logout
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
    <Layout style={{ minHeight: '100vh' }}>
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
      <Layout>
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
        <Content className='p-6 bg-gray-50'>{children}</Content>
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
