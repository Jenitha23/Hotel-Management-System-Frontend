// src/api/orders.ts
import { http } from "./http";

export type OrderItemCreate = {
    bookingId: number;
    type: "FOOD" | "ROOM_SERVICE";
    description: string;
    quantity: number;
    unitPrice: number;
};

export async function addOrderItem(payload: OrderItemCreate): Promise<void> {
    await http<unknown>("/api/orders", { method: "POST", json: payload });
}
