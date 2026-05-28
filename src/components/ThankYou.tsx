"use client"

import React from "react";
import { Button } from "./ui/Button";

export function ThankYou({ onReset }: { onReset?: () => void }) {
  return (
    <div className="animate-scale-in" style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      minHeight: "55vh",
      textAlign: "center",
      padding: "2rem 1rem"
    }}>
      {/* Animated check circle */}
      <div className="thank-you-check" style={{ 
        width: "88px",
        height: "88px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--coco-light), var(--coco-beige))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "2rem",
        color: "var(--coco-dark)"
      }}>
        <svg style={{ width: "40px", height: "40px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 style={{ 
        fontFamily: "var(--font-serif)",
        fontSize: "2.2rem", 
        fontWeight: 800,
        marginBottom: "0.75rem", 
        color: "var(--coco-dark)" 
      }}>
        ¡Gracias por participar!
      </h2>
      
      <p style={{ 
        color: "var(--coco-brown)", 
        fontSize: "1.1rem", 
        maxWidth: "380px", 
        marginBottom: "2.5rem",
        lineHeight: "1.7"
      }}>
        Tu evaluación nos ayuda a crear un budín más delicioso y saludable para todos.
      </p>

      {/* Decorative divider */}
      <div style={{
        width: "48px",
        height: "3px",
        background: "var(--coco-caramel)",
        borderRadius: "2px",
        marginBottom: "2.5rem",
        opacity: 0.6
      }} />
      
      {onReset && (
        <Button onClick={onReset} variant="outline" style={{ maxWidth: "220px" }}>
          Hacer otra evaluación
        </Button>
      )}
    </div>
  );
}
