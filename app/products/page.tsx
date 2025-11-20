import { getProducts, getCategories } from '@/lib/cosmic'
import ProductsList from '@/components/ProductsList'

export default async function ProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Menu des Produits</h1>
          <p className="text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        
        <ProductsList products={products} categories={categories} />
      </div>
    </div>
  )
}