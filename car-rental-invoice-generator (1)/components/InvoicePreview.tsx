
import React from 'react';
import { Invoice } from '../types';

interface InvoicePreviewProps {
  invoice: Invoice;
  subtotal: number;
  taxAmount: number;
  total: number;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, subtotal, taxAmount, total }) => {
  return (
    <div id="invoice-preview" className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12 my-8 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start pb-8 border-b border-gray-200">
        <div>
          {invoice.company.logo ? (
            <img src={invoice.company.logo} alt={`${invoice.company.name} logo`} className="max-h-16 mb-4" />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoice.company.name || 'Your Company'}</h1>
          )}
          <p className="text-gray-600">{invoice.company.address || '123 Main St, City, State 12345'}</p>
          <p className="text-gray-600">{invoice.company.phone || '(123) 456-7890'}</p>
          <p className="text-gray-600">{invoice.company.email || 'contact@yourcompany.com'}</p>
          <p className="text-blue-600">{invoice.company.website || 'yourcompany.com'}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-light text-gray-700 tracking-wider">INVOICE</h2>
          <p className="text-gray-500 mt-1"># {invoice.invoiceNumber || 'INV-001'}</p>
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">BILL TO</h3>
          <p className="font-bold text-gray-700">{invoice.customer.name || 'Customer Name'}</p>
          <p className="text-gray-600">{invoice.customer.address || '456 Customer Ave, City, State 67890'}</p>
          <p className="text-gray-600">{invoice.customer.phone || '(987) 654-3210'}</p>
          <p className="text-gray-600">{invoice.customer.email || 'customer@email.com'}</p>
        </div>
        <div className="text-left md:text-right">
          <div className="mb-2">
            <span className="font-semibold text-gray-800">Invoice Date: </span>
            <span className="text-gray-600">{invoice.invoiceDate}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Due Date: </span>
            <span className="text-gray-600">{invoice.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="flow-root">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider text-right">Days/Qty</th>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider text-right">Rate</th>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.items.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-right">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-right">₦{item.rate.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium text-right">₦{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-gray-700">
            <span className="font-medium">Subtotal</span>
            <span>₦{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mt-2">
            <span className="font-medium">Tax ({invoice.taxRate}%)</span>
            <span>₦{taxAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between text-gray-900 font-bold text-xl">
            <span>Total</span>
            <span>₦{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {invoice.notes && (
          <div className="mt-12 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
              <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
      )}

       {/* Footer */}
       <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-xs">
            <p>Thank you for your business!</p>
            <p>{invoice.company.name} - {invoice.company.website}</p>
       </div>
    </div>
  );
};

export default InvoicePreview;