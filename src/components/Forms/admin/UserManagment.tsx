'use client'

import React, { useEffect, useState } from 'react'
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
  message,
  Tag
} from 'antd'
import {
  UserAddOutlined,
  UserOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { auth, db } from '@/firebase/firebaseConfig'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  getAuth
} from 'firebase/auth'
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { ROLES, RoleType } from '@/utils/userSetup'

const { Search } = Input
const { Option } = Select

// Default password for new users
const DEFAULT_PASSWORD = 'Password123!'

// Role names for display
const roleOptions = Object.values(ROLES)

const getRoleColor = (role: string) => {
  switch(role) {
    case ROLES.FITTER: return 'blue'
    case ROLES.SUPERVISOR: return 'green'
    case ROLES.SITE_MANAGER: return 'purple'
    case ROLES.DIRECTOR: return 'orange'
    case ROLES.ADMIN: return 'red'
    default: return 'default'
  }
}

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([])
  const [filterRole, setFilterRole] = useState<string | undefined>()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [editingUser, setEditingUser] = useState<any>(null)

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, 'users'))
    setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openModal = (user: any = null) => {
    setEditingUser(user)
    form.setFieldsValue(user || { role: ROLES.FITTER, email: '@company.com' })
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'users', id))
    message.success('User deleted.')
    fetchUsers()
  }

  const handleSubmit = async (values: any) => {
    // Ensure email has domain if not provided
    const email = values.email.includes('@') ? values.email : `${values.email}@company.com`
    
    if (editingUser) {
      await setDoc(doc(db, 'users', editingUser.id), {
        ...editingUser,
        ...values,
        email
      })
      message.success('User updated.')
    } else {
      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          DEFAULT_PASSWORD
        )
        await updateProfile(userCred.user, { displayName: values.name })
        await setDoc(doc(db, 'users', userCred.user.uid), {
          name: values.name,
          email,
          role: values.role,
          site: values.site
        })
        message.success('User created and stored.')
      } catch (err: any) {
        message.error(err.message)
      }
    }
    setModalOpen(false)
    form.resetFields()
    setEditingUser(null)
    fetchUsers()
  }

  const filteredUsers = users.filter(
    u =>
      (!filterRole || u.role === filterRole) &&
      (u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
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
              title='Tyre Fitters'
              value={users.filter(u => u.role === ROLES.FITTER).length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title='Supervisors'
              value={users.filter(u => u.role === ROLES.SUPERVISOR).length}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title='Site Managers'
              value={users.filter(u => u.role === ROLES.SITE_MANAGER).length}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className='mb-4'>
        <Col xs={24} md={6}>
          <Select
            allowClear
            placeholder='Filter by Role'
            value={filterRole}
            onChange={val => setFilterRole(val)}
            className='w-full'
          >
            {roleOptions.map(role => (
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

      <Table
        rowKey='id'
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { 
            title: 'Role', 
            dataIndex: 'role',
            render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>
          },
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
            rules={[{ required: true }]}
            help="Will append @company.com if not provided"
          >
            <Input />
          </Form.Item>
          <Form.Item name='role' label='Role' rules={[{ required: true }]}>
            <Select>
              {roleOptions.map(r => (
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
          {!editingUser && (
            <div className="mb-4 p-2 bg-blue-50 rounded">
              <p>Default password will be: <strong>{DEFAULT_PASSWORD}</strong></p>
            </div>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default UserManagement
