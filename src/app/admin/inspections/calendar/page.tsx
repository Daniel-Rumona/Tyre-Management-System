'use client'
import { useEffect, useState } from 'react'
import { Calendar, Badge, Spin, Select } from 'antd'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import dayjs, { Dayjs } from 'dayjs'

const { Option } = Select

export default function InspectionCalendar () {
  const [inspections, setInspections] = useState<any[]>([])
  const [tyres, setTyres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTyre, setFilterTyre] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [snap, tyreSnap] = await Promise.all([
        getDocs(collection(db, 'inspections')),
        getDocs(collection(db, 'tyres'))
      ])
      const inspections = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const tyres = tyreSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setInspections(inspections)
      setTyres(tyres)
      setLoading(false)
    }
    fetchData()
  }, [])

  const dateCellRender = (value: Dayjs) => {
    const thisDay = inspections.filter(item => {
      const date = item.date?.toDate ? item.date.toDate() : new Date(item.date)
      return (
        dayjs(date).isSame(value, 'day') &&
        (!filterTyre || item.tyreId === filterTyre)
      )
    })

    return (
      <ul className='events'>
        {thisDay.map(item => (
          <li key={item.id}>
            <Badge
              status='processing'
              text={`Tyre: ${
                tyres.find(t => t.id === item.tyreId)?.serialNumber ||
                item.tyreId
              }`}
            />
          </li>
        ))}
      </ul>
    )
  }

  if (loading) return <Spin />

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <Select
          allowClear
          placeholder='Filter by Tyre'
          style={{ width: 240 }}
          onChange={val => setFilterTyre(val || null)}
        >
          {tyres.map(t => (
            <Option key={t.id} value={t.id}>
              {t.serialNumber}
            </Option>
          ))}
        </Select>
      </div>
      <Calendar dateCellRender={dateCellRender} />
    </div>
  )
}
