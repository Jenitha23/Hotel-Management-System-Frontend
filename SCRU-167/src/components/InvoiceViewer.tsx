import { useEffect, useState } from "react";
import { getInvoice, downloadInvoicePdf, InvoiceDTO } from "../api/invoices";

export default function InvoiceViewer({ bookingId }: { bookingId: number }) {
    const [invoice, setInvoice] = useState<InvoiceDTO | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setInvoice(await getInvoice(bookingId));
            } catch (e: any) {
                setErr(e.message);
            }
        })();
    }, [bookingId]);

    if (err) return <div className="text-red-600">{err}</div>;
    if (!invoice) return <div className="opacity-60">Loading invoice…</div>;

    return (
        <div className="border p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Invoice #{invoice.bookingId}</h3>
                <button
                    className="bg-black text-white px-3 py-2 rounded"
                    onClick={() => downloadInvoicePdf(invoice.bookingId)}
                >
                    Download PDF
                </button>
            </div>

            <div className="text-sm opacity-80">
                Guest: <b>{invoice.guestName}</b> &nbsp;|&nbsp;
                Room: <b>{invoice.roomNumber}</b> &nbsp;|&nbsp;
                Stay: {invoice.checkIn} → {invoice.checkOut} ({invoice.nights} nights)
            </div>

            <table className="w-full text-sm border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Unit</th>
                    <th className="p-2 border">Total</th>
                </tr>
                </thead>
                <tbody>
                {invoice.lines.map((l, i) => (
                    <tr key={i}>
                        <td className="p-2 border">{l.category}</td>
                        <td className="p-2 border">{l.description}</td>
                        <td className="p-2 border text-center">{l.quantity}</td>
                        <td className="p-2 border text-right">{l.unitPrice.toFixed?.(2) ?? l.unitPrice}</td>
                        <td className="p-2 border text-right">{l.lineTotal.toFixed?.(2) ?? l.lineTotal}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="text-right space-y-1">
                <div>Subtotal: <b>{invoice.subTotal}</b></div>
                <div>Tax: <b>{invoice.tax}</b></div>
                <div>Service: <b>{invoice.serviceCharge}</b></div>
                <div className="text-lg">Grand Total: <b>{invoice.grandTotal}</b></div>
            </div>
        </div>
    );
}
