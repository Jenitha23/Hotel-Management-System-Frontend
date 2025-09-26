import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";
import FiltersBar from "../components/FiltersBar.jsx";
import BookingsTable from "../components/BookingsTable.jsx";
import BookingDetailsModal from "../components/BookingDetailsModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function BookingsPage(){
    const [filters,setFilters] = useState({ status:"ALL", roomType:"ALL", date:"" });
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [bookings,setBookings] = useState([]);
    const [editBooking,setEditBooking] = useState(null);
    const [deleteBooking,setDeleteBooking] = useState(null);

    async function load(){
        try{
            setLoading(true); setError("");
            const data = await api.listBookings(filters);
            setBookings(Array.isArray(data) ? normalize(data) : []);
        }catch(e){ setError(e.message || "Failed to load"); }
        finally{ setLoading(false); }
    }

    useEffect(()=>{ load(); }, [filters.status, filters.roomType, filters.date]);

    // SCRU-178 — inline status update with optimistic UI
    async function handleStatus(id, status){
        setBookings(prev => prev.map(b => b.bookingId===id ? {...b,status} : b));
        try{
            const updated = await api.updateStatus(id, status); // expects updated booking
            if (updated?.bookingId) {
                setBookings(prev => prev.map(b => b.bookingId===id ? normalizeOne(updated) : b));
            } else {
                // fallback: keep optimistic state
            }
        }catch(e){
            // revert
            await load();
            alert("Failed to update status: " + e.message);
        }
    }

    // SCRU-179 — edit details
    async function saveBooking(id, form){
        try{
            const updated = await api.updateBooking(id, {
                roomType: form.roomType,
                checkInDate: form.checkInDate,
                checkOutDate: form.checkOutDate,
                specialRequest: form.specialRequest
            });
            setBookings(prev => prev.map(b => b.bookingId===id ? normalizeOne(updated) : b));
            setEditBooking(null);
        }catch(e){ alert("Failed to save: " + e.message); }
    }

    // SCRU-180 — delete
    async function confirmDelete(){
        try{
            await api.deleteBooking(deleteBooking.bookingId);
            setBookings(prev => prev.filter(b => b.bookingId !== deleteBooking.bookingId));
            setDeleteBooking(null);
        }catch(e){ alert("Delete failed: " + e.message); }
    }

    return (
        <>
            <div className="h1">Bookings</div>
            <FiltersBar initial={filters} onChange={setFilters} />
            {error && <div className="card" style={{borderLeft:"4px solid #ef4444",color:"#991b1b"}}>{error}</div>}
            {loading ? (
                <div className="card">Loading…</div>
            ) : (
                <BookingsTable
                    items={bookings}
                    onEdit={setEditBooking}
                    onDelete={setDeleteBooking}
                    onChangeStatus={handleStatus}
                />
            )}

            <BookingDetailsModal
                open={!!editBooking}
                booking={editBooking}
                onClose={()=>setEditBooking(null)}
                onSave={saveBooking}
            />

            <ConfirmDialog
                open={!!deleteBooking}
                title={`Delete booking #${deleteBooking?.bookingId}?`}
                body="This action cannot be undone."
                confirmText="Delete"
                onCancel={()=>setDeleteBooking(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
}

function normalize(list){ return list.map(normalizeOne); }
function normalizeOne(b){
    return {
        bookingId: b.booking_id ?? b.bookingId,
        customerId: b.customer_id ?? b.customerId,
        customerName: b.customerName, // optional—map on backend if you have JOIN
        roomId: b.room_id ?? b.roomId,
        roomType: b.roomType,
        bookingDate: b.booking_date ?? b.bookingDate,
        checkInDate: b.check_in_date ?? b.checkInDate,
        checkOutDate: b.check_out_date ?? b.checkOutDate,
        status: b.status,
        specialRequest: b.special_request ?? b.specialRequest
    };
}
