import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { table_number, items, total_amount, payment_method, notes } = body
    
    // Generate order number
    const orderNumber = Date.now().toString().slice(-6)
    
    const newOrder = await cosmic.objects.insertOne({
      title: `Commande #${orderNumber}`,
      type: 'orders',
      metadata: {
        table_number: table_number || "",
        items: JSON.stringify(items),
        total_amount: total_amount.toString(),
        status: "En préparation",
        payment_method: payment_method || "Espèces",
        order_date: new Date().toISOString(),
        notes: notes || ""
      }
    })
    
    return NextResponse.json({ success: true, order: newOrder.object })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}