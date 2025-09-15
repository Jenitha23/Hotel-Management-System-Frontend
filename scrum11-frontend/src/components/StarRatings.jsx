// src/components/StarRating.jsx
export default function StarRating({ value = 0 }) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <span className="stars" title={`${value.toFixed(1)} / 5`}>
      {"★".repeat(full)}{half ? "☆" : ""}{"☆".repeat(empty)}
    </span>
    );
}
