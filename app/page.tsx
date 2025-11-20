import Link from 'next/link'
import { getOrders, getProducts } from '@/lib/cosmic'

export default async function HomePage() {
  const orders = await getOrders()
  const products = await getProducts()
  
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.metadata?.order_date || order.created_at)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })
  
  const todayRevenue = todayOrders.reduce((sum, order) => {
    return sum + parseFloat(order.metadata?.total_amount || '0')
  }, 0)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🍽️ CashDesk Pro
          </h1>
          <p className="text-xl text-gray-600">
            Système de Caisse pour Cafés et Restaurants
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="text-gray-600 text-sm font-medium mb-2">Commandes Aujourd'hui</div>
            <div className="text-4xl font-bold text-gray-900">{todayOrders.length}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="text-gray-600 text-sm font-medium mb-2">CA du Jour</div>
            <div className="text-4xl font-bold text-gray-900">{todayRevenue.toFixed(2)} €</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="text-gray-600 text-sm font-medium mb-2">Produits au Menu</div>
            <div className="text-4xl font-bold text-gray-900">{products.length}</div>
          </div>
        </div>
        
        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/orders/new"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Nouvelle Commande
            </h2>
            <p className="text-gray-600">
              Créer une nouvelle commande client
            </p>
          </Link>
          
          <Link
            href="/orders"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
          >
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              Historique
            </h2>
            <p className="text-gray-600">
              Consulter toutes les commandes
            </p>
          </Link>
          
          <Link
            href="/statistics"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              Statistiques
            </h2>
            <p className="text-gray-600">
              Voir les statistiques de vente
            </p>
          </Link>
          
          <Link
            href="/products"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-500"
          >
            <div className="text-6xl mb-4">🍔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              Menu
            </h2>
            <p className="text-gray-600">
              Gérer les produits du menu
            </p>
          </Link>
          
          <Link
            href="/tables"
            className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-500"
          >
            <div className="text-6xl mb-4">🪑</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
              Tables
            </h2>
            <p className="text-gray-600">
              Gérer les tables du restaurant
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}