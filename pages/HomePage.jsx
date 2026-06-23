import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "🌿", title: "Tasks", text: "Keep your to-dos blooming, not wilting." },
  { icon: "📅", title: "Calendar", text: "Every appointment, gently in its place." },
  { icon: "📖", title: "Journal", text: "A quiet page for the thoughts of your day." },
  { icon: "🦋", title: "Mood", text: "Notice how you feel, one entry at a time." },
  { icon: "💸", title: "Finance", text: "Watch your spending grow — or shrink." },
  { icon: "✨", title: "AI Chat", text: "Ask your diary anything, anytime." },
];

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflowX: "hidden",
        background: "#FFF7F2",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Google Fonts ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Ambient animated background: drifting ink-blot blobs + paper grain ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-12%",
            left: "-8%",
            width: "48vw",
            height: "48vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, rgba(253,234,240,0.95), rgba(253,234,240,0))",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -50, 40, 0], y: [0, 50, -20, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            right: "-10%",
            width: "42vw",
            height: "42vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 60% 40%, rgba(232,240,227,0.95), rgba(232,240,227,0))",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{ x: [0, 30, -40, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "20%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(212,165,184,0.5), rgba(212,165,184,0))",
            filter: "blur(50px)",
          }}
        />

        {/* Paper grain texture, very subtle */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.035,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            mixBlendMode: "multiply",
          }}
        />

        {/* Pressed-flower accents, static and quiet rather than floating confetti */}
        {[
          { top: "8%", left: "6%", size: 22, rotate: -12, opacity: 0.5 },
          { top: "22%", left: "92%", size: 16, rotate: 20, opacity: 0.4 },
          { top: "70%", left: "4%", size: 18, rotate: 8, opacity: 0.35 },
          { top: "85%", left: "88%", size: 24, rotate: -18, opacity: 0.45 },
        ].map((p, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              fontSize: p.size,
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            🌸
          </span>
        ))}
      </div>

      {/* ── Content (sits above the ambient layer) ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 48px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "26px" }}>🌸</span>
            <span
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                color: "#6D597A",
                fontSize: "21px",
                letterSpacing: "-0.3px",
              }}
            >
              LifeLoop
            </span>
          </div>

          <nav style={{ display: "flex", gap: "14px" }}>
            <Link
              to="/login"
              style={{
                padding: "10px 22px",
                borderRadius: "16px",
                color: "#6D597A",
                fontWeight: 600,
                fontSize: "14.5px",
                textDecoration: "none",
                background: "rgba(255,255,255,.6)",
                border: "1px solid rgba(255,255,255,.8)",
              }}
            >
              Sign in
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "inline-block",
                  padding: "10px 22px",
                  borderRadius: "16px",
                  fontWeight: 700,
                  fontSize: "14.5px",
                  color: "#fff",
                  background: "linear-gradient(90deg,#D4A5B8,#84A98C)",
                  boxShadow: "0 10px 24px rgba(132,169,140,.3)",
                }}
              >
                Get started
              </motion.span>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section
          style={{
            textAlign: "center",
            padding: "70px 24px 50px",
            maxWidth: "760px",
            margin: "0 auto",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "20px",
              background: "rgba(255,255,255,.65)",
              border: "1px solid rgba(255,255,255,.8)",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#84A98C",
              marginBottom: "26px",
            }}
          >
            🌱 Your whole life, gently kept
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(36px, 5.5vw, 56px)",
              fontWeight: 500,
              color: "#5B4A66",
              margin: "0 0 18px",
              letterSpacing: "-0.5px",
              lineHeight: 1.12,
            }}
          >
            A quiet space for your
            <br />
            thoughts to bloom.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            style={{
              fontSize: "16.5px",
              color: "#6B7F6B",
              maxWidth: "480px",
              margin: "0 auto 36px",
              lineHeight: 1.65,
            }}
          >
            Tasks, calendar, journal, mood, money, and a little AI companion —
            all tended in one gentle, personal diary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}
          >
            <Link to="/register" style={{ textDecoration: "none" }}>
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px 32px",
                  borderRadius: "20px",
                  fontWeight: 700,
                  fontSize: "15.5px",
                  color: "#fff",
                  background: "linear-gradient(90deg,#D4A5B8,#84A98C)",
                  boxShadow: "0 16px 32px rgba(132,169,140,.35)",
                }}
              >
                🌿 Start your diary
              </motion.span>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  borderRadius: "20px",
                  fontWeight: 700,
                  fontSize: "15.5px",
                  color: "#6D597A",
                  background: "rgba(255,255,255,.7)",
                  border: "1px solid rgba(255,255,255,.85)",
                }}
              >
                Sign in
              </motion.span>
            </Link>
          </motion.div>
        </section>

        {/* Feature grid */}
        <section
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            padding: "10px 24px 100px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          {FEATURES.map(({ icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(109,89,122,.12)" }}
              style={{
                background: "rgba(255,255,255,.6)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,.75)",
                borderRadius: "22px",
                padding: "26px 22px",
                boxShadow: "0 10px 26px rgba(109,89,122,.06)",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</div>
              <h3
                style={{
                  fontFamily: "'Fraunces', serif",
                  color: "#5B4A66",
                  margin: "0 0 6px",
                  fontSize: "17px",
                  fontWeight: 600,
                }}
              >
                {title}
              </h3>
              <p style={{ color: "#6B7F6B", fontSize: "13.5px", lineHeight: 1.55, margin: 0 }}>
                {text}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            paddingBottom: "60px",
            color: "#9CA88E",
            fontSize: "13px",
          }}
        >
          🌱 Free to start · your diary, always yours
        </footer>
      </div>
    </div>
  );
}
