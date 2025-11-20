'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Category, Table, OrderItem } from '@/types'

interface NewOrderClientProps {
  products: Product[]
  categories: Category[]
  tables: Table[]
}

export default function NewOrderClient({ products, categories, tables }: NewOrderClientProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cart, setCart] = useState<OrderItem[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('Espèces')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.metadata?.category?.id === selectedCategory)
  
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * parseFloat(product.metadata?.price || '0') }
          : item
      ))
    } else {
      setCart([...cart, {
        product,
        quantity: 1,
        subtotal: parseFloat(product.metadata?.price || '0')
      }])
    }
  }
  
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity, subtotal: quantity * parseFloat(item.product.metadata?.price || '0') }
        : item
    ))
  }
  
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0)
  
  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert('Veuillez ajouter des produits à la commande')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productTitle: item.product.title,
        quantity: item.quantity,
        price: parseFloat(item.product.metadata?.price || '0'),
        subtotal: item.subtotal
      }))
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_number: selectedTable,
          items: orderItems,
          total_amount: total,
          payment_method: paymentMethod,
          notes
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        router.push(`/orders/${data.order.id}`)
      } else {
        alert('Erreur lors de la création de la commande')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la création de la commande')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2">
        {/* Category Filters */}
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
              Tous
            </button>
            {categories.map(category => (
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
                {category.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-left"
              disabled={product.metadata?.available === false}
            >
              {product.metadata?.image && (
                <img
                  src={`${product.metadata.image.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
                  alt={product.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
              <p className="text-blue-600 font-bold">{parseFloat(product.metadata?.price || '0').toFixed(2)} €</p>
              {product.metadata?.available === false && (
                <p className="text-red-500 text-sm mt-1">Indisponible</p>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Cart Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande</h2>
          
          {/* Table Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de table
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner une table</option>
              {tables.map(table => (
                <option key={table.id} value={table.title}>
                  {table.title} ({table.metadata?.capacity} places)
                </option>
              ))}
            </select>
          </div>
          
          {/* Cart Items */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Panier vide</p>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.product.title}</p>
                    <p className="text-sm text-gray-600">
                      {parseFloat(item.product.metadata?.price || '0').toFixed(2)} € × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de paiement
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Espèces">Espèces</option>
              <option value="Carte bancaire">Carte bancaire</option>
              <option value="Carte de crédit">Carte de crédit</option>
              <option value="Chèque">Chèque</option>
            </select>
          </div>
          
          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Allergies, demandes spéciales..."
            />
          </div>
          
          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Création...' : 'Valider la Commande'}
          </button>
        </div>
      </div>
    </div>
  )
}