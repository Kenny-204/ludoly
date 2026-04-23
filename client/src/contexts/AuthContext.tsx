import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { config } from "../utils/config";

type user = {
  _id: "string";
  email: "string";
  username: "string";
};

type AuthTypes = {
  currentUser: user | null;
  signup: (data: {
    email: string;
    password: string;
    passwordConfirm: string;
    username: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const authContext = createContext<AuthTypes | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("Auth context used outside of auth provider");
  }
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<user | null>(null);

  useEffect(function () {
    async function fetchUser() {
      const req = await fetch(`${config.backend.API_URL}/users/me`, {
        credentials: "include",
      });
      if (!req.ok) {
        setCurrentUser(null);
        return;
      }

      const data = await req.json();
      setCurrentUser(data.user);
    }
    fetchUser();
  }, []);

  async function signup(data: {
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
  }) {
    const res = await fetch(`${config.backend.API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const responseBody = await res.json();
    const user = responseBody.createdUser;
   
    const newUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };

    setCurrentUser(newUser);
  }

  async function login(data: { email: string; password: string }) {
    const res = await fetch(`${config.backend.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    const responseBody = await res.json();
    const user = responseBody.user;

    const newUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };

    setCurrentUser(newUser);
  }

  async function logout() {
    const res = await fetch(`${config.backend.API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
    setCurrentUser(null);
  }

  const value = {
    signup,
    login,
    currentUser,
    isAuthenticated: currentUser !== null,
    logout,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
