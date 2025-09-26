const NEXT = ["PENDING","CONFIRMED","CANCELLED","COMPLETED"];

export default function StatusDropdown({ value, onChange }) {
    return (
        <select className="select" style={{width:160}} value={value} onChange={(e)=>onChange?.(e.target.value)}>
            {NEXT.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
    );
}
