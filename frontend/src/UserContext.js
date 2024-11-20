import React, { createContext, useContext, useState } from 'react';

// Créer le contexte utilisateur
const UserContext = createContext();

// Fournir le contexte utilisateur
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialiser l'utilisateur à null

  return (
    <UserContext.Provider value={{ user, setUser }}>
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

