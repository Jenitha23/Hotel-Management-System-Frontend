import React, { useState } from 'react';
import { Download, MapPin, Phone, Mail, Calendar, User, Clock, CheckCircle } from 'lucide-react';

interface RoomCharge {
  id: string;
  description: string;
  nights: number;
  rate: number;
  total: number;
}

interface FoodItem {
  id: string;
  item: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: 'pending' | 'completed';
}

function App() {
  const [customerInfo] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    checkIn: "2025-01-15",
    checkOut: "2025-01-20",
    roomNumber: "Ocean View Suite 247",
    confirmationNumber: "PBR-2025-001547"
  });

  const [roomCharges] = useState<RoomCharge[]>([
    {
      id: "room1",
      description: "Ocean View Suite - Premium",
      nights: 5,
      rate: 485.00,
      total: 2425.00
    },
    {
      id: "resort-fee",
      description: "Resort Fee (per night)",
      nights: 5,
      rate: 45.00,
      total: 225.00
    }
  ]);

  const [foodCharges] = useState<FoodItem[]>([
    {
      id: "food1",
      item: "Beachside Dinner for Two",
      quantity: 1,
      price: 128.50,
      total: 128.50,
      date: "2025-01-15",
      status: "completed"
    },
    {
      id: "food2",
      item: "Tropical Breakfast Buffet",
      quantity: 2,
      price: 32.00,
      total: 64.00,
      date: "2025-01-16",
      status: "completed"
    },
    {
      id: "food3",
      item: "Poolside Lunch & Cocktails",
      quantity: 1,
      price: 75.25,
      total: 75.25,
      date: "2025-01-17",
      status: "completed"
    },
    {
      id: "food4",
      item: "Sunset Dinner Special",
      quantity: 1,
      price: 165.00,
      total: 165.00,
      date: "2025-01-18",
      status: "pending"
    },
    {
      id: "food5",
      item: "Beach Bar & Appetizers",
      quantity: 1,
      price: 42.75,
      total: 42.75,
      date: "2025-01-19",
      status: "pending"
    }
  ]);

  const roomTotal = roomCharges.reduce((sum, charge) => sum + charge.total, 0);
  const foodTotal = foodCharges.reduce((sum, item) => sum + item.total, 0);
  const subtotal = roomTotal + foodTotal;
  const taxRate = 0.125; // 12.5% tax
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  const handleDownload = () => {
    window.print();
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E9DA] via-[#F5E9DA] to-[#1CA1A6]/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1CA1A6] to-[#1CA1A6]/90 text-white py-8 print:hidden">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Palm Beach Resort</h1>
                <p className="text-[#F5E9DA] flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Paradise Island, Tropical Bay
                </p>
              </div>
              <button
                  onClick={handleDownload}
                  className="bg-[#FF7F6B] hover:bg-[#FF7F6B]/90 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="max-w-4xl mx-auto px-6 py-8 print:py-4 print:px-0">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-[#0B2545] to-[#0B2545]/90 text-white p-8 print:bg-[#0B2545]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold text-[#F5E9DA] mb-2">INVOICE</h2>
                  <div className="space-y-1 text-[#F5E9DA]/90">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      +1 (800) PALM-BEACH
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      reservations@palmbeachresort.com
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-[#FF7F6B] text-white px-4 py-2 rounded-lg mb-4 inline-block">
                    <p className="text-sm">Confirmation #</p>
                    <p className="font-bold text-lg">{customerInfo.confirmationNumber}</p>
                  </div>
                  <p className="text-[#F5E9DA]/90">Invoice Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="p-8 border-b border-[#F5E9DA]">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[#0B2545] font-bold text-lg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1CA1A6]" />
                    Guest Information
                  </h3>
                  <div className="space-y-2 text-[#0B2545]">
                    <p><span className="font-semibold">Name:</span> {customerInfo.name}</p>
                    <p><span className="font-semibold">Email:</span> {customerInfo.email}</p>
                    <p><span className="font-semibold">Phone:</span> {customerInfo.phone}</p>
                    <p><span className="font-semibold">Room:</span> {customerInfo.roomNumber}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-[#0B2545] font-bold text-lg mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#1CA1A6]" />
                    Stay Details
                  </h3>
                  <div className="space-y-2 text-[#0B2545]">
                    <p><span className="font-semibold">Check-in:</span> {new Date(customerInfo.checkIn).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Check-out:</span> {new Date(customerInfo.checkOut).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Duration:</span> 5 nights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Charges */}
            <div className="p-8">
              <h3 className="text-[#0B2545] font-bold text-xl mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1CA1A6] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">1</span>
                </div>
                Accommodation Charges
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="bg-[#F5E9DA] text-[#0B2545]">
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                    <th className="text-center py-3 px-4 font-semibold">Nights</th>
                    <th className="text-right py-3 px-4 font-semibold">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold">Total</th>
                  </tr>
                  </thead>
                  <tbody>
                  {roomCharges.map((charge, index) => (
                      <tr key={charge.id} className={index % 2 === 0 ? "bg-white" : "bg-[#F5E9DA]/30"}>
                        <td className="py-3 px-4 text-[#0B2545]">{charge.description}</td>
                        <td className="py-3 px-4 text-center text-[#0B2545]">{charge.nights}</td>
                        <td className="py-3 px-4 text-right text-[#0B2545]">${charge.rate.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-[#0B2545]">${charge.total.toFixed(2)}</td>
                      </tr>
                  ))}
                  </tbody>
                  <tfoot>
                  <tr className="bg-[#1CA1A6] text-white">
                    <td colSpan={3} className="py-3 px-4 font-bold text-right">Room Total:</td>
                    <td className="py-3 px-4 font-bold text-right">${roomTotal.toFixed(2)}</td>
                  </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Food & Beverage Charges */}
            <div className="p-8 bg-[#F5E9DA]/20">
              <h3 className="text-[#0B2545] font-bold text-xl mb-6 flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FF7F6B] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">2</span>
                </div>
                Food & Beverage Charges
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="bg-[#0B2545] text-white">
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Item</th>
                    <th className="text-center py-3 px-4 font-semibold">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold">Price</th>
                    <th className="text-right py-3 px-4 font-semibold">Total</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {foodCharges.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-[#F5E9DA]/30"}>
                        <td className="py-3 px-4 text-[#0B2545]">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-[#0B2545]">{item.item}</td>
                        <td className="py-3 px-4 text-center text-[#0B2545]">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-[#0B2545]">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-[#0B2545]">${item.total.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          {item.status === 'completed' ? (
                              <div className="flex items-center justify-center gap-1 text-[#1CA1A6]">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Done</span>
                              </div>
                          ) : (
                              <div className="flex items-center justify-center gap-1 text-[#FF7F6B]">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">Pending</span>
                              </div>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                  <tfoot>
                  <tr className="bg-[#FF7F6B] text-white">
                    <td colSpan={5} className="py-3 px-4 font-bold text-right">Food & Beverage Total:</td>
                    <td className="py-3 px-4 font-bold text-right">${foodTotal.toFixed(2)}</td>
                  </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="p-8 bg-gradient-to-r from-[#0B2545] to-[#0B2545]/90 text-white">
              <div className="max-w-md ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#F5E9DA]">Subtotal:</span>
                    <span className="font-semibold text-xl">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F5E9DA]">Tax (12.5%):</span>
                    <span className="font-semibold text-xl">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#F5E9DA]/30 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#FF7F6B] text-xl font-bold">Grand Total:</span>
                      <span className="text-3xl font-bold text-[#FF7F6B]">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-[#F5E9DA] text-center text-[#0B2545] print:bg-white">
              <p className="text-sm mb-2">Thank you for choosing Palm Beach Resort!</p>
              <p className="text-xs text-[#0B2545]/70">
                We hope you enjoyed your tropical getaway. Please visit us again soon!
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
