'use client'

import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import { Form, Input, Button, message } from 'antd'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LoginOutlined } from '@ant-design/icons'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      message.success('Login successful')
      router.push('/admin')
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='relative bg-gray-800 p-8 pt-20 rounded-lg shadow-lg w-full max-w-md'
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }}
          className='absolute -top-14 left-1/2 transform -translate-x-1/2'
        >
          <Image
            src='/images/tyre-image.png'
            alt='Tyre'
            width={100}
            height={100}
            className='rounded-full shadow-lg border-4 border-gray-800'
          />
        </motion.div>

        <h2 className='text-white text-2xl mb-6 font-bold text-center'>
          Admin Login
        </h2>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='email'
            label={<span className='text-white'>Email</span>}
            rules={[{ required: true }]}
          >
            <Input type='email' />
          </Form.Item>
          <Form.Item
            name='password'
            label={<span className='text-white'>Password</span>}
            rules={[{ required: true }]}
          >
            <Input.Password />
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
        </Form>
      </motion.div>
      <Image
        src='/images/QuantilytixO.png'
        alt='Quantilytix Logo'
        width={120}
        height={120}
        className='fixed bottom-4 right-4 opacity-70'
      />
    </>
  )
}

export default LoginForm
