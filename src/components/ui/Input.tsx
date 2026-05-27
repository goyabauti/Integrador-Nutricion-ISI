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
      <div className="form-group" style={{ width: "100%" }}>
        <label className="form-label">
          {label}
        </label>
        <Component
          ref={ref as any}
          className={cn(
            "form-input",
            multiline && "form-textarea",
            error && "form-input-error",
            className
          )}
          {...props}
        />
        {error && (
          <span className="form-error-msg">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
