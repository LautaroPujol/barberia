export function ButtonGold({ children, disabled, onClick }) {
  return (
    <button className="btn-gold" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function ButtonOutline({ children, onClick, style = {} }) {
  return (
    <button className="btn-outline" style={style} onClick={onClick}>
      {children}
    </button>
  );
}