// AuthContext.js
import React, { useEffect, useState, createContext, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';

export const AuthContext = createContext({ user: null });



export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('User signed out');
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

