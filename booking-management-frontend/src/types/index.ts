export interface Room {
    id: number;
    roomNumber: string;
    type: string;
    price: number;
    available: boolean;
    image?: string;
    description?: string;
    features?: string[];
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface BookingRequest {
    customerId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
}

export interface BookingResponse {
    id: number;
    customerId: number;
    customerName: string;
    roomId: number;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    status: string;
    totalPrice: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}