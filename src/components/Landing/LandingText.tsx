'use client'

import React from 'react'
import { Button } from 'antd'
import { motion } from 'framer-motion'
import Link from 'next/link'

const LandingText = () => {
  return (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className='text-4xl font-bold text-white'>Tyre Management System</h1>
      <p className='text-lg text-gray-600 max-w-xl'>
        This system enables mining companies to manage their tyre inventory,
        track tyre lifecycles, log inspections, analyze failures, and generate
        powerful operational and financial reports.
      </p>
      <Link href='/login'>
        <Button type='primary' size='large'>
          Login
        </Button>
      </Link>
    </motion.div>
  )
}

export default LandingText
