// src/components/Card.jsx
export default function Card({ title, icon, children }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span>{icon}</span> {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}
