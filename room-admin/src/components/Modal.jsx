export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div className="modal-backdrop" onClick={(e)=>{ if (e.target.classList.contains("modal-backdrop")) onClose(); }}>
            <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
                <div className="modal-head">
                    <h3 style={{margin:0}}>{title}</h3>
                    <button className="btn btn-ghost" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
