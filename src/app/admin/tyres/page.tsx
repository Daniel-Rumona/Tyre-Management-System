import TyreList, { Tyre } from '@/components/Forms/tyres/TyreList'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

export default async function TyresPage () {
  // Helper to stringify all Timestamp fields:
  function serializeDoc<T extends Record<string, any>> (doc: T): T {
    const out: Record<string, any> = {}
    Object.entries(doc).forEach(([key, val]) => {
      if (val instanceof Timestamp) {
        // convert to ISO string (or you could use .toMillis() for a number)
        out[key] = val.toDate().toISOString()
      } else {
        out[key] = val
      }
    })
    return out as T
  }
  // load once on the server
  const snap = await getDocs(collection(db, 'tyres'))
  const initialTyres: Tyre[] = snap.docs.map(d => {
    const data = d.data() as Record<string, any>
    // merge id plus all plain fields
    return {
      id: d.id,
      ...serializeDoc(data)
    }
  })

  return (
    <main className='p-4'>
      <TyreList initialTyres={initialTyres} />
    </main>
  )
}
