import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRomanticMelody } from "@/hooks/useRomanticMelody";
import SecretMessages from "@/components/SecretMessages";

const funnyMessages = [
  "sachmee ?? No🙂",
  "think again girl think again🎀",
  "No toh nahi bol payegi yes hi bol dee😾",
  "Abb yes daba de chup chaap se 🖐️",
  "Kitni baar bhagayegi No ko 😂",
  "Haaaar maan le ab 🙃",
];

const FloatingHeart = ({ style }: { style: React.CSSProperties }) => (
  <span className="absolute pointer-events-none animate-float-heart" style={style}>
    {["❤️", "💖", "💕", "🌸", "💗", "✨", "🦋"][Math.floor(Math.random() * 7)]}
  </span>
);

const GlowOrb = ({ delay, size, left, top }: { delay: string; size: string; left: string; top: string }) => (
  <div
    className="absolute rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none"
    style={{
      width: size, height: size, left, top,
      background: "radial-gradient(circle, rgba(255,182,193,0.6), rgba(219,112,147,0.2), transparent)",
      animationDelay: delay, animationDuration: "4s",
    }}
  />
);

// ===== CONFETTI =====
interface ConfettiPiece {
  id: number; x: number; y: number; color: string;
  rotation: number; scale: number; vx: number; vy: number;
  vr: number; shape: "circle" | "rect" | "heart";
}

const CONFETTI_COLORS = [
  "#ff69b4", "#ff1493", "#ffb6c1", "#ff85a2", "#ffd700",
  "#ff6b6b", "#ee82ee", "#da70d6", "#ff4081", "#f8bbd0",
];

const Confetti = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create 150 confetti pieces
    piecesRef.current = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.6 + 0.4,
      vx: (Math.random() - 0.5) * 20,
      vy: Math.random() * -18 - 5,
      vr: (Math.random() - 0.5) * 15,
      shape: (["circle", "rect", "heart"] as const)[Math.floor(Math.random() * 3)],
    }));

    const gravity = 0.35;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      piecesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= 0.99;
        p.rotation += p.vr;
        const opacity = Math.max(0, 1 - frame / 120);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(p.scale, p.scale);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillRect(-4, -8, 8, 16);
        } else {
          // heart
          ctx.beginPath();
          ctx.moveTo(0, -4);
          ctx.bezierCurveTo(-6, -10, -12, -2, 0, 8);
          ctx.bezierCurveTo(12, -2, 6, -10, 0, -4);
          ctx.fill();
        }
        ctx.restore();
      });

      if (frame < 150) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  );
};

// ===== SLIDE COMPONENTS =====
const Slide1 = () => (
  <div className="z-10 text-center px-6 animate-scale-in max-w-lg mx-auto">
    <div className="text-7xl md:text-9xl mb-8 animate-bounce drop-shadow-2xl">🎉</div>
    <div className="luxury-card p-8 md:p-10">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight luxury-text-gradient">
        Yaayyy! 🎉
      </h1>
      <div className="luxury-divider" />
      <p className="text-xl md:text-2xl text-white/85 font-medium leading-relaxed">
        I knew tu maanegi… koi nahi bol sakta mujhe No 😏🔥
      </p>
      <div className="luxury-divider" />
      <p className="text-lg text-white/50 italic">swipe karo aage →</p>
    </div>
  </div>
);

const Slide2 = () => (
  <div className="z-10 text-center px-6 animate-slide-up max-w-lg mx-auto">
    <div className="text-6xl md:text-8xl mb-6 drop-shadow-2xl">🌸</div>
    <div className="luxury-card-highlight p-8 md:p-10">
      <h1 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight luxury-text-gradient">
        See… I knew you could smile 😊
      </h1>
      <div className="luxury-divider" />
      <p className="text-lg md:text-xl text-white/85 font-medium mb-3 leading-relaxed">
        by the way hot kahii kii 🤓🤓
      </p>
      <p className="text-base md:text-lg text-white/70 leading-relaxed italic">
        Tu bohot special h mere liye… aur always rahegi 🌸
      </p>
    </div>
  </div>
);

