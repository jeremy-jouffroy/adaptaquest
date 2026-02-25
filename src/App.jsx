import { useState, useEffect, useCallback, useRef } from "react";

const ANIMALS_DATA = {
  beaks: [
    { id: "rapace", name: "La Buse", beak: "Pointu et crochu", food: "proies", emoji: "🦅", desc: "Son bec crochu lui permet de déchiqueter ses proies (petits mammifères)" },
    { id: "verdier", name: "Le Verdier", beak: "Court et conique", food: "graines", emoji: "🐦", desc: "Son bec fort et conique lui permet de décortiquer les graines" },
    { id: "chevalier", name: "Le Chevalier", beak: "Long et fin", food: "insectes", emoji: "🪶", desc: "Son bec long et fin lui permet d'attraper insectes, mollusques et vers" },
    { id: "colibri", name: "Le Colibri", beak: "Très fin, long et courbé", food: "nectar", emoji: "🌺", desc: "Son bec courbé lui permet d'atteindre le nectar des fleurs" },
  ],
  foods: [
    { id: "proies", name: "Petits mammifères", emoji: "🐭" },
    { id: "graines", name: "Graines", emoji: "🌾" },
    { id: "insectes", name: "Insectes & vers", emoji: "🐛" },
    { id: "nectar", name: "Nectar des fleurs", emoji: "🌸" },
  ],
  ecosystem: {
    producteurs: { name: "Producteurs", desc: "Produisent eux-mêmes ce dont ils ont besoin", color: "#4ade80", items: ["🌿 Herbe", "🍃 Feuilles", "🌳 Arbres"] },
    consommateurs: { name: "Consommateurs", desc: "Doivent consommer d'autres êtres vivants", color: "#f59e0b", items: ["🐰 Lapin", "🐺 Loup", "🐼 Panda", "🦊 Renard"] },
    decomposeurs: { name: "Décomposeurs", desc: "Recyclent les débris en matière minérale", color: "#a78bfa", items: ["🪱 Vers de terre", "🍄 Champignons"] },
  },
  camouflage: [
    { id: 1, name: "Papillon Kallima", type: "camouflage", desc: "Se confond avec une feuille morte", emoji: "🦋", hint: "Je ressemble à une feuille morte !" },
    { id: 2, name: "Phasme", type: "camouflage", desc: "Se confond avec une branche", emoji: "🪵", hint: "Je ressemble à une branche !" },
    { id: 3, name: "Syrphe", type: "mimétisme", desc: "Mouche inoffensive qui imite la guêpe", emoji: "🐝", hint: "Je suis une mouche, pas une guêpe !" },
    { id: 4, name: "Dendrobate bleue", type: "aposématisme", desc: "Sa couleur vive prévient qu'elle est toxique", emoji: "🐸", hint: "Ma couleur bleue dit : DANGER !" },
  ],
  survival: [
    { id: "desert", name: "Désert", emoji: "🏜️", temp: "50°C", animals: [
      { name: "Dromadaire", emoji: "🐪", adapt: "Stocke sa graisse dans sa bosse, peut se passer d'eau 2-3 semaines" },
      { name: "Vipère à cornes", emoji: "🐍", adapt: "S'enfouit sous le sable, sort la nuit pour échapper à la chaleur" },
    ]},
    { id: "banquise", name: "Banquise", emoji: "🧊", temp: "-45°C", animals: [
      { name: "Renard polaire", emoji: "🦊", adapt: "Fourrure hivernale épaisse, peut résister à -45°C" },
      { name: "Ours polaire", emoji: "🐻‍❄️", adapt: "Hiberne durant l'hiver, épaisse couche de graisse" },
    ]},
  ],
};

