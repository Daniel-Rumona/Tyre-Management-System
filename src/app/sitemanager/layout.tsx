'use client'

import React, { useState } from 'react'
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Badge,
  Dropdown,
  Space,
  Breadcrumb
} from 'antd'
import type { MenuProps } from 'antd/es/menu'
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import {
  AppstoreOutlined,
  FileSearchOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { useUser } from '../../contexts/UserContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'

const { Header, Sider, Content } = Layout

export default function SiteManagerLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const location = useLocation()
  const pathname = location.pathname
  const router = useNavigate()
  const { userData, logout } = useUser()
  const [collapsed, setCollapsed] = useState(false)

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const breadcrumbItems: BreadcrumbItemType[] = []

    if (pathname === '/sitemanager') {
      return [{ title: 'Dashboard' }]
    }

    const paths = pathname.split('/').filter(p => p)

    // First item is always dashboard with link
    breadcrumbItems.push({
      title: <Link to='/sitemanager'>Dashboard</Link>
    })

    // Add current page
    if (paths.length > 1) {
      const pageTitle =
        paths[1]?.charAt(0).toUpperCase() +
        paths[1]?.slice(1).replace(/-/g, ' ')
      breadcrumbItems.push({ title: pageTitle })
    }

    return breadcrumbItems
  }

  // Menu items for sidebar navigation
  const menuItems: MenuProps['items'] = [
    {
      key: '/sitemanager',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/sitemanager/tyres',
      icon: <AppstoreOutlined />,
      label: 'Tyres'
    },
    {
      key: '/sitemanager/inspections',
      icon: <FileSearchOutlined />,
      label: 'Inspections'
    },
    {
      key: '/sitemanager/reports',
      icon: <SettingOutlined />,
      label: 'Reports'
    }
  ]

  // User menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout'
    }
  ]

  // Handle menu clicks
  const handleMenuClick: MenuProps['onClick'] = item => {
    router(item.key as string)
  }

  // Handle user menu clicks
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // Handle logout action
      logout()
      router('/login')
    } else if (key === 'profile') {
      // Handle profile action
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#001529',
          boxShadow: '2px 0 8px 0 rgba(29,35,41,0.05)'
        }}
        theme='dark'
      >
        <div className='flex items-center justify-center h-16'>
          <div
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: collapsed ? '16px' : '20px'
            }}
          >
            {collapsed ? 'TMS' : 'Tyre System'}
          </div>
        </div>
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 80 : 220, transition: 'all 0.2s' }}
      >
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%'
          }}
        >
          <div className='flex items-center'>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', marginRight: 24 }}
            />
            <Breadcrumb items={generateBreadcrumbs()} />
          </div>

          <div className='flex items-center'>
            <Space>
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick
                }}
                placement='bottomRight'
                arrow
              >
                <div className='flex items-center cursor-pointer ml-4'>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1677ff' }}
                  />
                  {!collapsed && (
                    <span className='ml-2'>
                      {userData?.name || 'Site Manager'}
                    </span>
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content style={{ margin: '24px 24px', overflow: 'initial' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
