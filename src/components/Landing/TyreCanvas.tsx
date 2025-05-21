'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Simplified placeholder component that doesn't use @react-three/fiber
const TyreCanvas = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center p-4"
    >
      <div className="relative w-64 h-64 md:w-96 md:h-96 bg-gray-800 rounded-full flex items-center justify-center">
        <div className="absolute inset-4 rounded-full bg-gray-700 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full bg-gray-800 flex items-center justify-center text-center p-4">
            <span className="text-xl font-bold text-gray-300">
              Tyre Management System
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TyreCanvas
