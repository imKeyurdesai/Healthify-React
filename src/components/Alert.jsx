import React, { useEffect, useMemo, useState } from "react";

function Alert({
  title = "Alert Title",
  message = "This is an alert message.",
  type = "info", // 'success', 'error', 'warning'
  timeout = 4000,
  closable = true,
  onClose,
  className = "",
  ...props
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [barScale, setBarScale] = useState(1);

  useEffect(() => {
    setIsVisible(true);
  }, [title, message, type]);

  useEffect(() => {
    if (!isVisible || !timeout || timeout <= 0) return;

    setBarScale(1);
    const raf = requestAnimationFrame(() => setBarScale(0));

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, timeout);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [isVisible, timeout, onClose]);

  const styles = useMemo(() => {
    if (type === "success") {
      return {
        container: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
        iconBg: "bg-emerald-500",
        progress: "bg-emerald-500",
      };
    }

    if (type === "error") {
      return {
        container: "border-rose-200 bg-rose-50/80 text-rose-900",
        iconBg: "bg-rose-500",
        progress: "bg-rose-500",
      };
    }

    if (type === "warning") {
      return {
        container: "border-amber-200 bg-amber-50/80 text-amber-900",
        iconBg: "bg-amber-500",
        progress: "bg-amber-500",
      };
    }

    return {
      container: "border-sky-200 bg-sky-50/80 text-sky-900",
      iconBg: "bg-sky-500",
      progress: "bg-sky-500",
    };
  }, [type]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div
      role="alert"
      className={`relative overflow-hidden rounded-xl border p-4 pr-10 shadow-sm backdrop-blur-sm transition-all duration-300 ${styles.container} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${styles.iconBg}`}
        />
        <div>
          <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
          <p className="mt-1 text-sm/5 opacity-90">{message}</p>
        </div>
      </div>

      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close alert"
          className="absolute right-2 top-2 rounded-md px-2 py-1 text-sm font-medium opacity-70 transition hover:opacity-100"
        >
          x
        </button>
      )}

      {timeout > 0 && (
        <span
          className={`absolute bottom-0 left-0 h-1 ${styles.progress}`}
          style={{
            width: "100%",
            transformOrigin: "left",
            transform: `scaleX(${barScale})`,
            transition: `transform ${timeout}ms linear`,
          }}
        />
      )}
    </div>
  );
}

export default Alert;
