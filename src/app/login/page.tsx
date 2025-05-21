import LoginForm from '@/components/Login/LoginPage'

export const metadata = {
  title: 'Login • Tyre Management'
}

const LoginPage = () => {
  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center px-4'>
      <LoginForm />
    </div>
  )
}

export default LoginPage