const QUIZ_QUESTIONS = [
  { q: "Comment appelle-t-on le processus qui permet à une espèce de s'améliorer dans son milieu ?", options: ["La photosynthèse", "L'adaptation au milieu", "La migration", "La reproduction"], answer: 1 },
  { q: "Le bec du colibri est...", options: ["Court et conique", "Pointu et crochu", "Très fin, long et courbé", "Plat et large"], answer: 2 },
  { q: "Quand une mouche imite les couleurs d'une guêpe, c'est du...", options: ["Camouflage", "Mimétisme", "Aposématisme", "Parasitisme"], answer: 1 },
  { q: "Les végétaux sont des...", options: ["Consommateurs", "Décomposeurs", "Producteurs", "Prédateurs"], answer: 2 },
  { q: "Le dromadaire stocke sa graisse dans...", options: ["Ses pattes", "Sa bosse", "Sa queue", "Ses oreilles"], answer: 1 },
  { q: "Les vers de terre sont des...", options: ["Producteurs", "Consommateurs", "Décomposeurs", "Prédateurs"], answer: 2 },
  { q: "Le renard polaire résiste au froid grâce à...", options: ["Ses grandes oreilles", "Sa fourrure hivernale", "Ses griffes", "Ses yeux"], answer: 1 },
  { q: "La forme du bec des oiseaux varie en fonction de...", options: ["Leur couleur", "Leur taille", "Leur régime alimentaire", "Leur chant"], answer: 2 },
  { q: "Le papillon Kallima se confond avec...", options: ["Une fleur", "Une feuille morte", "Un caillou", "De l'eau"], answer: 1 },
  { q: "Un écosystème c'est...", options: ["Un seul animal", "L'ensemble des espèces et leurs relations dans un milieu", "Une forêt", "Un zoo"], answer: 1 },
];

// Styles
const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
`;

const baseStyles = {
  app: {
    fontFamily: "'Nunito', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
    color: "#e2e8f0",
    position: "relative",
    overflow: "hidden",
  },
  container: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "16px",
    position: "relative",
    zIndex: 2,
  },
};

// ---- COMPONENTS ----

function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: s.left, top: s.top,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "#fff",
          opacity: 0.4 + Math.random() * 0.4,
          animation: `twinkle ${2 + s.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
      <style>{`@keyframes twinkle { 0% { opacity: 0.2; } 100% { opacity: 0.8; } }`}</style>
    </div>
  );
}

function XPBar({ xp, level }) {
  const xpForLevel = 100;
  const progress = (xp % xpForLevel) / xpForLevel * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{
        background: "rgba(251,191,36,0.2)", borderRadius: 20, padding: "4px 14px",
        fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14,
        color: "#fbbf24", border: "2px solid rgba(251,191,36,0.3)",
        whiteSpace: "nowrap",
      }}>
        ⭐ Niv. {level}
      </div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 20, height: 14, overflow: "hidden" }}>
        <div style={{
          width: `${progress}%`, height: "100%", borderRadius: 20,
          background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
          transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }} />
      </div>
      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>{xp % xpForLevel}/{xpForLevel} XP</span>
    </div>
  );
}

function Card({ children, style, onClick, glow }) {
  return (
    <div onClick={onClick} style={{
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(10px)",
      borderRadius: 20,
      border: glow ? `2px solid ${glow}` : "1px solid rgba(255,255,255,0.1)",
      padding: 20,
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      boxShadow: glow ? `0 0 20px ${glow}40` : "0 4px 20px rgba(0,0,0,0.2)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Button({ children, onClick, color = "#3b82f6", size = "md", disabled, style: extraStyle }) {
  const sizes = { sm: { padding: "8px 16px", fontSize: 14 }, md: { padding: "12px 24px", fontSize: 16 }, lg: { padding: "16px 32px", fontSize: 18 } };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...sizes[size],
      fontFamily: "'Fredoka', sans-serif",
      fontWeight: 600,
      background: disabled ? "#475569" : `linear-gradient(135deg, ${color}, ${color}dd)`,
      color: "#fff",
      border: "none",
      borderRadius: 14,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      boxShadow: disabled ? "none" : `0 4px 15px ${color}40`,
      opacity: disabled ? 0.5 : 1,
      ...extraStyle,
    }}>
      {children}
    </button>
  );
}

