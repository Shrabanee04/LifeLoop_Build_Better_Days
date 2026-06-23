import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(form);

      if (res.message === "Login Successful!") {
        signIn({
          id: res.userId,
          name: res.name,
          email: res.email,
        });

        navigate("/dashboard");
      } else {
        setError(res.message);
      }
    } catch {
      setError("🌹 Connection lost to the diary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#fff7f9 0%,#ffe4ec 30%,#e8f5e9 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Floating Flowers */}

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -100,
            x: Math.random() * window.innerWidth,
            opacity: 0,
          }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            position: "absolute",
            fontSize: "20px",
          }}
        >
          🌸
        </motion.div>
      ))}

      <motion.div
        initial={{
          opacity: 0,
          y: 80,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
        }}
        className="auth-card"
        style={{
          width: "420px",
          padding: "40px",
          borderRadius: "30px",
          background: "rgba(255,255,255,.3)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,.4)",
          boxShadow: "0 20px 60px rgba(0,0,0,.1)",
        }}
      >
        <motion.div
          animate={{
            y: [-5, 5, -5],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
          }}
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "70px",
            }}
          >
            🌸
          </div>

          <h1
            style={{
              color: "#6d597a",
              marginBottom: "5px",
              fontSize: "38px",
            }}
          >
            LifeLoop
          </h1>

          <p
            style={{
              color: "#52796f",
              marginBottom: "30px",
            }}
          >
            Welcome back to your secret diary
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#6d597a",
              }}
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "15px",
                border: "none",
                background: "rgba(255,255,255,.6)",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#6d597a",
              }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "15px",
                border: "none",
                background: "rgba(255,255,255,.6)",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#b56576",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "20px",
              background:
                "linear-gradient(90deg,#f7cad0,#d8e2dc,#84a98c)",
              color: "#fff",
              fontSize: "17px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(132,169,140,.4)",
            }}
          >
            {loading ? "🌸 Opening your secret diary..." : "🌿 Enter"}
          </motion.button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#6d597a",
          }}
        >
          New here?{" "}
          <Link
            to="/register"
            style={{
              color: "#84a98c",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
           Register here 🌱
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
