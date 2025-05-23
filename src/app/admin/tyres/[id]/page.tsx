'use client'

import TyreTimeline from '../../../../components/Forms/tyres/TyreTimeline'
import { useParams } from 'react-router-dom'

export default function TyreDetail () {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Tyre History</h1>
      <TyreTimeline tyreId={id!} />
    </div>
  )
}
