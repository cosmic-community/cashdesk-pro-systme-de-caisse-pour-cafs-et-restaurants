'use client'

import { useRouter } from 'next/navigation'
import type { Order } from '@/types'

interface OrderDetailProps {
  order: Order
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter()
  
  const orderDate = new Date(order.metadata?.order_date || order.created_at)
  const items = order.metadata?.items ? JSON.parse(order.metadata.items) : []
  
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Caisse - ${order.title}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { 
              font-family: 'Courier New', monospace; 
              width: 80mm; 
              margin: 0; 
              padding: 5mm;
              font-size: 12px;
            }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .header h1 { margin: 0; font-size: 18px; }
            .info { margin-bottom: 10px; }
            .items { margin-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .totals { border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
            .total-line { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total-line.final { font-size: 16px; font-weight: bold; margin-top: 10px; }
            .footer { text-align: center; margin-top: 15px; border-top: 2px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍽️ CashDesk Pro</h1>
            <p>Votre Restaurant</p>
            <p>${orderDate.toLocaleString('fr-FR')}</p>
          </div>
          
          <div class="info">
            <p><strong>${order.title}</strong></p>
            <p>Table: ${order.metadata?.table_number || 'N/A'}</p>
            <p>Paiement: ${order.metadata?.payment_method || 'N/A'}</p>
          </div>
          
          <div class="items">
            ${items.map((item: any) => `
              <div class="item">
                <span>${item.quantity}x ${item.productTitle}</span>
                <span>${item.subtotal.toFixed(2)} €</span>
              </div>
            `).join('')}
          </div>
          
          <div class="totals">
            <div class="total-line">
              <span>Sous-total:</span>
              <span>${parseFloat(order.metadata?.total_amount || '0').toFixed(2)} €</span>
            </div>
            <div class="total-line final">
              <span>TOTAL:</span>
              <span>${parseFloat(order.metadata?.total_amount || '0').toFixed(2)} €</span>
            </div>
          </div>
          
          ${order.metadata?.notes ? `
            <div style="margin-top: 10px; padding: 5px; background: #f3f4f6; border-radius: 4px;">
              <strong>Notes:</strong> ${order.metadata.notes}
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Merci de votre visite!</p>
            <p>À bientôt 😊</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '', 'width=300,height=600')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Retour
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          🖨️ Imprimer le Ticket
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8 pb-6 border-b-2 border-dashed border-gray-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ CashDesk Pro</h1>
          <p className="text-gray-600">Ticket de Caisse</p>
        </div>
        
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Commande</p>
              <p className="text-lg font-bold text-gray-900">{order.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Table</p>
              <p className="text-lg font-bold text-gray-900">{order.metadata?.table_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Heure</p>
              <p className="text-lg font-bold text-gray-900">{orderDate.toLocaleString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paiement</p>
              <p className="text-lg font-bold text-gray-900">{order.metadata?.payment_method || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Statut</p>
            <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {order.metadata?.status || 'En préparation'}
            </span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Articles Commandés</h2>
          <div className="space-y-3">
            {items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{item.productTitle}</p>
                  <p className="text-sm text-gray-600">
                    {item.price.toFixed(2)} € × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-gray-900">{item.subtotal.toFixed(2)} €</p>
              </div>
            ))}
          </div>
        </div>
        
        {order.metadata?.notes && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
            <p className="text-gray-900">{order.metadata.notes}</p>
          </div>
        )}
        
        <div className="border-t-2 border-dashed border-gray-300 pt-6">
          <div className="flex justify-between items-center text-3xl font-bold text-gray-900">
            <span>TOTAL</span>
            <span className="text-blue-600">{parseFloat(order.metadata?.total_amount || '0').toFixed(2)} €</span>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600 border-t-2 border-dashed border-gray-300 pt-6">
          <p className="text-lg font-medium mb-2">Merci de votre visite!</p>
          <p>À bientôt 😊</p>
        </div>
      </div>
    </div>
  )
}