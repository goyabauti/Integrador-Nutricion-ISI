"use client"

import * as React from "react"

export interface RatingSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  error?: string
}

const SCALE_LABELS: Record<number, { text: string, emoji: string, color: string }> = {
  1: { text: "No me gusta nada", emoji: "🤢", color: "var(--coco-danger)" },
  2: { text: "No me gusta", emoji: "😕", color: "#F4A261" },
  3: { text: "Ni me gusta ni me disgusta", emoji: "😐", color: "var(--coco-caramel)" },
  4: { text: "Me gusta", emoji: "😋", color: "#A8D5BA" },
  5: { text: "Me gusta mucho", emoji: "😍", color: "var(--coco-success)" },
}

export function RatingSlider({ label, value, onChange, error }: RatingSliderProps) {
  const current = value || 3; // Default visual a 3 si no hay valor (pero el value real puede ser 0 o undefined)
  const isSelected = value > 0;
  
  const activeColor = isSelected ? SCALE_LABELS[current].color : "var(--border)";

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "0.75rem", 
      width: "100%",
      background: "var(--coco-white)",
      padding: "1.25rem",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(62, 39, 35, 0.05)",
      border: error ? "1.5px solid var(--coco-danger)" : "1px solid var(--border)",
      transition: "border-color 0.2s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontWeight: 600, fontSize: "1rem", color: "var(--coco-dark)" }}>
          {label}
        </label>
        {isSelected && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem" }}>{SCALE_LABELS[current].emoji}</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: activeColor }}>
              {SCALE_LABELS[current].text}
            </span>
          </div>
        )}
      </div>

      <div style={{ position: "relative", paddingTop: "0.5rem", paddingBottom: "1.5rem" }}>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={current}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: "100%",
            appearance: "none",
            background: "transparent",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
          }}
          className="custom-slider"
        />
        
        {/* Pista visual custom */}
        <div style={{
          position: "absolute",
          top: "14px",
          left: 0,
          right: 0,
          height: "8px",
          background: "var(--coco-beige)",
          borderRadius: "4px",
          zIndex: 1,
          pointerEvents: "none",
        }}>
          {isSelected && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${((current - 1) / 4) * 100}%`,
              background: activeColor,
              borderRadius: "4px",
              transition: "width 0.2s ease-in-out, background-color 0.2s ease",
            }} />
          )}
        </div>
        
        {/* Marcas debajo del slider */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginTop: "0.5rem",
          padding: "0 4px",
          color: "var(--coco-brown)",
          fontSize: "0.75rem",
          fontWeight: 500
        }}>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
      
      {error && (
        <span style={{ color: "var(--coco-danger)", fontSize: "0.75rem", fontWeight: 500, marginTop: "-0.5rem" }}>
          {error}
        </span>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${isSelected ? activeColor : "var(--coco-brown)"};
          border: 3px solid var(--coco-white);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.1s, background-color 0.2s;
        }
        .custom-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${isSelected ? activeColor : "var(--coco-brown)"};
          border: 3px solid var(--coco-white);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.1s, background-color 0.2s;
        }
        .custom-slider:active::-webkit-slider-thumb {
          transform: scale(1.1);
        }
      `}} />
    </div>
  )
}
