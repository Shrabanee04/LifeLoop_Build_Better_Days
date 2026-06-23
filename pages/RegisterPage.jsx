import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../api/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await register(form);
      setMsg(res);

      if (res === "User Registered Successfully!") {
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      setMsg("Connection error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = msg === "User Registered Successfully!";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#fff8fa,#fdebf2,#eef8ef)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {[...Array(18)].map((_, i) => (
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
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            position: "absolute",
            fontSize: "18px",
          }}
        >
          🌸
        </motion.div>
      ))}

      <motion.div
        initial={{
          opacity: 0,
          y: 60,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
        }}
        style={{
          width: "430px",
          padding: "40px",
          borderRadius: "30px",
          background: "rgba(255,255,255,.28)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,.4)",
          boxShadow: "0 20px 60px rgba(0,0,0,.1)",
        }}
      >
        <motion.div
          animate={{
            y: [-4, 4, -4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          style={{
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px" }}>
            📖
          </div>

          <h1
            style={{
              color: "#6d597a",
              marginBottom: "8px",
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
            Create your personal journal
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                color: "#6d597a",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "15px",
                border: "none",
                outline: "none",
                background: "rgba(255,255,255,.65)",
              }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                color: "#6d597a",
                display: "block",
                marginBottom: "8px",
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
                padding: "14px",
                borderRadius: "15px",
                border: "none",
                outline: "none",
                background: "rgba(255,255,255,.65)",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                color: "#6d597a",
                display: "block",
                marginBottom: "8px",
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
                padding: "14px",
                borderRadius: "15px",
                border: "none",
                outline: "none",
                background: "rgba(255,255,255,.65)",
              }}
            />
          </div>

          {msg && (
            <p
              style={{
                color: isSuccess ? "#52796f" : "#b56576",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {msg}
            </p>
          )}

          <motion.button
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.97,
            }}
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "18px",
              background:
                "linear-gradient(90deg,#f7cad0,#d8e2dc,#84a98c)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(132,169,140,.3)",
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#6d597a",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#84a98c",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}