import { useEffect, useMemo, useState } from "react";
import { Download, MapPin, Phone, Mail, Calendar, User, Clock, CheckCircle } from "lucide-react";
import { getInvoice, downloadInvoicePdf, type InvoiceDTO } from "./api/invoices";

// Helpers
const fmt = (n: number | string) =>
    typeof n === "number" ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n;

type FoodRow = {
  id: string;
  item: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  status: "pending" | "completed";
};

export default function App() {
  // Choose which booking to load
  const [bookingId, setBookingId] = useState<number>(1);

  // Loaded from backend
  const [inv, setInv] = useState<InvoiceDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Fetch invoice whenever bookingId changes
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getInvoice(bookingId);
        setInv(data);
      }  catch (error: unknown) {
          const message =
              typeof error === "object" && error && "message" in error
                  ? String((error as { message?: unknown }).message)
                  : "Failed to load invoice";
          setErr(message);
          setInv(null);


  } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  // Map backend invoice lines → your UI sections
  const roomCharges = useMemo(() => {
    if (!inv) return [];
    // The backend sends one "Room" line (nights * dailyRate)
    return inv.lines
        .filter((l) => l.category.toLowerCase() === "room")
        .map((l, i) => ({
          id: `room-${i}`,
          description: l.description,
          nights: l.quantity,
          rate: Number(l.unitPrice),
          total: Number(l.lineTotal),
        }));
  }, [inv]);

  const foodCharges: FoodRow[] = useMemo(() => {
    if (!inv) return [];
    // The backend uses category "FOOD" and "ROOM SERVICE"
    // We’ll display both together as “Food & Beverage Charges”
    return inv.lines
        .filter((l) => l.category.toLowerCase() !== "room")
        .map((l, i) => ({
          id: `food-${i}`,
          item: `${l.category}: ${l.description}`,
          quantity: l.quantity,
          price: Number(l.unitPrice),
          total: Number(l.lineTotal),
          // We don't have per-item dates/status from backend; show placeholders or derive later
          date: inv.checkIn, // or "" if you prefer blank
          status: "completed" as const,
        }));
  }, [inv]);

  // Totals (prefer backend numbers to avoid rounding drift)
  const roomTotal = useMemo(
      () => roomCharges.reduce((sum, c) => sum + c.total, 0),
      [roomCharges]
  );
  const foodTotal = useMemo(
      () => foodCharges.reduce((sum, c) => sum + c.total, 0),
      [foodCharges]
  );

  // From backend
  const subtotal = inv ? Number(inv.subTotal) : 0;
  const taxAmount = inv ? Number(inv.tax) : 0;
  const grandTotal = inv ? Number(inv.grandTotal) : 0;

  // Download real PDF
  const handleDownload = async () => {
    if (!inv) return;
    await downloadInvoicePdf(inv.bookingId);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5E9DA] via-[#F5E9DA] to-[#1CA1A6]/10">
        {/* Top bar (+ booking selector) */}
        <div className="bg-gradient-to-r from-[#1CA1A6] to-[#1CA1A6]/90 text-white py-8 print:hidden">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold mb-2">Palm Beach Resort</h1>
                <p className="text-[#F5E9DA] flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Paradise Island, Tropical Bay
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                    className="px-3 py-2 rounded-md text-[#0B2545]"
                    type="number"
                    min={1}
                    value={bookingId}
                    onChange={(e) => setBookingId(Number(e.target.value))}
                    placeholder="Booking ID"
                    title="Booking ID"
                />
                <button
                    onClick={handleDownload}
                    disabled={!inv}
                    className="bg-[#FF7F6B] disabled:opacity-60 hover:bg-[#FF7F6B]/90 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading / error states */}
        <div className="max-w-4xl mx-auto px-6 pt-6">
          {loading && <div className="text-[#0B2545] opacity-70">Loading invoice…</div>}
          {err && <div className="text-red-600">{err}</div>}
        </div>

        {/* Invoice */}
        {inv && (
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
                        <p className="text-sm">Booking #</p>
                        <p className="font-bold text-lg">{inv.bookingId}</p>
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
                        <p><span className="font-semibold">Name:</span> {inv.guestName}</p>
                        {/* If you store email/phone later, render them here */}
                        <p><span className="font-semibold">Room:</span> {inv.roomNumber}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[#0B2545] font-bold text-lg mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#1CA1A6]" />
                        Stay Details
                      </h3>
                      <div className="space-y-2 text-[#0B2545]">
                        <p><span className="font-semibold">Check-in:</span> {new Date(inv.checkIn).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Check-out:</span> {new Date(inv.checkOut).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Duration:</span> {inv.nights} nights</p>
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
                            <td className="py-3 px-4 text-right text-[#0B2545]">${fmt(charge.rate)}</td>
                            <td className="py-3 px-4 text-right font-semibold text-[#0B2545]">${fmt(charge.total)}</td>
                          </tr>
                      ))}
                      </tbody>
                      <tfoot>
                      <tr className="bg-[#1CA1A6] text-white">
                        <td colSpan={3} className="py-3 px-4 font-bold text-right">Room Total:</td>
                        <td className="py-3 px-4 font-bold text-right">${fmt(roomTotal)}</td>
                      </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Food & Room-Service Charges */}
                <div className="p-8 bg-[#F5E9DA]/20">
                  <h3 className="text-[#0B2545] font-bold text-xl mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#FF7F6B] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">2</span>
                    </div>
                    Food & Room Service
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
                            <td className="py-3 px-4 text-[#0B2545]">
                              {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                            </td>
                            <td className="py-3 px-4 text-[#0B2545]">{item.item}</td>
                            <td className="py-3 px-4 text-center text-[#0B2545]">{item.quantity}</td>
                            <td className="py-3 px-4 text-right text-[#0B2545]">${fmt(item.price)}</td>
                            <td className="py-3 px-4 text-right font-semibold text-[#0B2545]">${fmt(item.total)}</td>
                            <td className="py-3 px-4 text-center">
                              {item.status === "completed" ? (
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
                        <td colSpan={5} className="py-3 px-4 font-bold text-right">Food & Service Total:</td>
                        <td className="py-3 px-4 font-bold text-right">${fmt(foodTotal)}</td>
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
                        <span className="font-semibold text-xl">${fmt(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#F5E9DA]">Tax (12.5%):</span>
                        <span className="font-semibold text-xl">${fmt(taxAmount)}</span>
                      </div>
                      <div className="border-t border-[#F5E9DA]/30 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[#FF7F6B] text-xl font-bold">Grand Total:</span>
                          <span className="text-3xl font-bold text-[#FF7F6B]">${fmt(grandTotal)}</span>
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
        )}
      </div>
  );
}