const Slide3 = () => (
  <div className="z-10 text-center px-6 animate-slide-up max-w-lg mx-auto">
    <div className="text-6xl md:text-8xl mb-6 drop-shadow-2xl">🎭</div>
    <div className="luxury-card-highlight p-8 md:p-10">
      <p className="text-2xl md:text-3xl font-bold luxury-text-gradient mb-4">
        Reasons Why You're Special 💎
      </p>
      <div className="luxury-divider" />
      <ul className="text-left space-y-3 text-lg md:text-xl text-white/85 font-medium leading-relaxed">
        <li>✦ Tere chehre pe smile lanne ke liye toh jaan bhi kurban 🌟</li>
        <li>✦ Tujhse baat krke chehre pe continuously smile rehti h blush pure din 😊</li>
        <li>✦ Tu gussa h ya naraz pr ignore krti h tbh kafi huruut hota h 😔</li>
        <li>✦ Manjaa yrr, kyu krna ignore hm? 🙃</li>
      </ul>
    </div>
  </div>
);

const Slide4 = () => (
  <div className="z-10 text-center px-6 animate-scale-in max-w-lg mx-auto">
    <div className="text-6xl md:text-8xl mb-6 drop-shadow-2xl animate-bounce">🤝</div>
    <div className="luxury-card p-8 md:p-10">
      <p className="text-2xl md:text-3xl font-bold luxury-text-gradient mb-4">
        A Promise 🤞
      </p>
      <div className="luxury-divider" />
      <p className="text-lg md:text-xl text-white/85 font-medium leading-relaxed mb-3">
        Chahe kuch bhi ho jaye…
        <br />
        me hamesha tere saath hu 🛡️✊
      </p>
      <div className="luxury-divider" />
      <p className="text-base md:text-lg text-white/70 italic leading-relaxed">
        Dosti ho ya kuch aur… tu meri priority rahegi always 💯
      </p>
    </div>
  </div>
);

const Slide5 = () => (
  <div className="z-10 text-center px-6 animate-slide-up max-w-lg mx-auto">
    <div className="text-6xl md:text-8xl mb-6 drop-shadow-2xl animate-pulse">✨</div>
    <div className="luxury-card-highlight p-8 md:p-10">
      <p className="text-2xl md:text-3xl font-bold luxury-text-gradient mb-4">
        Happy Women's Day 🌸
      </p>
      <div className="luxury-divider" />
      <p className="text-lg md:text-xl text-white/85 font-medium leading-relaxed mb-4">
        Duniya ki sabse khoobsurat ladki ko…
        <br />
        my lady (dimp) ko… 🌸
      </p>
      <div className="luxury-divider" />
      <p className="text-xl md:text-2xl font-bold text-pink-300 mb-2">
        Ab mann ja na yrr… please 🥺
      </p>
      <div className="luxury-divider" />
      <p className="text-white/60 text-base italic">— with care, always 🌟</p>
    </div>
    <SecretMessages />
  </div>
);

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5];

