import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import React from "react";

export default function ProductoPage() {
  return (
    <div className="animate-fade-in-up">
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Nuestro Budín Saludable</h1>
        <p style={{ color: "var(--coco-brown)", fontSize: "1.1rem" }}>
          Descubrí qué hace especial a nuestro producto
        </p>
      </div>

      <Card style={{ marginBottom: "2rem" }}>
        <CardHeader>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", textAlign: "center" }}>🥥</div>
          <CardTitle style={{ textAlign: "center" }}>El origen</CardTitle>
        </CardHeader>
        <CardContent style={{ color: "var(--text-main)", lineHeight: 1.6 }}>
          <p>
            Desarrollamos este budín pensando en una opción que sea tanto deliciosa como
            nutritiva. A diferencia de los budines tradicionales cargados de azúcares refinados
            y harinas blancas, nuestra receta está cuidadosamente balanceada por nutricionistas.
          </p>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: "2rem" }}>
        <CardHeader>
          <CardTitle>Ingredientes Destacados</CardTitle>
          <CardDescription>Lo que usamos para crear este sabor único</CardDescription>
        </CardHeader>
        <CardContent>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li style={listItemStyle}>
              <span style={{ fontSize: "1.5rem" }}>🌾</span>
              <div>
                <strong>Harina de Avena:</strong> Rica en fibra y ayuda a mantener la saciedad.
              </div>
            </li>
            <li style={listItemStyle}>
              <span style={{ fontSize: "1.5rem" }}>🍯</span>
              <div>
                <strong>Azúcar Rubia (reducida):</strong> Endulzamos con opciones menos refinadas y en su justa medida.
              </div>
            </li>
            <li style={listItemStyle}>
              <span style={{ fontSize: "1.5rem" }}>🥥</span>
              <div>
                <strong>Coco Natural:</strong> Aporta grasas saludables, textura y un aroma inconfundible.
              </div>
            </li>
            <li style={listItemStyle}>
              <span style={{ fontSize: "1.5rem" }}>🥚</span>
              <div>
                <strong>Huevos y Aceite:</strong> Para lograr la humedad y esponjosidad perfecta sin usar manteca.
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nuestra Misión</CardTitle>
        </CardHeader>
        <CardContent style={{ color: "var(--text-main)", lineHeight: 1.6 }}>
          <p>
            Queremos demostrar que comer saludable no significa sacrificar el sabor.
            Tu feedback en la evaluación sensorial es fundamental para ayudarnos a ajustar
            la receta y llegar a la versión perfecta antes del lanzamiento oficial.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const listItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  background: "var(--coco-beige)",
  padding: "1rem",
  borderRadius: "8px"
};
