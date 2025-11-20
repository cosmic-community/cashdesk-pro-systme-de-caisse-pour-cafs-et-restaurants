import { cosmic } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import OrderDetail from '@/components/OrderDetail'
import type { Order } from '@/types'

async function getOrder(id: string): Promise<Order | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'orders',
      id
    }).depth(1)
    
    return response.object as Order
  } catch (error) {
    return null
  }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)
  
  if (!order) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <OrderDetail order={order} />
      </div>
    </div>
  )
}