function Badge({ emoji, label, unlocked }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      opacity: unlocked ? 1 : 0.3,
      filter: unlocked ? "none" : "grayscale(1)",
      transition: "all 0.5s",
    }}>
      <div style={{
        fontSize: 36, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center",
        background: unlocked ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
        borderRadius: 16, border: unlocked ? "2px solid #fbbf24" : "2px solid rgba(255,255,255,0.1)",
      }}>{emoji}</div>
      <span style={{ fontSize: 11, color: unlocked ? "#fbbf24" : "#64748b", fontWeight: 600, textAlign: "center" }}>{label}</span>
    </div>
  );
}

function FeedbackOverlay({ show, success, message }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: success ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
      zIndex: 100, animation: "fadeInOut 1.5s ease forwards",
      pointerEvents: "none",
    }}>
      <div style={{
        fontSize: 28, fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
        color: success ? "#4ade80" : "#f87171",
        background: "rgba(0,0,0,0.7)", borderRadius: 24, padding: "20px 40px",
        animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        {success ? "✅ " : "❌ "}{message}
      </div>
      <style>{`
        @keyframes fadeInOut { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes popIn { 0% { transform: scale(0.5); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}

// ---- GAME SCREENS ----

function HomeScreen({ onStart, xp, level, badges }) {
  const worlds = [
    { id: "ecosystem", title: "La Forêt Vivante", subtitle: "Écosystème & chaîne alimentaire", emoji: "🌳", color: "#4ade80", unlockLevel: 0 },
    { id: "beaks", title: "Le Défi des Becs", subtitle: "Adaptation physique des oiseaux", emoji: "🦅", color: "#f59e0b", unlockLevel: 0 },
    { id: "adaptation", title: "Survie Extrême", subtitle: "Camouflage, mimétisme & milieux", emoji: "🦎", color: "#a78bfa", unlockLevel: 0 },
    { id: "quiz", title: "Le Grand Quiz", subtitle: "Teste tes connaissances !", emoji: "🏆", color: "#f43f5e", unlockLevel: 0 },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24, paddingTop: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🌍</div>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 36, fontWeight: 700, margin: 0, background: "linear-gradient(135deg, #4ade80, #38bdf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          AdaptaQuest
        </h1>
        <p style={{ color: "#94a3b8", margin: "8px 0 0", fontSize: 15 }}>L'aventure de l'adaptation au milieu</p>
      </div>

      <XPBar xp={xp} level={level} />

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
        <Badge emoji="🌳" label="Écologue" unlocked={badges.includes("ecosystem")} />
        <Badge emoji="🦅" label="Ornithologue" unlocked={badges.includes("beaks")} />
        <Badge emoji="🦎" label="Naturaliste" unlocked={badges.includes("adaptation")} />
        <Badge emoji="🏆" label="Maître Explorateur" unlocked={badges.includes("quiz")} />
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {worlds.map(w => (
          <Card key={w.id} onClick={() => onStart(w.id)} glow={w.color} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 40, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: `${w.color}20`, borderRadius: 16 }}>{w.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: w.color }}>{w.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{w.subtitle}</div>
              </div>
              <div style={{ fontSize: 22, color: w.color }}>▶</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// WORLD 1: Ecosystem
function EcosystemGame({ onComplete, onBack }) {
  const allItems = [
    { name: "🌿 Herbe", cat: "producteurs" },
    { name: "🐰 Lapin", cat: "consommateurs" },
    { name: "🪱 Ver de terre", cat: "decomposeurs" },
    { name: "🍃 Feuilles", cat: "producteurs" },
    { name: "🐺 Loup", cat: "consommateurs" },
    { name: "🍄 Champignon", cat: "decomposeurs" },
    { name: "🌳 Arbre", cat: "producteurs" },
    { name: "🦊 Renard", cat: "consommateurs" },
    { name: "🐼 Panda", cat: "consommateurs" },
  ];

  const [items, setItems] = useState(() => [...allItems].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState({ producteurs: [], consommateurs: [], decomposeurs: [] });
  const [currentItem, setCurrentItem] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const categories = [
    { id: "producteurs", ...ANIMALS_DATA.ecosystem.producteurs },
    { id: "consommateurs", ...ANIMALS_DATA.ecosystem.consommateurs },
    { id: "decomposeurs", ...ANIMALS_DATA.ecosystem.decomposeurs },
  ];

  const handlePlace = (catId) => {
    const item = items[currentItem];
    const correct = item.cat === catId;
    
    if (correct) {
      setPlaced(p => ({ ...p, [catId]: [...p[catId], item.name] }));
      setScore(s => s + 1);
      setFeedback({ success: true, message: "Bravo ! +10 XP" });
    } else {
      setFeedback({ success: false, message: `Non ! C'est un ${ANIMALS_DATA.ecosystem[item.cat].name.toLowerCase()}` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (correct) {
        if (currentItem + 1 >= items.length) {
          setDone(true);
        } else {
          setCurrentItem(c => c + 1);
        }
      }
    }, 1400);
  };

  if (done) {
    return (
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌳</div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", color: "#4ade80", fontSize: 28 }}>Forêt Vivante complétée !</h2>
        <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.6 }}>
          Tu as bien compris la chaîne alimentaire !<br/>
          <strong style={{ color: "#4ade80" }}>Producteurs</strong> → <strong style={{ color: "#f59e0b" }}>Consommateurs</strong> → <strong style={{ color: "#a78bfa" }}>Décomposeurs</strong>
        </p>
        <div style={{ fontSize: 18, color: "#fbbf24", fontWeight: 700, margin: "16px 0" }}>Score : {score}/{items.length} — +{score * 10} XP</div>
        <Button onClick={() => onComplete(score * 10)} color="#4ade80" size="lg">Continuer 🎉</Button>
      </div>
    );
  }

  return (
    <div>
      <FeedbackOverlay show={!!feedback} {...(feedback || {})} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Button onClick={onBack} color="#475569" size="sm">← Retour</Button>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", margin: 0, fontSize: 22, color: "#4ade80" }}>🌳 La Forêt Vivante</h2>
      </div>

      <Card style={{ textAlign: "center", marginBottom: 20 }}>
        <p style={{ color: "#94a3b8", margin: "0 0 8px", fontSize: 13 }}>Place cet être vivant dans la bonne catégorie :</p>
        <div style={{ fontSize: 42, margin: "8px 0" }}>{items[currentItem]?.name}</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>{currentItem + 1} / {items.length}</div>
      </Card>

      <div style={{ display: "grid", gap: 12 }}>
        {categories.map(cat => (
          <Card key={cat.id} onClick={() => handlePlace(cat.id)} glow={cat.color} style={{ cursor: "pointer", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: cat.color, minWidth: 140 }}>
                {cat.name}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{cat.desc}</div>
            </div>
            {placed[cat.id].length > 0 && (
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {placed[cat.id].map((item, i) => (
                  <span key={i} style={{ background: `${cat.color}20`, borderRadius: 8, padding: "2px 8px", fontSize: 14 }}>{item}</span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// WORLD 2: Beaks
function BeaksGame({ onComplete, onBack }) {
  const [phase, setPhase] = useState("play"); // play, result
  const [currentBird, setCurrentBird] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [matched, setMatched] = useState([]);
  const birds = ANIMALS_DATA.beaks;
  const foods = ANIMALS_DATA.foods;

  const handleFoodClick = (foodId) => {
    const bird = birds[currentBird];
    const correct = bird.food === foodId;
    
    if (correct) {
      setScore(s => s + 1);
      setMatched(m => [...m, bird.id]);
      setFeedback({ success: true, message: `${bird.emoji} ${bird.desc.substring(0, 40)}...` });
    } else {
      setFeedback({ success: false, message: `Non ! Le ${bird.name.toLowerCase()} mange : ${foods.find(f => f.id === bird.food).name}` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentBird + 1 >= birds.length) {
        setPhase("result");
      } else {
        setCurrentBird(c => c + 1);
      }
    }, 1800);
  };

  if (phase === "result") {
    return (
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🦅</div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", color: "#f59e0b", fontSize: 28 }}>Défi des Becs terminé !</h2>
        <div style={{ display: "grid", gap: 10, maxWidth: 400, margin: "20px auto", textAlign: "left" }}>
          {birds.map(b => (
            <Card key={b.id} style={{ padding: 14 }}>
              <div style={{ fontSize: 13 }}>
                <span style={{ fontSize: 22, marginRight: 8 }}>{b.emoji}</span>
                <strong style={{ color: "#f59e0b" }}>{b.name}</strong> — {b.beak}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{b.desc}</div>
            </Card>
          ))}
        </div>
        <div style={{ fontSize: 18, color: "#fbbf24", fontWeight: 700, margin: "16px 0" }}>Score : {score}/{birds.length} — +{score * 15} XP</div>
        <Button onClick={() => onComplete(score * 15)} color="#f59e0b" size="lg">Continuer 🎉</Button>
      </div>
    );
  }

  const bird = birds[currentBird];

  return (
    <div>
      <FeedbackOverlay show={!!feedback} {...(feedback || {})} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Button onClick={onBack} color="#475569" size="sm">← Retour</Button>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", margin: 0, fontSize: 22, color: "#f59e0b" }}>🦅 Le Défi des Becs</h2>
      </div>

      <Card style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 56, margin: "8px 0" }}>{bird.emoji}</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700, color: "#f59e0b" }}>{bird.name}</div>
        <div style={{ color: "#94a3b8", margin: "8px 0", fontSize: 15 }}>Bec : <strong style={{ color: "#e2e8f0" }}>{bird.beak}</strong></div>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Que mange cet oiseau ?</p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {foods.map(food => (
          <Card key={food.id} onClick={() => handleFoodClick(food.id)} style={{ cursor: "pointer", textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{food.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{food.name}</div>
          </Card>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#64748b" }}>{currentBird + 1} / {birds.length}</div>
    </div>
  );
}

// WORLD 3: Adaptation
function AdaptationGame({ onComplete, onBack }) {
  const [step, setStep] = useState(0); // 0=camouflage, 1=survival, 2=done
  const [subStep, setSubStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Camouflage quiz
  const camoQuestions = [
    { q: "Le papillon Kallima ressemble à une feuille morte. C'est du...", options: ["Camouflage", "Mimétisme", "Aposématisme"], answer: 0 },
    { q: "Le syrphe (mouche) se fait passer pour une guêpe. C'est du...", options: ["Camouflage", "Mimétisme", "Aposématisme"], answer: 1 },
    { q: "La dendrobate bleue montre sa couleur vive pour dire 'DANGER'. C'est de l'...", options: ["Camouflage", "Mimétisme", "Aposématisme"], answer: 2 },
    { q: "Le phasme ressemble à une branche. C'est du...", options: ["Camouflage", "Mimétisme", "Aposématisme"], answer: 0 },
  ];

  const survivalQuestions = [
    { q: "Comment le dromadaire survit-il dans le désert ?", options: ["Il boit beaucoup", "Il stocke la graisse dans sa bosse", "Il dort tout le temps"], answer: 1 },
    { q: "Que font certains serpents du désert pour échapper à la chaleur ?", options: ["Ils volent", "Ils s'enfouissent et sortent la nuit", "Ils nagent"], answer: 1 },
    { q: "Comment le renard polaire résiste à -45°C ?", options: ["Il fait du feu", "Grâce à sa fourrure hivernale", "Il porte un manteau"], answer: 1 },
    { q: "Que font l'ours et la marmotte en hiver ?", options: ["Ils déménagent", "Ils hivernent ou hibernent", "Ils construisent un igloo"], answer: 1 },
  ];

  const allQuestions = step === 0 ? camoQuestions : survivalQuestions;
  const current = allQuestions[subStep];

  const handleAnswer = (idx) => {
    const correct = idx === current.answer;
    if (correct) setScore(s => s + 1);
    setFeedback({ 
      success: correct, 
      message: correct ? "Super ! +10 XP" : `La bonne réponse était : ${current.options[current.answer]}` 
    });

    setTimeout(() => {
      setFeedback(null);
      if (subStep + 1 >= allQuestions.length) {
        if (step === 0) {
          setStep(1);
          setSubStep(0);
        } else {
          setStep(2);
        }
      } else {
        setSubStep(s => s + 1);
      }
    }, 1500);
  };

  if (step === 2) {
    return (
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🦎</div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", color: "#a78bfa", fontSize: 28 }}>Survie Extrême complétée !</h2>
        <div style={{ maxWidth: 500, margin: "20px auto" }}>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: "#4ade80", marginBottom: 6 }}>🦋 Camouflage & Mimétisme</div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              <strong>Camouflage</strong> = se confondre avec le milieu (papillon Kallima, phasme)<br/>
              <strong>Mimétisme</strong> = imiter un animal dangereux (syrphe → guêpe)<br/>
              <strong>Aposématisme</strong> = couleurs vives = "je suis toxique !" (dendrobate)
            </p>
          </Card>
          <Card>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: "#f59e0b", marginBottom: 6 }}>🏜️ Milieux hostiles</div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              <strong>Désert</strong> : graisse dans la bosse, s'enfouir, sortir la nuit<br/>
              <strong>Banquise</strong> : fourrure épaisse, hibernation, couche de graisse
            </p>
          </Card>
        </div>
        <div style={{ fontSize: 18, color: "#fbbf24", fontWeight: 700, margin: "16px 0" }}>Score : {score}/8 — +{score * 10} XP</div>
        <Button onClick={() => onComplete(score * 10)} color="#a78bfa" size="lg">Continuer 🎉</Button>
      </div>
    );
  }

  return (
    <div>
      <FeedbackOverlay show={!!feedback} {...(feedback || {})} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Button onClick={onBack} color="#475569" size="sm">← Retour</Button>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", margin: 0, fontSize: 22, color: "#a78bfa" }}>
          🦎 {step === 0 ? "Camouflage & Mimétisme" : "Milieux Hostiles"}
        </h2>
      </div>

      <Card style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 42, marginBottom: 8 }}>{step === 0 ? "🦋" : "🏜️"}</div>
        <p style={{ fontSize: 16, color: "#e2e8f0", margin: 0, lineHeight: 1.5 }}>{current.q}</p>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>{subStep + 1}/{allQuestions.length}</div>
      </Card>

      <div style={{ display: "grid", gap: 10 }}>
        {current.options.map((opt, i) => (
          <Card key={i} onClick={() => handleAnswer(i)} style={{ cursor: "pointer", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{opt}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// QUIZ FINAL
function QuizGame({ onComplete, onBack }) {
  const [questions] = useState(() => [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (idx) => {
    const correct = idx === questions[current].answer;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { q: questions[current].q, correct }]);
    setFeedback({
      success: correct,
      message: correct ? "Excellent !" : `Non... C'était : ${questions[current].options[questions[current].answer]}`,
    });

    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
      }
    }, 1500);
  };

  if (done) {
    const pct = Math.round(score / questions.length * 100);
    const passed = pct >= 70;
    return (
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{passed ? "🏆" : "📚"}</div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", color: passed ? "#fbbf24" : "#f87171", fontSize: 28 }}>
          {passed ? "Félicitations !" : "Encore un effort !"}
        </h2>
        <div style={{
          fontSize: 48, fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
          color: pct >= 80 ? "#4ade80" : pct >= 50 ? "#f59e0b" : "#f87171",
          margin: "16px 0",
        }}>{pct}%</div>
        <p style={{ color: "#94a3b8" }}>{score}/{questions.length} bonnes réponses</p>
        
        <div style={{ maxWidth: 500, margin: "20px auto", textAlign: "left" }}>
          {answers.map((a, i) => (
            <div key={i} style={{ fontSize: 13, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 8 }}>
              <span>{a.correct ? "✅" : "❌"}</span>
              <span style={{ color: a.correct ? "#94a3b8" : "#f87171" }}>{a.q}</span>
            </div>
          ))}
        </div>

        {passed && (
          <Card glow="#fbbf24" style={{ maxWidth: 400, margin: "24px auto", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, fontWeight: 700, color: "#fbbf24" }}>
              Diplôme de Maître Explorateur
            </div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Décerné à Yann</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Pour sa maîtrise de l'adaptation au milieu</div>
          </Card>
        )}

        <div style={{ marginTop: 20 }}>
          <Button onClick={() => onComplete(score * 15, passed)} color={passed ? "#fbbf24" : "#3b82f6"} size="lg">
            {passed ? "Retour au menu 🌍" : "Réessayer 🔄"}
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div>
      <FeedbackOverlay show={!!feedback} {...(feedback || {})} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Button onClick={onBack} color="#475569" size="sm">← Retour</Button>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", margin: 0, fontSize: 22, color: "#f43f5e" }}>🏆 Le Grand Quiz</h2>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i < current ? (answers[i]?.correct ? "#4ade80" : "#f87171") : i === current ? "#3b82f6" : "rgba(255,255,255,0.1)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      <Card style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Question {current + 1}/{questions.length}</div>
        <p style={{ fontSize: 17, color: "#e2e8f0", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>{q.q}</p>
      </Card>

      <div style={{ display: "grid", gap: 10 }}>
        {q.options.map((opt, i) => (
          <Card key={i} onClick={() => handleAnswer(i)} style={{
            cursor: "pointer", padding: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.1)", fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14,
              color: "#94a3b8",
            }}>
              {String.fromCharCode(65 + i)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{opt}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---- MAIN APP ----
export default function AdaptaQuest() {
  const [screen, setScreen] = useState("home");
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);

  const level = Math.floor(xp / 100) + 1;

  const addXp = (amount) => setXp(x => x + amount);
  const addBadge = (b) => setBadges(prev => prev.includes(b) ? prev : [...prev, b]);

  const handleWorldComplete = (world) => (earnedXp, passed) => {
    addXp(earnedXp);
    if (world === "quiz") {
      if (passed) addBadge("quiz");
    } else {
      addBadge(world);
    }
    setScreen("home");
  };

  return (
    <div style={baseStyles.app}>
      <style>{fonts}</style>
      <Stars />
      <div style={baseStyles.container}>
        {screen === "home" && <HomeScreen onStart={setScreen} xp={xp} level={level} badges={badges} />}
        {screen === "ecosystem" && <EcosystemGame onComplete={handleWorldComplete("ecosystem")} onBack={() => setScreen("home")} />}
        {screen === "beaks" && <BeaksGame onComplete={handleWorldComplete("beaks")} onBack={() => setScreen("home")} />}
        {screen === "adaptation" && <AdaptationGame onComplete={handleWorldComplete("adaptation")} onBack={() => setScreen("home")} />}
        {screen === "quiz" && <QuizGame onComplete={handleWorldComplete("quiz")} onBack={() => setScreen("home")} />}
      </div>
    </div>
  );
}
