// eslint-disable-next-line no-use-before-define
import React, { useContext, useState, useEffect } from "react";

export interface User {
  email: string;
  password: string;
}

export interface Auth {
  currentUser: User | null;
}

export const AuthContext = React.createContext<Auth | any>({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  function login(email: string, password: string): User {
    const user: User = {
      email,
      password,
    };
    setCurrentUser(user);
    return user;
  }

  function logout() {
    setCurrentUser(undefined);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
