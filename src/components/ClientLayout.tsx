'use client'

import { usePathname } from 'next/navigation'
import SystemLayout from '@/components/Layout'
import SeedInitializer from './SeedInitializer'

export default function ClientLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')

  return (
    <>
      {/* This component doesn't render anything visible but seeds users on first load */}
      <SeedInitializer />
      {isPublic ? <>{children}</> : <SystemLayout>{children}</SystemLayout>}
    </>
  )
}
