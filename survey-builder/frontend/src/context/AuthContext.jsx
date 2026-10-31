import {
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";
import { AuthContext } from "./authContext";

const TOKEN_KEY = "survey_builder_token";

function applyToken(token) {
  if (token) {
    axios.defaults.headers.common.Authorization =
      `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem(TOKEN_KEY);

    async function restoreSession() {
      if (!token) {
        applyToken(null);
        if (active) setInitializing(false);
        return;
      }

      applyToken(token);

      try {
        const currentUser = await getCurrentUser(token);

        if (active) setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        applyToken(null);

        if (active) setUser(null);
      } finally {
        if (active) setInitializing(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(credentials) {
    const result = await loginUser(credentials);

    localStorage.setItem(TOKEN_KEY, result.token);
    applyToken(result.token);
    setUser(result.user);

    return result.user;
  }

  async function register(userData) {
    const result = await registerUser(userData);

    localStorage.setItem(TOKEN_KEY, result.token);
    applyToken(result.token);
    setUser(result.user);

    return result.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    applyToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, initializing]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}