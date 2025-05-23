import { LandingText } from '../components/Landing'
import { TyreCanvas } from '../components/Landing/'

const LandingPage = () => {
  return (
    <div className='min-h-screen w-screen bg-gray-900 text-white flex items-center justify-center px-0 py-0'>
      <div className='flex flex-col md:flex-row w-full h-full gap-16 items-center justify-center'>
        <div className='flex-1 flex justify-center'>
          <TyreCanvas />
        </div>
        <div className='flex-1 flex items-center'>
          <LandingText />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
