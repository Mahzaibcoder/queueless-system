export default function Link({ href, children, className = "", style }) {
  return (
    <a href={href} className={className} style={style} onClick={(e) => {
      // Simple client-side navigation
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("navigate", { detail: { href } }));
    }}>
      {children}
    </a>
  );
}
