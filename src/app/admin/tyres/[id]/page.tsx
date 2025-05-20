'use client'

import TyreTimeline from '@/components/Forms/tyres/TyreTimeline'
import { useParams } from 'next/navigation'

export default function TyreDetail () {
  const { id } = useParams() as { id: string }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Tyre History</h1>
      <TyreTimeline tyreId={id} />
    </div>
  )
}
