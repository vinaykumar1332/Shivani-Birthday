import { useMagneticButton } from "../../hooks/useMagneticButton";
import "./Button.css";

export function Button({ children, variant = "primary", onClick, type = "button", magnetic = true, ...rest }) {
  const magRef = useMagneticButton(0.3);
  return (
    <button
      ref={magnetic ? magRef : undefined}
      type={type}
      className={`btn btn--${variant}`}
      onClick={onClick}
      {...rest}
    >
      <span className="btn__label">{children}</span>
    </button>
  );
}
