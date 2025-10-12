import { http } from "./http";

export type InvoiceLine = {
    category: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
};

export type InvoiceDTO = {
    bookingId: number;
    guestName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    lines: InvoiceLine[];
    subTotal: number;
    tax: number;
    serviceCharge: number;
    grandTotal: number;
};

export async function getInvoice(bookingId: number) {
    return await http<InvoiceDTO>(`/api/invoices/${bookingId}`, { method: "GET" });
}

export async function downloadInvoicePdf(bookingId: number) {
    const blob = await http<Blob>(`/api/invoices/${bookingId}/pdf`, {
        method: "GET",
        headers: { Accept: "application/pdf" }
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${bookingId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
