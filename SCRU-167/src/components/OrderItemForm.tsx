import { useState } from "react";
import { addOrderItem } from "../api/orders";

export default function OrderItemForm() {
    const [form, setForm] = useState({
        bookingId: 1,
        type: "FOOD" as "FOOD"|"ROOM_SERVICE",
        description: "",
        quantity: 1,
        unitPrice: 0
    });
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setMsg(null); setErr(null);
        try {
            await addOrderItem({
                bookingId: Number(form.bookingId),
                type: form.type,
                description: form.description,
                quantity: Number(form.quantity),
                unitPrice: Number(form.unitPrice),
            });
            setMsg("Order item added.");
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-2 border p-4 rounded-xl">
            <h3 className="font-semibold">Add Order Item</h3>
            <div className="grid grid-cols-2 gap-2">
                <input className="border p-2 rounded"
                       type="number" placeholder="Booking ID" value={form.bookingId}
                       onChange={e=>setForm(f=>({...f, bookingId:Number(e.target.value)}))}
                />
                <select className="border p-2 rounded"
                        value={form.type}
                        onChange={e=>setForm(f=>({...f, type: e.target.value as any}))}
                >
                    <option value="FOOD">FOOD</option>
                    <option value="ROOM_SERVICE">ROOM_SERVICE</option>
                </select>
                <input className="border p-2 rounded"
                       placeholder="Description" value={form.description}
                       onChange={e=>setForm(f=>({...f, description:e.target.value}))}
                />
                <input className="border p-2 rounded"
                       type="number" placeholder="Quantity" value={form.quantity}
                       onChange={e=>setForm(f=>({...f, quantity:Number(e.target.value)}))}
                />
                <input className="border p-2 rounded"
                       type="number" step="0.01" placeholder="Unit Price" value={form.unitPrice}
                       onChange={e=>setForm(f=>({...f, unitPrice:Number(e.target.value)}))}
                />
            </div>
            <button disabled={loading} className="bg-black text-white px-3 py-2 rounded">
                {loading ? "Saving…" : "Add Item"}
            </button>
            {msg && <div className="text-green-700">{msg}</div>}
            {err && <div className="text-red-600">{err}</div>}
        </form>
    );
}
