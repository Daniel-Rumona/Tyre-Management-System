import { useState, useEffect } from 'react'
import { Form, Input, Button, App } from 'antd'
import { motion } from 'framer-motion'
import { LoginOutlined } from '@ant-design/icons'
import { useUser, getRoleHomePath } from '../../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const router = useNavigate()
  const { userData, isAuthenticated, login } = useUser()
  const { message } = App.useApp()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isAuthenticated && userData) {
      timeoutId = setTimeout(() => {
        const rolePath = getRoleHomePath(userData.role)
        router(rolePath)
      }, 0)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isAuthenticated, userData, router])

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      message.success('Login successful')
    } catch (error: any) {
      message.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#396afc] relative'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='relative bg-white/20 backdrop-blur-2xl border border-white/30 p-10 pt-24 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center'
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className='absolute -top-16 left-1/2 transform -translate-x-1/2'
        >
          <img
            src='/images/tyre-image.png'
            alt='Tyre'
            width={100}
            height={100}
            className='rounded-full shadow-lg border-4 border-gray-800'
            draggable={false}
          />
        </motion.div>

        <h2 className='text-white text-2xl mb-6 font-bold text-center'>
          Tyre Management Systemsss
        </h2>
        <Form layout='vertical' onFinish={onFinish} className='w-full'>
          <Form.Item
            name='email'
            label={<span className='text-white'>Email</span>}
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input type='email' placeholder='email@company.com' />
          </Form.Item>
          <Form.Item
            name='password'
            label={<span className='text-white'>Password</span>}
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                block
                icon={<LoginOutlined />}
              >
                Login
              </Button>
            </motion.div>
          </Form.Item>
          <div className='text-gray-200 text-xs mt-4'>
            <p>Demo Accounts:</p>
            <p>fitter@company.com / Password123!</p>
            <p>supervisor@company.com / Password123!</p>
            <p>sitemanager@company.com / Password123!</p>
          </div>
        </Form>
      </motion.div>
      <img
        src='/images/QuantilytixO.png'
        alt='Quantilytix Logo'
        width={120}
        height={120}
        className='fixed bottom-4 right-4 opacity-70 z-50'
        draggable={false}
      />
    </div>
  )
}

export default LoginPage
