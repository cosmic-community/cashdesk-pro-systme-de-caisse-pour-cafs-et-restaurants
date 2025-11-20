import { getProducts, getCategories, getTables } from '@/lib/cosmic'
import NewOrderClient from '@/components/NewOrderClient'

export default async function NewOrderPage() {
  const products = await getProducts()
  const categories = await getCategories()
  const tables = await getTables()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nouvelle Commande</h1>
          <p className="text-gray-600">Sélectionnez les produits pour créer une commande</p>
        </div>
        
        <NewOrderClient 
          products={products} 
          categories={categories}
          tables={tables}
        />
      </div>
    </div>
  )
}