// app/admin/machines/page.tsx
import MachineList from '../../../components/Forms/machines/MachineList'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../../../firebase/firebaseConfig'

type Raw = Record<string, any>
function serialize<T extends Raw> (doc: T): T {
  const out: any = {}
  for (const [k, v] of Object.entries(doc)) {
    out[k] = v instanceof Timestamp ? v.toDate().toISOString() : v
  }
  return out as T
}

export default async function MachinesPage () {
  const [ms, ts, ss] = await Promise.all([
    getDocs(collection(db, 'machines')),
    getDocs(collection(db, 'machineTypes')),
    getDocs(collection(db, 'sites'))
  ])

  const machines = ms.docs.map(d => ({
    id: d.id,
    ...serialize(d.data() as Raw)
  }))
  const types = ts.docs.map(d => ({ id: d.id, ...serialize(d.data() as Raw) }))
  const sites = ss.docs.map(d => ({ id: d.id, ...serialize(d.data() as Raw) }))

  return (
    <main style={{ padding: 16 }}>
      <MachineList
        initialData={machines}
        initialTypes={types}
        initialSites={sites}
      />
    </main>
  )
}
