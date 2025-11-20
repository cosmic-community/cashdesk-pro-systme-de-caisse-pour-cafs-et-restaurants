'use client'

import { useState } from 'react'
import type { Product, Category } from '@/types'

interface ProductsListProps {
  products: Product[]
  categories: Category[]
}

export default function ProductsList({ products, categories }: ProductsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.metadata?.category?.id === selectedCategory)
  
  return (
    <div>
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({products.length})
          </button>
          {categories.map(category => {
            const count = products.filter(p => p.metadata?.category?.id === category.id).length
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.metadata?.icon && <span className="mr-1">{category.metadata.icon}</span>}
                {category.title} ({count})
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.metadata?.image && (
                <img
                  src={`${product.metadata.image.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                {product.metadata?.description && (
                  <p className="text-gray-600 text-sm mb-3">{product.metadata.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {parseFloat(product.metadata?.price || '0').toFixed(2)} €
                  </p>
                  {product.metadata?.available === false ? (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Indisponible
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Disponible
                    </span>
                  )}
                </div>
                {product.metadata?.category && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Catégorie: <span className="font-medium">{product.metadata.category.title}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}