'use client'

import React, { useState } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  Input,
  Select,
  Button,
  Table,
  Modal,
  Form,
  message
} from 'antd'
import {
  UserAddOutlined,
  UserOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

// Dummy data for display
const roles = ['Fitter', 'Supervisor', 'Site Manager', 'Director', 'Admin']

const initialUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@site.com',
    role: 'Fitter',
    site: 'Site A'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@admin.com',
    role: 'Admin',
    site: 'Head Office'
  }
]

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers)
  const [filterRole, setFilterRole] = useState<string | undefined>()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [editingUser, setEditingUser] = useState<any>(null)

  const openModal = (user: any = null) => {
    setEditingUser(user)
    form.setFieldsValue(user || { role: 'Fitter' })
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    message.success('User deleted.')
  }

  const handleSubmit = (values: any) => {
    if (editingUser) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id ? { ...editingUser, ...values } : u
        )
      )
      message.success('User updated.')
    } else {
      const newUser = { ...values, id: Date.now() }
      setUsers(prev => [...prev, newUser])
      message.success('User added.')
    }
    setModalOpen(false)
    form.resetFields()
    setEditingUser(null)
  }

  const filteredUsers = users.filter(
    u =>
      (!filterRole || u.role === filterRole) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      {/* Metrics */}
      <Row gutter={16} className='mb-4'>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title='Total Users'
              value={users.length}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title='Admins'
              value={users.filter(u => u.role === 'Admin').length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title='Fitters'
              value={users.filter(u => u.role === 'Fitter').length}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row gutter={16} className='mb-4'>
        <Col xs={24} md={6}>
          <Select
            allowClear
            placeholder='Filter by Role'
            value={filterRole}
            onChange={val => setFilterRole(val)}
            className='w-full'
          >
            {roles.map(role => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={10}>
          <Search
            placeholder='Search by name or email'
            onSearch={val => setSearch(val)}
            allowClear
          />
        </Col>
        <Col xs={24} md={8} className='text-right'>
          <Button
            type='primary'
            icon={<UserAddOutlined />}
            onClick={() => openModal()}
          >
            Add New User
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Table
        rowKey='id'
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Role', dataIndex: 'role' },
          { title: 'Site', dataIndex: 'site' },
          {
            title: 'Actions',
            render: (_, record) => (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openModal(record)}
                  className='mr-2'
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(record.id)}
                />
              </>
            )
          }
        ]}
        dataSource={filteredUsers}
      />

      {/* Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingUser ? 'Update' : 'Add'}
      >
        <Form layout='vertical' form={form} onFinish={handleSubmit}>
          <Form.Item name='name' label='Full Name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='role' label='Role' rules={[{ required: true }]}>
            <Select>
              {roles.map(r => (
                <Option key={r} value={r}>
                  {r}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='site'
            label='Site ID / Name'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default UserManagement
