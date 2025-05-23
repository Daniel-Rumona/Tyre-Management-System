'use client'

import { useEffect } from 'react'
import { Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

// This page redirects supervisors to the site manager reports
export default function SupervisorReportsPage () {
  const router = useNavigate()

  useEffect(() => {
    // Redirect to site manager reports page
    router('/sitemanager/reports')
  }, [router])

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='text-center'>
        <Spin size='large' />
        <p className='mt-4 text-gray-500'>Redirecting to reports...</p>
      </div>
    </div>
  )
}
