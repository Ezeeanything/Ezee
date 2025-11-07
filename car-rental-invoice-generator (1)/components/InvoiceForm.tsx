
import React from 'react';
import { Invoice, LineItem } from '../types';
import { TrashIcon, PlusCircleIcon } from './icons';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
}

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input
            ref={ref}
            className={`w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${className}`}
            {...props}
        />
    )
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, setInvoice }) => {

    const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvoice(prev => ({ ...prev, [name]: value }));
    };

    const handlePartyChange = (party: 'company' | 'customer', e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInvoice(prev => ({
            ...prev,
            [party]: {
                ...prev[party],
                [name]: value,
            },
        }));
    };

    const handleItemChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newItems = invoice.items.map(item => {
            if (item.id === id) {
                return { ...item, [name]: name === 'description' ? value : parseFloat(value) || 0 };
            }
            return item;
        });
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInvoice(prev => ({
                    ...prev,
                    company: {
                        ...prev.company,
                        logo: reader.result as string,
                    },
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeLogo = () => {
        setInvoice(prev => ({
            ...prev,
            company: {
                ...prev.company,
                logo: '',
            },
        }));
    };

    const addItem = () => {
        const newItem: LineItem = {
            id: crypto.randomUUID(),
            description: 'Additional Charge',
            quantity: 1,
            rate: 0,
        };
        setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const removeItem = (id: string) => {
        setInvoice(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Invoice Details</h2>

            <Section title="Company Information">
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                    <div className="mt-1 flex items-center">
                        {invoice.company.logo && (
                            <img src={invoice.company.logo} alt="logo" className="h-12 w-auto mr-4 bg-gray-700 p-1 rounded"/>
                        )}
                        <div className="flex-1">
                             <input 
                                id="logo-upload" 
                                name="logo-upload" 
                                type="file" 
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={handleLogoUpload}
                             />
                        </div>
                        {invoice.company.logo && (
                            <button onClick={removeLogo} className="ml-4 text-sm text-red-600 hover:text-red-800">Remove</button>
                        )}
                    </div>
                </div>
                <div className="md:col-span-2"><Input name="name" placeholder="Company Name" value={invoice.company.name} onChange={e => handlePartyChange('company', e)} /></div>
                <div className="md:col-span-2"><Input name="address" placeholder="Address" value={invoice.company.address} onChange={e => handlePartyChange('company', e)} /></div>
                <Input name="phone" placeholder="Phone" value={invoice.company.phone} onChange={e => handlePartyChange('company', e)} />
                <Input name="email" placeholder="Email" value={invoice.company.email} onChange={e => handlePartyChange('company', e)} />
                 <div className="md:col-span-2"><Input name="website" placeholder="Website" value={invoice.company.website} onChange={e => handlePartyChange('company', e)} /></div>
            </Section>

            <Section title="Customer Information">
                <div className="md:col-span-2"><Input name="name" placeholder="Customer Name" value={invoice.customer.name} onChange={e => handlePartyChange('customer', e)} /></div>
                <div className="md:col-span-2"><Input name="address" placeholder="Address" value={invoice.customer.address} onChange={e => handlePartyChange('customer', e)} /></div>
                <Input name="phone" placeholder="Phone" value={invoice.customer.phone} onChange={e => handlePartyChange('customer', e)} />
                <Input name="email" placeholder="Email" value={invoice.customer.email} onChange={e => handlePartyChange('customer', e)} />
            </Section>

            <Section title="Invoice Metadata">
                <Input name="invoiceNumber" placeholder="Invoice Number" value={invoice.invoiceNumber} onChange={handleInvoiceChange} />
                <Input name="invoiceDate" type="date" placeholder="Invoice Date" value={invoice.invoiceDate} onChange={handleInvoiceChange} />
                <Input name="dueDate" type="date" placeholder="Due Date" value={invoice.dueDate} onChange={handleInvoiceChange} />
                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <Input id="taxRate" name="taxRate" type="number" placeholder="Tax Rate" value={invoice.taxRate} onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))} />
                </div>
            </Section>
            
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">Rental Items</h3>
                <div className="space-y-4">
                    {invoice.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-12 md:col-span-5">
                                <Input name="description" placeholder={index === 0 ? "e.g., Toyota Camry Rental" : "e.g., GPS Navigation"} value={item.description} onChange={e => handleItemChange(item.id, e)} />
                            </div>
                            <div className="col-span-4 md:col-span-2">
                                <Input name="quantity" type="number" placeholder="Days" value={item.quantity} onChange={e => handleItemChange(item.id, e)} />
                            </div>
                            <div className="col-span-4 md:col-span-2">
                                <Input name="rate" type="number" placeholder="Rate" value={item.rate} onChange={e => handleItemChange(item.id, e)} />
                            </div>
                            <div className="col-span-3 md:col-span-2 text-right font-medium text-gray-700 pr-2">
                                ₦{(item.quantity * item.rate).toFixed(2)}
                            </div>
                            <div className="col-span-1 flex justify-end">
                                {invoice.items.length > 1 && (
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addItem} className="mt-4 flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Add Charge
                </button>
            </div>
            
             <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">Notes / Terms</h3>
                <textarea
                    name="notes"
                    value={invoice.notes}
                    onChange={handleInvoiceChange}
                    rows={4}
                    className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    placeholder="e.g., Payment is due within 15 days. Late payments are subject to a fee."
                />
            </div>
        </div>
    );
};

export default InvoiceForm;