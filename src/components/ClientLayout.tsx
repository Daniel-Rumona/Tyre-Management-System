'use client'

import { usePathname } from 'next/navigation'
import SystemLayout from '@/components/Layout'

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

  return isPublic ? <>{children}</> : <SystemLayout>{children}</SystemLayout>
}
