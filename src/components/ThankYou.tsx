"use client"

import React from "react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";

export function ThankYou({ onReset }: { onReset?: () => void }) {
  return (
    <div className="animate-fade-in-up" style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      minHeight: "50vh",
      textAlign: "center"
    }}>
      <div style={{ 
        fontSize: "5rem", 
        marginBottom: "1rem",
        animation: "bounce 2s infinite" 
      }}>
        🎉
      </div>
      
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--coco-dark)" }}>
        ¡Muchas gracias por tu colaboración!
      </h2>
      
      <p style={{ color: "var(--coco-brown)", fontSize: "1.1rem", maxWidth: "400px", marginBottom: "2rem" }}>
        Tus respuestas nos ayudan a mejorar nuestro budín y crear un producto más delicioso y saludable.
      </p>
      
      {onReset && (
        <Button onClick={onReset} variant="outline" style={{ maxWidth: "200px" }}>
          Hacer otra evaluación
        </Button>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}} />
    </div>
  );
}
