// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

import { ConfigProvider, App as AntdApp } from 'antd'
import { UserProvider } from './contexts/UserContext'
import { InspectionsProvider } from './contexts/InspectionsContext'
import { FitmentLogsProvider } from './contexts/FitmentLogsContext'
import { TyreAnalyticsProvider } from './contexts/TyreAnalyticsContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#fff',
          colorPrimary: '#1677ff',
          colorBgLayout: '#fff',
          colorBgBase: '#fff'
        },
        components: {
          Layout: {
            bodyBg: '#fff',
            headerBg: '#fff',
            siderBg: '#fff',
            lightSiderBg: '#fff'
          },
          Breadcrumb: {
            itemColor: '#333',
            lastItemColor: '#1677ff',
            separatorColor: '#666'
          },
          Menu: {
            activeBarBorderWidth: 3,
            activeBarHeight: 0,
            itemColor: '#333',
            horizontalItemSelectedColor: '#1677ff',
            itemSelectedColor: '#1677ff',
            itemHoverColor: '#1677ff'
          }
        }
      }}
    >
      <AntdApp className='h-full'>
        <UserProvider>
          <InspectionsProvider>
            <FitmentLogsProvider>
              <TyreAnalyticsProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </TyreAnalyticsProvider>
            </FitmentLogsProvider>
          </InspectionsProvider>
        </UserProvider>
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
)
