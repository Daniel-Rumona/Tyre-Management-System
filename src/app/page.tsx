'use client'

import React from 'react'
import { LandingText } from '@/components/Landing'
import { TyreCanvas } from '@/components/Landing/'

const LandingPage = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-6 dark'>
      <div className='max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        <TyreCanvas />
        <LandingText />
      </div>
    </div>
  )
}

export default LandingPage
