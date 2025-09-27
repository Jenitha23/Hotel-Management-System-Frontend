export default function ConfirmDialog({ open, title="Are you sure?", body, confirmText="Delete", onCancel, onConfirm }) {
    if(!open) return null;
    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div className="modal" onClick={(e)=>e.stopPropagation()}>
                <h2>{title}</h2>
                {body && <p style={{marginTop:8,color:"var(--muted)"}}>{body}</p>}
                <div className="footer">
                    <button className="btn" onClick={onCancel}>Cancel</button>
                    <button className="btn danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}
