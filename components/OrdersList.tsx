'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Order } from '@/types'

interface OrdersListProps {
  orders: Order[]
}

export default function OrdersList({ orders }: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.metadata?.table_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.metadata?.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'En préparation':
        return 'bg-yellow-100 text-yellow-800'
      case 'Servie':
        return 'bg-blue-100 text-blue-800'
      case 'Payée':
        return 'bg-green-100 text-green-800'
      case 'Annulée':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Numéro de commande, table..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="En préparation">En préparation</option>
              <option value="Servie">Servie</option>
              <option value="Payée">Payée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const orderDate = new Date(order.metadata?.order_date || order.created_at)
            
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{order.title}</h3>
                    <p className="text-gray-600">
                      Table {order.metadata?.table_number || 'N/A'} • {orderDate.toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.metadata?.status)}`}>
                    {order.metadata?.status || 'En préparation'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Paiement : {order.metadata?.payment_method || 'N/A'}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {parseFloat(order.metadata?.total_amount || '0').toFixed(2)} €
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}