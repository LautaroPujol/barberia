export function CardSelect({ children, active, onClick }) {
  return (
    <div className={`card-select ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </div>
  );
}
 