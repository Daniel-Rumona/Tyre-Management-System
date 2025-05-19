import AdminLayout from '@/components/Layout'
import AdminDashboard from '@/components/Dashboards/AdminDashboard'

export default function AdminPage () {
  return (
    <AdminLayout>
      <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
      <AdminDashboard />
    </AdminLayout>
  )
}
