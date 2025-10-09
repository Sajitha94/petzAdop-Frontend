import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../config"; // if needed for fetching profile details

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load token and decode on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // If token expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("token");
          setUser(null); // ✅ clears avatar
          return;
        }

        // Optionally fetch full profile info
        fetch(`${API_BASE_URL}/api/auth/profile/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") setUser(data.data);
            else
              setUser({
                name: decoded.name,
                role: decoded.role,
                _id: decoded.id,
              });
          })
          .catch(() => setUser(null));
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