const Index = () => {
  const [noPos, setNoPos] = useState<{ top?: string; left?: string } | null>(null);
  const [msgIndex, setMsgIndex] = useState(-1);
  const [accepted, setAccepted] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const [noCount, setNoCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { playing, playMelody, stopMelody } = useRomanticMelody();

  const bgHearts = useMemo(
    () =>
      [...Array(12)].map((_, i) => ({
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        fontSize: Math.random() * 24 + 14 + "px",
        animationDelay: i * 0.6 + "s",
        animationDuration: 4 + Math.random() * 3 + "s",
      })),
    []
  );

  const moveNo = useCallback(() => {
    setNoPos({ top: Math.random() * 70 + 10 + "%", left: Math.random() * 70 + 10 + "%" });
    setMsgIndex((i) => (i + 1) % funnyMessages.length);
    setNoCount((c) => c + 1);
  }, []);

  const handleYes = () => {
    setAccepted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((s) => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  };

  useEffect(() => {
    if (!accepted) return;
    const interval = setInterval(() => {
      setHearts((prev) => {
        const newHeart = {
          id: Date.now() + Math.random(),
          style: {
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animationDelay: Math.random() * 2 + "s",
            fontSize: Math.random() * 24 + 16 + "px",
          },
        };
        return [...prev.slice(-40), newHeart];
      });
    }, 350);
    return () => clearInterval(interval);
  }, [accepted]);

  const musicBtn = (
    <button
      onClick={playing ? stopMelody : playMelody}
      className="fixed top-4 right-4 z-50 w-12 h-12 flex items-center justify-center text-2xl rounded-full shadow-2xl backdrop-blur-xl border border-white/20 hover:scale-110 transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,182,193,0.2))",
        boxShadow: "0 8px 32px rgba(219,112,147,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      {playing ? "🔇" : "🎵"}
    </button>
  );

  // ===== ACCEPTED — SLIDES =====
  if (accepted) {
    const SlideComponent = SLIDES[currentSlide];
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden luxury-bg">
        {musicBtn}
        <Confetti active={showConfetti} />
        <GlowOrb delay="0s" size="400px" left="-10%" top="-10%" />
        <GlowOrb delay="2s" size="300px" left="70%" top="60%" />
        <GlowOrb delay="1s" size="350px" left="40%" top="-20%" />

        {hearts.map((h) => (
          <FloatingHeart key={h.id} style={h.style} />
        ))}

        {/* Slide content with key for re-mount animation */}
        <div key={currentSlide} className="w-full">
          <SlideComponent />
        </div>

        {/* Navigation dots */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
          {currentSlide > 0 && (
            <button onClick={prevSlide} className="luxury-nav-btn">
              ← Back
            </button>
          )}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  i === currentSlide
                    ? "bg-pink-400 scale-125 shadow-lg shadow-pink-400/50"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          {currentSlide < SLIDES.length - 1 && (
            <button onClick={nextSlide} className="luxury-nav-btn">
              Next →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ===== MAIN QUESTION STATE =====
  return (
    <div className="min-h-[120vh] flex flex-col items-center justify-start relative overflow-hidden luxury-bg px-4 py-12 md:py-16">
      {musicBtn}
      <GlowOrb delay="0s" size="400px" left="-15%" top="10%" />
      <GlowOrb delay="1.5s" size="350px" left="65%" top="-15%" />
      <GlowOrb delay="3s" size="300px" left="30%" top="70%" />

      {bgHearts.map((style, i) => (
        <span key={i} className="absolute opacity-[0.15] pointer-events-none animate-float-heart" style={style}>
          ❤️
        </span>
      ))}

      <div className="z-10 text-center max-w-lg mx-auto w-full">
        <div className="animate-fade-in">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-pink-200/60 mb-2 font-light">
            ✦ a special message ✦
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2 luxury-text-gradient drop-shadow-2xl">
            Happy Women's Day
          </h1>
          <span className="text-4xl md:text-5xl">🌸</span>
        </div>

        <div className="animate-fade-in mt-8" style={{ animationDelay: "0.3s" }}>
          <div className="luxury-card p-5 md:p-6">
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              I know that ki tu kitne time se ignore kr rhi h ,..but i really want ki hum vapas baat krne lagge ,..
            </p>
            <p className="font-bold text-lg md:text-xl mt-2 luxury-text-gradient">
              My lady( dimpp)🌸
            </p>
          </div>
        </div>

        <div className="animate-fade-in mt-8" style={{ animationDelay: "0.6s" }}>
          <div className="luxury-card-highlight p-6 md:p-8">
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              kee ho gya chorri gussa h kee mann bhi jaa chukri 🙂?
            </p>
            <p className="text-lg md:text-xl font-semibold mt-2 luxury-text-gradient">mangyii kee</p>
            <div className="luxury-divider" />
            <p className="text-base md:text-lg text-white/70 italic leading-relaxed">
              mann bhi jaa yrr 🙂 sachi kaffi adhura sa ajeeb sa lag rha…
              <br />
              <span className="text-pink-200 font-medium">so mann ja 🙏</span>
            </p>
          </div>
        </div>

        {msgIndex >= 0 && (
          <div className="mt-4 animate-bounce">
            <p className="text-lg md:text-xl font-semibold text-pink-100 luxury-card inline-block px-5 py-2">
              {funnyMessages[msgIndex]}
            </p>
          </div>
        )}

        <div className="flex gap-5 justify-center items-center mt-8 animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <button onClick={handleYes} className="luxury-btn-yes group">
            <span className="relative z-10">YES 🙌</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button
            onClick={moveNo}
            onMouseEnter={moveNo}
            className="luxury-btn-no"
            style={
              noPos ? { position: "fixed", top: noPos.top, left: noPos.left, zIndex: 50, transition: "all 0.15s ease-out" } : {}
            }
          >
            NO 🙃
          </button>
        </div>

        {noCount > 3 && (
          <p className="text-sm text-pink-200/50 mt-6 animate-fade-in italic">
            Hint: NO button toh bhagega hi… bas YES daba de 😘
          </p>
        )}

        {/* Extra spacing at bottom */}
        <div className="h-24" />
      </div>
    </div>
  );
};

export default Index;
