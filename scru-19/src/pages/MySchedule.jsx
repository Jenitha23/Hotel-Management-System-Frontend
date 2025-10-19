import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../api";

export default function MySchedule() {
    const [items, setItems] = useState([]);
    const [from, setFrom] = useState(dayjs().startOf("day").toISOString());
    const [to, setTo] = useState(dayjs().add(7, "day").endOf("day").toISOString());
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/api/schedules/me", { params: { from, to } });
            setItems(data);
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

    const groups = items.reduce((acc, it) => {
        const key = dayjs(it.startAt).format("YYYY-MM-DD");
        (acc[key] ||= []).push(it);
        return acc;
    }, {});

    return (
        <div style={{ padding: 20 }}>
            <h1>My Schedule</h1>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input type="datetime-local"
                       value={dayjs(from).format("YYYY-MM-DDTHH:mm")}
                       onChange={e => setFrom(dayjs(e.target.value).toISOString())}/>
                <input type="datetime-local"
                       value={dayjs(to).format("YYYY-MM-DDTHH:mm")}
                       onChange={e => setTo(dayjs(e.target.value).toISOString())}/>
                <button onClick={load} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
            </div>

            {Object.keys(groups).length === 0 && <p>No events in this range.</p>}

            {Object.entries(groups).sort(([a],[b])=>a.localeCompare(b)).map(([date, list]) => (
                <div key={date} style={{ marginBottom: 16 }}>
                    <h3>{dayjs(date).format("ddd, MMM D")}</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {list.map(ev => (
                            <li key={ev.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                                <div style={{ fontWeight: 600 }}>{ev.title}</div>
                                <div>
                                    {dayjs(ev.startAt).format("h:mm A")} – {dayjs(ev.endAt).format("h:mm A")}
                                    {ev.location ? ` · ${ev.location}` : ""}
                                    {ev.status ? ` · ${ev.status}` : ""}
                                </div>
                                {ev.notes && <div style={{ opacity: 0.8 }}>{ev.notes}</div>}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}