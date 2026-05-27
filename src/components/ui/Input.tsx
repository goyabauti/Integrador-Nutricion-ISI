import * as React from "react"
import { cn } from "@/server/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string
  error?: string
  multiline?: boolean
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, multiline, ...props }, ref) => {
    const Component = multiline ? "textarea" : "input"
    
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "100%" }}>
        <label style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--coco-dark)" }}>
          {label}
        </label>
        <Component
          ref={ref as any}
          className={cn(className)}
          style={{
            padding: "0.75rem 1rem",
            border: `1.5px solid ${error ? "var(--coco-danger)" : "var(--border)"}`,
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            background: "var(--coco-beige)",
            color: "var(--coco-dark)",
            fontFamily: "inherit",
            resize: multiline ? "vertical" : "none",
            minHeight: multiline ? "100px" : "auto",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? "var(--coco-danger)" : "var(--primary)";
            e.target.style.background = "var(--coco-white)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "var(--coco-danger)" : "var(--border)";
            e.target.style.background = "var(--coco-beige)";
          }}
          {...props}
        />
        {error && (
          <span style={{ color: "var(--coco-danger)", fontSize: "0.75rem", fontWeight: 500 }}>
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
