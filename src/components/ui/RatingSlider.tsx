"use client"

import * as React from "react"

export interface RatingSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  error?: string
}

const SCALE_LABELS: Record<number, string> = {
  1: "No me gusta nada",
  2: "No me gusta",
  3: "Ni me gusta ni me disgusta",
  4: "Me gusta",
  5: "Me gusta mucho",
}

// Gradient colors from warm-red to dark-brown as you slide right
const TRACK_COLORS: Record<number, string> = {
  1: "#C4705A",
  2: "#B8845E",
  3: "#A67C52",
  4: "#7A5C3E",
  5: "#5C3E35",
}

export function RatingSlider({ label, value, onChange, error }: RatingSliderProps) {
  const current = value || 3
  const isSelected = value > 0
  
  const activeColor = isSelected ? TRACK_COLORS[current] : "#C4B09A"
  const inactiveColor = "#F0E6DA"

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "0.4rem", 
      width: "100%",
      background: "var(--coco-white)",
      padding: "1.5rem 1.75rem",
      borderRadius: "20px",
      border: error ? "1.5px solid var(--coco-danger)" : "1px solid var(--border)",
      boxShadow: "0 1px 4px rgba(62, 39, 35, 0.03)",
      transition: "all 0.2s ease",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <label style={{ 
            fontFamily: "var(--font-serif)", 
            fontWeight: 700, 
            fontSize: "1.3rem", 
            color: "var(--coco-dark)",
            display: "block",
            marginBottom: "0.15rem"
          }}>
            {label}
          </label>
          <span style={{ 
            fontSize: "0.9rem", 
            fontWeight: 400, 
            color: isSelected ? activeColor : "var(--coco-brown)",
            opacity: isSelected ? 1 : 0.55,
            transition: "all 0.25s ease",
            fontStyle: isSelected ? "normal" : "italic",
          }}>
            {isSelected ? SCALE_LABELS[current] : "Desliza para calificar"}
          </span>
        </div>

        {/* Score badge */}
        <div style={{ 
          fontFamily: "var(--font-serif)",
          display: "flex",
          alignItems: "baseline",
          userSelect: "none",
          flexShrink: 0,
          background: isSelected ? `${activeColor}0D` : "transparent",
          padding: "0.3rem 0.6rem",
          borderRadius: "10px",
          transition: "all 0.25s ease"
        }}>
          <span style={{ 
            fontSize: "1.7rem", 
            fontWeight: 800, 
            color: isSelected ? activeColor : "var(--coco-brown)",
            opacity: isSelected ? 1 : 0.4,
            transition: "all 0.25s ease",
            lineHeight: 1
          }}>
            {isSelected ? current : "–"}
          </span>
          <span style={{ 
            fontSize: "0.95rem", 
            fontWeight: 600, 
            color: "var(--coco-brown)",
            opacity: 0.4,
            marginLeft: "2px"
          }}>
            /5
          </span>
        </div>
      </div>

      {/* Slider */}
      <div style={{ position: "relative", padding: "1rem 0 0.5rem 0" }}>
        {/* Track */}
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
          {/* Active fill */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: isSelected ? `${((current - 1) / 4) * 100}%` : "50%",
            background: isSelected
              ? `linear-gradient(90deg, #C4705A, ${activeColor})`
              : "rgba(196, 176, 154, 0.25)",
            borderRadius: "4px",
            transition: "width 0.15s ease, background 0.25s ease"
          }} />
        </div>

        {/* Thumb */}
        <div style={{
          position: "absolute",
          left: isSelected ? `${((current - 1) / 4) * 100}%` : "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: "var(--coco-white)",
          border: `3px solid ${activeColor}`,
          boxShadow: `0 2px 8px rgba(62, 39, 35, 0.12)`,
          zIndex: 3,
          transition: "left 0.15s ease, border-color 0.25s ease",
          pointerEvents: "none"
        }} />

        {/* Hidden native range */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={isSelected ? current : 3}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: "100%",
            height: "34px",
            position: "relative",
            zIndex: 4,
            opacity: 0,
            cursor: "pointer",
            margin: 0,
            padding: 0
          }}
        />
      </div>

      {/* Labels */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        padding: "0 6px",
        fontSize: "0.75rem",
        fontWeight: 500,
        color: "var(--coco-brown)",
        opacity: 0.5
      }}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
      
      {error && (
        <span style={{ color: "var(--coco-danger)", fontSize: "0.75rem", fontWeight: 600 }}>
          {error}
        </span>
      )}
    </div>
  )
}
