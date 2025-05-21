import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ConfigProvider } from 'antd'
import ClientLayout from '@/components/ClientLayout'
import { App as AntdApp } from 'antd'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Tyre Management System',
  description: 'Made with love by DR | Quantilytix'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider
          theme={{
            components: {
              Breadcrumb: {
                itemColor: '#fff',
                lastItemColor: 'dodgerblue',
                separatorColor: '#fff'
              }
            }
          }}
        >
          <AntdApp>
            <ClientLayout>{children}</ClientLayout>
          </AntdApp>
        </ConfigProvider>
      </body>
    </html>
  )
}
