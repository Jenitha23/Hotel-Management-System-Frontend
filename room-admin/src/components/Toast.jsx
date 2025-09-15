
export default function Toast({ text, type="success" }) {
    if (!text) return null;
    return <div className={`toast ${type}`}>{text}</div>;
}
