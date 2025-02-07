import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte utilisateur
const UserContext = createContext();

// Fournir le contexte utilisateur
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Vérifier si un token est stocké dans localStorage au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ pseudo: 'Utilisateur' }); // À adapter avec un vrai appel API
    }
  }, []);

  // Fonction de connexion (ajout du token)
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token); // Stocke le token pour persistance
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Supprime le token pour déconnexion
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pour consommer le contexte
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};

