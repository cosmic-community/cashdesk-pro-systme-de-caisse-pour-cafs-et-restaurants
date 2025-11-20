import Link from 'next/link'
import { getOrders } from '@/lib/cosmic'
import OrdersList from '@/components/OrdersList'

export default async function OrdersPage() {
  const orders = await getOrders()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Historique des Commandes</h1>
            <p className="text-gray-600">Consultez toutes les commandes passées</p>
          </div>
          <Link
            href="/orders/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Nouvelle Commande
          </Link>
        </div>
        
        <OrdersList orders={orders} />
      </div>
    </div>
  )
}