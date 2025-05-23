// app/reports/supplier/page.tsx
import SupplierReportClient, {
  type TyreWithId
} from '../../../../components/Forms/reports/supplier/SupplierReport'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../../firebase/firebaseConfig'

export default async function SupplierReportPage () {
  // Fetch once on the server
  const snap = await getDocs(collection(db, 'tyres'))
  const initialTyres = snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Record<string, any>)
  })) as TyreWithId[]

  return <SupplierReportClient initialTyres={initialTyres} />
}
