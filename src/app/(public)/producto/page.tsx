import React from "react";

/* ── tipos internos ── */
interface Ingredient {
  emoji: string;
  name: string;
  description: string;
  color: string;
}

interface Benefit {
  icon: string;
  title: string;
  text: string;
}

/* ── datos ── */
const ingredients: Ingredient[] = [
  {
    emoji: "🫘",
    name: "Lentejas",
    description: "Fuente de proteína vegetal y hierro. Le dan cuerpo y nutrición al budín.",
    color: "#C8A882",
  },
  {
    emoji: "🌾",
    name: "Avena",
    description: "Cereal rico en fibra con beta-glucanos. Aporta estructura y saciedad.",
    color: "#D4A574",
  },
  {
    emoji: "🥒",
    name: "Zucchini",
    description: "Hortaliza que aporta humedad natural, vitaminas y textura esponjosa.",
    color: "#8BA888",
  },
  {
    emoji: "🍎",
    name: "Manzana",
    description: "Fruta que endulza naturalmente y aporta pectina para una miga suave.",
    color: "#C47A7A",
  },
  {
    emoji: "🍫",
    name: "Cacao amargo",
    description: "Toque de sabor intenso con antioxidantes naturales (polifenoles).",
    color: "#8B6347",
  },
  {
    emoji: "🍯",
    name: "Azúcar mascabo",
    description: "Endulzante sin refinar, con minerales como hierro, calcio y potasio.",
    color: "#C49B52",
  },
];

const benefits: Benefit[] = [
  {
    icon: "💪",
    title: "Proteína completa",
    text: "La combinación de lentejas y avena aporta todos los aminoácidos esenciales que el cuerpo necesita.",
  },
  {
    icon: "🌿",
    title: "Alto en fibra",
    text: "Favorece la digestión y ayuda a mantener la glucemia estable, evitando picos de energía.",
  },
  {
    icon: "🛡️",
    title: "Antioxidantes",
    text: "El cacao y la manzana aportan compuestos que protegen las células del estrés oxidativo.",
  },
  {
    icon: "🌱",
    title: "100% vegetal",
    text: "Todos los ingredientes son de origen vegetal, lo que lo hace más sustentable para el planeta.",
  },
];

