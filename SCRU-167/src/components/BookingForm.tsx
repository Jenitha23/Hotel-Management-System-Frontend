import { useState } from "react";
import { createBooking, type BookingCreate } from "../api/booking";

export default function BookingForm({
                                        onCreated,
                                    }: { onCreated?: (id: number) => void }) {
    const [form, setForm] = useState<BookingCreate>({
        customerId: 1,
        roomId: 1,
        checkIn: "",
        checkOut: "",
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); setMsg(null); setErr(null);
        try {
            const res = await createBooking(form);
            setMsg(`Booking created #${res.id}`);
            onCreated?.(res.id);
        } catch (error: unknown) {
            const message =
                typeof error === "object" && error && "message" in error
                    ? String((error as { message?: unknown }).message)
                    : "Request failed";
            setErr(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-2 border p-4 rounded-xl">
            <h3 className="font-semibold">Create Booking</h3>
            <div className="grid grid-cols-2 gap-2">
                <input
                    className="border p-2 rounded"
                    type="number"
                    placeholder="Customer ID"
                    value={form.customerId}
                    onChange={(e) =>
                        setForm((f: BookingCreate) => ({ ...f, customerId: Number(e.target.value) }))
                    }
                />
                <input
                    className="border p-2 rounded"
                    type="number"
                    placeholder="Room ID"
                    value={form.roomId}
                    onChange={(e) =>
                        setForm((f: BookingCreate) => ({ ...f, roomId: Number(e.target.value) }))
                    }
                />
                <input
                    className="border p-2 rounded"
                    type="date"
                    value={form.checkIn}
                    onChange={(e) =>
                        setForm((f: BookingCreate) => ({ ...f, checkIn: e.target.value }))
                    }
                />
                <input
                    className="border p-2 rounded"
                    type="date"
                    value={form.checkOut}
                    onChange={(e) =>
                        setForm((f: BookingCreate) => ({ ...f, checkOut: e.target.value }))
                    }
                />
            </div>
            <button disabled={loading} className="bg-black text-white px-3 py-2 rounded">
                {loading ? "Creating…" : "Create"}
            </button>
            {msg && <div className="text-green-700">{msg}</div>}
            {err && <div className="text-red-600">{err}</div>}
        </form>
    );
}
