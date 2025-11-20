import { getOrders, getProducts } from '@/lib/cosmic'
import StatisticsView from '@/components/StatisticsView'

export default async function StatisticsPage() {
  const orders = await getOrders()
  const products = await getProducts()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Statistiques de Vente</h1>
          <p className="text-gray-600">Analysez les performances de votre établissement</p>
        </div>
        
        <StatisticsView orders={orders} products={products} />
      </div>
    </div>
  )
}