/* ── componente ── */
export default function ProductoPage() {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }} className="animate-fade-in-up">

      {/* ── HERO ── */}
      <div style={{ textAlign: "center", padding: "2rem 0 1.5rem" }}>
        <span className="hero-badge">Hecho en Planta de Producción</span>
        <h1 className="hero-title" style={{ marginTop: "0.75rem" }}>
          Budín de Lentejas,<br />Manzana y Zucchini
        </h1>
        <p className="hero-subtitle">
          Un budín nutritivo y delicioso, hecho con ingredientes de origen vegetal,
          pensado especialmente para chicos y adolescentes.
        </p>
      </div>



      {/* ── QUÉ ES ── */}
      <div style={sectionStyle}>
        <div className="section-header">
          <div className="section-line" />
          <span className="section-title">¿Qué es?</span>
          <div className="section-line" />
        </div>
        <div style={whatIsCardStyle}>
          <p style={whatIsTextStyle}>
            Es un <strong>budín húmedo y esponjoso</strong> elaborado con cuatro grupos de
            alimentos: legumbres, cereales, frutas y verduras. Sin harinas refinadas,
            sin azúcares agregados en exceso, y con un sabor suave a cacao y vainilla
            que lo hace irresistible.
          </p>
          <div style={tagsRowStyle}>
            {["Sin harina blanca", "Alto en fibra", "Proteína vegetal", "Apto escolares"].map(tag => (
              <span key={tag} style={tagStyle}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── INGREDIENTES ── */}
      <div style={sectionStyle}>
        <div className="section-header">
          <div className="section-line" />
          <span className="section-title">Sus ingredientes</span>
          <div className="section-line" />
        </div>
        <div style={ingredientsGridStyle}>
          {ingredients.map((ing) => (
            <div key={ing.name} style={ingredientCardStyle} className="ingredient-card">
              <div style={{ ...ingredientIconStyle, background: `${ing.color}20`, border: `1.5px solid ${ing.color}40` }}>
                <span style={{ fontSize: "1.6rem" }}>{ing.emoji}</span>
              </div>
              <div>
                <p style={ingredientNameStyle}>{ing.name}</p>
                <p style={ingredientDescStyle}>{ing.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BENEFICIOS ── */}
      <div style={sectionStyle}>
        <div className="section-header">
          <div className="section-line" />
          <span className="section-title">¿Por qué es bueno?</span>
          <div className="section-line" />
        </div>
        <div style={benefitsGridStyle}>
          {benefits.map((b) => (
            <div key={b.title} style={benefitCardStyle}>
              <div style={benefitIconStyle}>{b.icon}</div>
              <h3 style={benefitTitleStyle}>{b.title}</h3>
              <p style={benefitTextStyle}>{b.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={ctaCardStyle}>
        <p style={ctaEmojiStyle}>⭐</p>
        <h2 style={ctaTitleStyle}>¿Ya lo probaste?</h2>
        <p style={ctaTextStyle}>
          Tu opinión nos ayuda a mejorar la receta. Contanos qué te pareció el sabor,
          la textura y el aroma.
        </p>
        <a href="/evaluar" style={ctaBtnStyle} className="btn btn-default btn-lg" id="cta-evaluar-producto">
          Dejar mi evaluación →
        </a>
      </div>

    </div>
  );
}

/* ── estilos ── */
const sectionStyle: React.CSSProperties = {
  marginBottom: "2rem",
};

const whatIsCardStyle: React.CSSProperties = {
  background: "var(--coco-white)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "1.5rem",
  boxShadow: "var(--shadow)",
  marginTop: "1rem",
};

const whatIsTextStyle: React.CSSProperties = {
  color: "var(--coco-dark)",
  lineHeight: 1.7,
  fontSize: "1rem",
  marginBottom: "1.25rem",
};

const tagsRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

const tagStyle: React.CSSProperties = {
  background: "var(--coco-beige)",
  color: "var(--coco-brown)",
  borderRadius: "100px",
  padding: "0.3rem 0.85rem",
  fontSize: "0.78rem",
  fontWeight: 600,
};

const ingredientsGridStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginTop: "1rem",
};

const ingredientCardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  background: "var(--coco-white)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  padding: "1rem 1.25rem",
  boxShadow: "var(--shadow)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const ingredientIconStyle: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const ingredientNameStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "var(--coco-dark)",
  marginBottom: "0.2rem",
};

const ingredientDescStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "var(--coco-brown)",
  lineHeight: 1.5,
};

const benefitsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.75rem",
  marginTop: "1rem",
};

const benefitCardStyle: React.CSSProperties = {
  background: "var(--coco-white)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  padding: "1.25rem",
  boxShadow: "var(--shadow)",
};

const benefitIconStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "0.5rem",
};

const benefitTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  fontSize: "0.9rem",
  color: "var(--coco-dark)",
  marginBottom: "0.35rem",
};

const benefitTextStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  color: "var(--coco-brown)",
  lineHeight: 1.55,
};

const ctaCardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--coco-dark) 0%, #5a3a2a 100%)",
  borderRadius: "20px",
  padding: "2rem 1.75rem",
  textAlign: "center",
  marginBottom: "2rem",
  boxShadow: "0 8px 32px rgba(62,39,35,0.2)",
};

const ctaEmojiStyle: React.CSSProperties = {
  fontSize: "2rem",
  marginBottom: "0.5rem",
};

const ctaTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  color: "var(--coco-cream)",
  marginBottom: "0.5rem",
};

const ctaTextStyle: React.CSSProperties = {
  color: "rgba(255,248,240,0.75)",
  fontSize: "0.9rem",
  lineHeight: 1.6,
  marginBottom: "1.5rem",
  maxWidth: "380px",
  margin: "0 auto 1.5rem",
};

const ctaBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  background: "var(--coco-caramel)",
  color: "var(--coco-white)",
  padding: "0.85rem 2rem",
  borderRadius: "12px",
  fontWeight: 600,
  fontSize: "0.95rem",
  textDecoration: "none",
  transition: "all 0.25s ease",
  width: "auto",
};
