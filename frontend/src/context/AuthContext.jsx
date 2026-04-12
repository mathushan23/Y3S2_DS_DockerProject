import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (userData) => {
    const { token, ...userWithoutToken } = userData;
    // Normalize role string if it exists
    if (userWithoutToken.role && typeof userWithoutToken.role === 'string') {
      userWithoutToken.role = userWithoutToken.role.toUpperCase();
    }
    setUser(userWithoutToken);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userWithoutToken));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const getRole = () => {
    if (!user?.role) return null;
    return typeof user.role === 'string' ? user.role.toUpperCase() : null;
  };

  const isPatient = () => {
    const role = getRole();
    // Default to patient if logged in but no role specified, or if explicitly PATIENT
    return user && (!role || role === "PATIENT");
  };

  const isDoctor = () => getRole() === "DOCTOR";
  const isAdmin = () => getRole() === "ADMIN";

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated: !!user,
      getRole,
      isPatient,
      isDoctor,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
