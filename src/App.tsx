import { Routes, Route } from 'react-router-dom'
import SystemLayout from './components/Layout'
// Pages without layout
import LandingPage from './app/page'
import LoginPage from './app/login/page'

// Admin pages
import AdminDashboard from './components/Dashboards/AdminDashboard'
import FitterDashboardPage from './app/fitter/page'
import FitmentLogsPage from './app/fitter/fitment-logs/page'
import FitmentForm from './components/Forms/tyres/FitmentForm'
import TyreForm from './components/Forms/tyres/TyreForm'
import InspectionsPage from './app/fitter/inspections/page'
import SerialHistoryPage from './app/fitter/serial-history/page'
import NotificationsPage from './app/fitter/notifications/page'
import SupervisorDashboard from './app/supervisor/page'
import SupervisorInspections from './app/supervisor/inspections/page'
import SupervisorTyres from './app/supervisor/tyres/page'
import SupervisorReportsPage from './app/supervisor/reports/page'
// import AdminUsers from '@/pages/admin/Users'
// import AdminSettings from '@/pages/admin/Settings'
// import AdminMachines from '@/pages/admin/Machines'
// import AdminInspections from '@/pages/admin/Inspections'
// import AdminSetupUsers from '@/pages/admin/SetupUsers'
// import AdminTyres from '@/pages/admin/Tyres'

// You can add similar imports for Director, Fitter, Supervisor, etc.

function App () {
  return (
    <Routes>
      {/* Public pages */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />

      {/* Protected pages with layout */}
      <Route element={<SystemLayout />}>
        {/* Admin Routes */}
        <Route path='/admin'>
          <Route index element={<AdminDashboard />} />
          {/* <Route path='tyres' element={<AdminTyres />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='settings' element={<AdminSettings />} />
          <Route path='machines' element={<AdminMachines />} />
          <Route path='inspections' element={<AdminInspections />} />
          <Route path='setup-users' element={<AdminSetupUsers />} /> */}
        </Route>

        {/* Add other roles like /director, /fitter, etc. under this layout */}
        <Route path='/fitter'>
          <Route index element={<FitterDashboardPage />} />
          <Route path='fitment-logs' element={<FitmentLogsPage />} />
          {/* <Route path='fitment' element={<FitmentForm />} /> */}
          <Route path='tyres' element={<TyreForm />} />
          <Route path='inspections' element={<InspectionsPage />} />
          <Route path='serial-lookup' element={<SerialHistoryPage />} />
          <Route path='notifications' element={<NotificationsPage />} />
        </Route>

        <Route path='/supervisor'>
          <Route index element={<SupervisorDashboard />} />
          <Route path='tyres' element={<SupervisorTyres />} />
          <Route path='inspections' element={<SupervisorInspections />} />
          <Route path='reports' element={<SupervisorReportsPage />} />
          <Route path='notifications' element={<NotificationsPage />} />
        </Route>
        {/* Example:

        */}
      </Route>
    </Routes>
  )
}

export default App
