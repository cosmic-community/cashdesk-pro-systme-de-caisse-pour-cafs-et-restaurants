import { getTables } from '@/lib/cosmic'
import TablesList from '@/components/TablesList'

export default async function TablesPage() {
  const tables = await getTables()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Tables</h1>
          <p className="text-gray-600">Visualisez et gérez l'occupation des tables</p>
        </div>
        
        <TablesList tables={tables} />
      </div>
    </div>
  )
}