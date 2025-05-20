'use client'

import { Modal } from 'antd'
import TyreTimeline from './TyreTimeline'

interface Props {
  tyreId: string
  open: boolean
  onClose: () => void
}

export default function TyreTimelineModal ({ tyreId, open, onClose }: Props) {
  return (
    <Modal
      title='Tyre Lifecycle History'
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}
    >
      <TyreTimeline tyreId={tyreId} />
    </Modal>
  )
}
