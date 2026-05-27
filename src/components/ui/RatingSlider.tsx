"use client"

import * as React from "react"

export interface RatingSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  error?: string
}

const SCALE_LABELS: Record<number, { text: string }> = {
  1: { text: "No me gusta nada" },
  2: { text: "No me gusta" },
  3: { text: "Ni me gusta ni me disgusta" },
  4: { text: "Me gusta" },
  5: { text: "Me gusta mucho" },
}

export function RatingSlider({ label, value, onChange, error }: RatingSliderProps) {
  const current = value || 3; // Default visual to 3 if no value
  const isSelected = value > 0;
  
  const activeColor = "#5C3E35"; // Dark brown color from the image
  const inactiveColor = "#F4ECE1"; // Light beige track color

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "0.5rem", 
      width: "100%",
      background: "var(--coco-white)",
      padding: "1.75rem 2rem",
      borderRadius: "24px",
      border: error ? "1.5px solid var(--coco-danger)" : "1px solid var(--border)",
      boxShadow: "0 4px 20px rgba(62, 39, 35, 0.02)",
      transition: "all 0.2s ease"
    }}>
      {/* Header of the Slider Card */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ 
            fontFamily: "var(--font-serif)", 
            fontWeight: 700, 
            fontSize: "1.45rem", 
            color: "var(--coco-dark)" 
          }}>
            {label}
          </label>
          <span style={{ 
            fontSize: "1.05rem", 
            fontWeight: 400, 
            color: isSelected ? "var(--coco-dark)" : "var(--coco-brown)",
            opacity: isSelected ? 0.9 : 0.6,
            transition: "all 0.2s ease",
            minHeight: "1.5rem"
          }}>
            {isSelected ? SCALE_LABELS[current].text : "Desliza para calificar"}
          </span>
        </div>

        {/* Big visual score display on the right (e.g. 3/5) */}
        <div style={{ 
          fontFamily: "var(--font-serif)",
          display: "flex",
          alignItems: "baseline",
          userSelect: "none"
        }}>
          <span style={{ 
            fontSize: "1.85rem", 
            fontWeight: 800, 
            color: isSelected ? activeColor : "var(--coco-brown)",
            opacity: isSelected ? 1 : 0.5,
            transition: "all 0.2s ease"
          }}>
            {isSelected ? current : "-"}
          </span>
          <span style={{ 
            fontSize: "1.05rem", 
            fontWeight: 600, 
            color: "var(--coco-brown)",
            opacity: 0.5,
            marginLeft: "2px"
          }}>
            /5
          </span>
        </div>
      </div>

      {/* Slider Track Area */}
      <div style={{ position: "relative", padding: "1.25rem 0 0.75rem 0" }}>
        {/* Continuous Track Background */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "8px",
          background: inactiveColor,
          borderRadius: "4px",
          transform: "translateY(-50%)",
          zIndex: 1,
          pointerEvents: "none"
        }}>
          {/* Active portion of the track */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: isSelected ? `${((current - 1) / 4) * 100}%` : "50%", // Center it at 3 when unset
            background: isSelected ? activeColor : "rgba(92, 62, 53, 0.15)", // Muted active color when unset
            borderRadius: "4px",
            transition: "width 0.1s ease, background-color 0.2s ease"
          }} />
        </div>

        {/* Custom Visual Thumb */}
        <div style={{
          position: "absolute",
          left: isSelected ? `${((current - 1) / 4) * 100}%` : "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "var(--coco-white)",
          border: `3px solid ${isSelected ? activeColor : "var(--border)"}`,
          boxShadow: "0 2px 8px rgba(62, 39, 35, 0.1)",
          zIndex: 3,
          transition: "left 0.1s ease, border-color 0.2s ease",
          pointerEvents: "none"
        }} />

        {/* Hidden native input on top to intercept pointer inputs */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={isSelected ? current : 3}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: "100%",
            height: "36px",
            position: "relative",
            zIndex: 4,
            opacity: 0,
            cursor: "pointer",
            margin: 0,
            padding: 0
          }}
        />
      </div>

      {/* Numerical Labels below slider */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        padding: "0 8px",
        color: "var(--coco-brown)",
        fontSize: "0.8rem",
        fontWeight: 500,
        opacity: 0.7
      }}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
      
      {error && (
        <span style={{ color: "var(--coco-danger)", fontSize: "0.75rem", fontWeight: 500, marginTop: "0.25rem" }}>
          {error}
        </span>
      )}
    </div>
  )
}
