import * as React from "react"
import { cn } from "@/server/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        style={{
          backgroundColor: variant === "default" ? "var(--primary)" : undefined,
          color: variant === "default" ? "white" : undefined,
          border: variant === "outline" ? "1px solid var(--border)" : "none",
          padding: size === "default" ? "0.75rem 1rem" : "1rem 2rem",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: (loading || props.disabled) ? "not-allowed" : "pointer",
          width: "100%",
          opacity: (loading || props.disabled) ? 0.7 : 1,
          transition: "background-color 0.2s, transform 0.1s",
        }}
        {...props}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg className="animate-spin" viewBox="0 0 24 24" style={{ width: "1.25rem", height: "1.25rem", animation: "spin 1s linear infinite" }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
