import { v4 as uuid } from "uuid";

const LS_KEY = "room_admin_data_v1";

function read() {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
        const seed = {
            rooms: [
                { id: uuid(), type: "Standard", available: true,  description: "Basic room with fan." },
                { id: uuid(), type: "Deluxe",   available: false, description: "A/C, balcony, sea view." }
            ]
        };
        localStorage.setItem(LS_KEY, JSON.stringify(seed));
        return seed;
    }
    return JSON.parse(raw);
}
function write(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)); }

export function listRooms() {
    const { rooms } = read();
    return rooms;
}

export function createRoom({ type, available, description }) {
    const data = read();
    const room = { id: uuid(), type, available: !!available, description: description?.trim() || "" };
    data.rooms.push(room);
    write(data);
    return room;
}

export function updateRoom(id, patch) {
    const data = read();
    const i = data.rooms.findIndex(r => r.id === id);
    if (i === -1) return null;
    data.rooms[i] = { ...data.rooms[i], ...patch };
    write(data);
    return data.rooms[i];
}

export function deleteRoom(id) {
    const data = read();
    const i = data.rooms.findIndex(r => r.id === id);
    if (i === -1) return false;
    data.rooms.splice(i, 1);
    write(data);
    return true;
}
