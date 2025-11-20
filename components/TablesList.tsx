'use client'

import type { Table } from '@/types'

interface TablesListProps {
  tables: Table[]
}

export default function TablesList({ tables }: TablesListProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Occupée':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Réservée':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Libre':
        return '✓'
      case 'Occupée':
        return '●'
      case 'Réservée':
        return '◐'
      default:
        return '○'
    }
  }
  
  return (
    <div>
      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Libre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Occupée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Réservée</span>
          </div>
        </div>
      </div>
      
      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Aucune table configurée</p>
          </div>
        ) : (
          tables.map(table => (
            <div 
              key={table.id} 
              className={`bg-white rounded-lg shadow-md p-6 border-2 ${getStatusColor(table.metadata?.status || 'Libre')}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {getStatusIcon(table.metadata?.status || 'Libre')}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{table.title}</h3>
                <p className="text-gray-600 mb-3">
                  {table.metadata?.capacity || 0} places
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(table.metadata?.status || 'Libre')}`}>
                  {table.metadata?.status || 'Libre'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}