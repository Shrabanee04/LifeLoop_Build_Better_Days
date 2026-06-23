import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("ll_user") || "null")
  );

  const signIn = (userData) => {
    localStorage.setItem("ll_user", JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem("ll_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
