import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", icon: "🌸", label: "Dashboard" },
  { to: "/tasks", icon: "🌿", label: "Tasks" },
  { to: "/calendar", icon: "📅", label: "Calendar" },
  { to: "/journal", icon: "📖🪶", label: "Journal" },
  { to: "/mood", icon: "🦋", label: "Mood" },
  { to: "/finance", icon: "💸", label: "Finance" },
  { to: "/ai", icon: "✨", label: "AI Chat" },
  { to: "/memory", icon: "💭", label: "Memory" },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        width: "300px",
        height: "100vh",
        minHeight: "100vh",
        padding: "25px",
        background:
          "linear-gradient(180deg,#FFFDF8,#FDEEF4,#F7F7ED,#EEF7EE)",
        borderRight: "2px solid #E6EEDB",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        paddingBottom: "20px",
        overflowY: "auto",
        overflowX: "hidden",
        boxShadow: "8px 0 30px rgba(0,0,0,.05)",
      }}
    >
      <motion.div
        animate={{
          y: [-4, 4, -4],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            fontSize: "58px",
          }}
        >
          🌸
        </div>

        <h2
          style={{
            margin: "6px 0",
            color: "#7B8F6A",
            fontWeight: "800",
          }}
        >
          LifeLoop
        </h2>

        <small
          style={{
            color: "#A77B91",
            fontSize: "14px",
          }}
        >
          Your Personal Journal
        </small>
      </motion.div>

      <nav
        style={{
          flex: 1,
        }}
      >
        {links.map(({ to, icon, label }, i) => (
          <motion.div
            key={to}
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: i * 0.08,
            }}
          >
            <NavLink
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "12px",
                padding: "15px",
                borderRadius: "18px",
                textDecoration: "none",
                background: isActive
                  ? "#FDEEF4"
                  : "rgba(255,255,255,.6)",
                color: "#6D597A",
                fontWeight: "700",
                boxShadow: isActive
                  ? "0 10px 25px rgba(167,123,145,.15)"
                  : "0 5px 15px rgba(0,0,0,.03)",
                transition: ".3s",
              })}
            >
                            <motion.span
                whileHover={{
                  rotate: 15,
                  scale: 1.2,
                }}
                style={{
                  fontSize: "24px",
                }}
              >
                {icon}
              </motion.span>

              <span>{label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        style={{
          padding: "18px",
          borderRadius: "24px",
          background: "rgba(255,255,255,.75)",
          border: "1px solid #E8E8D8",
          boxShadow: "0 10px 25px rgba(0,0,0,.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "15px",
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#F7CAD0,#EAF4EA,#CFE1C7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#6D597A",
              fontWeight: "800",
              fontSize: "22px",
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </motion.div>

          <div>
            <div
              style={{
                color: "#6D597A",
                fontWeight: "800",
              }}
            >
              {user?.name || "User"}
            </div>

            <small
              style={{
                color: "#7B8F6A",
              }}
            >
              Welcome back 🌸
            </small>
          </div>
        </div>

        <motion.button
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={handleSignOut}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "18px",
            background:
              "linear-gradient(90deg,#FDEEF4,#EAF4EA,#CFE1C7)",
            color: "#6D597A",
            fontWeight: "800",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(123,143,106,.15)",
          }}
        >
          🌿 Sign Out
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
