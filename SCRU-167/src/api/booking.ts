import { http } from "./http";

export type BookingCreate = {
    customerId: number;
    roomId: number;
    checkIn: string;   // "YYYY-MM-DD"
    checkOut: string;  // "YYYY-MM-DD"
};

export type Booking = {
    id: number;
    customer: any;
    room: any;
    checkIn: string;
    checkOut: string;
    checkedOut: boolean;
};

export async function createBooking(payload: BookingCreate) {
    return await http<Booking>("/api/bookings", { method: "POST", json: payload });
}

export async function getBooking(id: number) {
    return await http<Booking>(`/api/bookings/${id}`, { method: "GET" });
}
