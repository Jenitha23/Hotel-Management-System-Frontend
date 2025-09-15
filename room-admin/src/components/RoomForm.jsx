import { useEffect, useState } from "react";

export default function RoomForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({ type: "Standard", available: true, description: "" });

    useEffect(() => { if (initial) setForm(initial); }, [initial]);

    function handle(e){
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    }

    function save(e){
        e.preventDefault();
        if (!form.type.trim()) return alert("Room type is required");
        onSubmit({
            type: form.type.trim(),
            available: !!form.available,
            description: (form.description || "").trim()
        });
    }

    return (
        <form onSubmit={save}>
            <div className="row">
                <div className="col">
                    <label>Room Type</label>
                    <select className="select" name="type" value={form.type} onChange={handle}>
                        <option>Standard</option><option>Deluxe</option><option>Suite</option><option>Family</option>
                    </select>
                </div>

                <div className="col" style={{display:"flex", alignItems:"center", gap:10}}>
                    <div>
                        <label style={{display:"block"}}>Availability</label>
                        <label className="switch" title="Toggle availability">
                            <input type="checkbox" name="available" checked={form.available} onChange={handle}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <span className={`badge ${form.available ? "green" : "red"}`}>
            {form.available ? "Available" : "Unavailable"}
          </span>
                </div>
            </div>

            <div style={{marginTop:12}}>
                <label>Description</label>
                <textarea className="textarea" name="description" rows={3}
                          placeholder="A/C, balcony, sea view…" value={form.description} onChange={handle} />
            </div>

            <div className="form-foot">
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                <button className="btn">Save</button>
            </div>
        </form>
    );
}
