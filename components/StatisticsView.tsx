'use client'

import { useState, useMemo } from 'react'
import type { Order, Product } from '@/types'

interface StatisticsViewProps {
  orders: Order[]
  products: Product[]
}

export default function StatisticsView({ orders, products }: StatisticsViewProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')
  
  const filteredOrders = useMemo(() => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    return orders.filter(order => {
      const orderDate = new Date(order.metadata?.order_date || order.created_at)
      
      switch (period) {
        case 'today':
          return orderDate >= startOfDay
        case 'week':
          return orderDate >= startOfWeek
        case 'month':
          return orderDate >= startOfMonth
        default:
          return true
      }
    })
  }, [orders, period])
  
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, order) => {
      return sum + parseFloat(order.metadata?.total_amount || '0')
    }, 0)
  }, [filteredOrders])
  
  const averageOrder = useMemo(() => {
    if (filteredOrders.length === 0) return 0
    return totalRevenue / filteredOrders.length
  }, [totalRevenue, filteredOrders])
  
  const topProducts = useMemo(() => {
    const productStats: Record<string, { product: Product; quantity: number; revenue: number }> = {}
    
    filteredOrders.forEach(order => {
      const items = order.metadata?.items ? JSON.parse(order.metadata.items) : []
      
      items.forEach((item: any) => {
        const product = products.find(p => p.id === item.productId)
        if (!product) return
        
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            product,
            quantity: 0,
            revenue: 0
          }
        }
        
        productStats[item.productId].quantity += item.quantity
        productStats[item.productId].revenue += item.subtotal
      })
    })
    
    return Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }, [filteredOrders, products])
  
  const statusBreakdown = useMemo(() => {
    const breakdown = {
      'En préparation': 0,
      'Servie': 0,
      'Payée': 0,
      'Annulée': 0
    }
    
    filteredOrders.forEach(order => {
      const status = order.metadata?.status || 'En préparation'
      if (status in breakdown) {
        breakdown[status as keyof typeof breakdown]++
      }
    })
    
    return breakdown
  }, [filteredOrders])
  
  return (
    <div>
      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cette Semaine
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ce Mois
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Chiffre d'Affaires</p>
          <p className="text-4xl font-bold text-blue-600">{totalRevenue.toFixed(2)} €</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Nombre de Commandes</p>
          <p className="text-4xl font-bold text-green-600">{filteredOrders.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Ticket Moyen</p>
          <p className="text-4xl font-bold text-purple-600">{averageOrder.toFixed(2)} €</p>
        </div>
      </div>
      
      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top 5 Produits</h2>
        <div className="space-y-4">
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
          ) : (
            topProducts.map((stat, index) => (
              <div key={stat.product.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stat.product.title}</p>
                    <p className="text-sm text-gray-600">{stat.quantity} unités vendues</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.revenue.toFixed(2)} €</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Répartition par Statut</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{statusBreakdown['En préparation']}</p>
            <p className="text-sm text-gray-600 mt-1">En préparation</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{statusBreakdown['Servie']}</p>
            <p className="text-sm text-gray-600 mt-1">Servie</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{statusBreakdown['Payée']}</p>
            <p className="text-sm text-gray-600 mt-1">Payée</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">{statusBreakdown['Annulée']}</p>
            <p className="text-sm text-gray-600 mt-1">Annulée</p>
          </div>
        </div>
      </div>
    </div>
  )
}