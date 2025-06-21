import React, { useState } from 'react';
import { useUser } from '../UserContext'; 
import isEmail from 'validator/lib/isEmail';
import escape from 'validator/lib/escape';

const Register = () => {
  const { setUser, login } = useUser(); 

  const [registerData, setRegisterData] = useState({
    nom: '',
    prenom: '',
    pseudo: '',
    email: '',
    mot_de_passe: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    mot_de_passe: ''
  });

  const validateRegisterForm = () => {
    const { nom, prenom, pseudo, email, mot_de_passe } = registerData;
    if (!nom || !prenom || !pseudo || !email || !mot_de_passe) return false;
    if (!isEmail(email)) return false;
    if (mot_de_passe.length < 8) return false;
    return true;
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: escape(value) });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: escape(value) });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) {
      return alert('Veuillez remplir tous les champs correctement.');
    }
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        alert('Inscription réussie');
        setUser({ pseudo: registerData.pseudo });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        login({ pseudo: data.pseudo }, data.token);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-section register-section">
          <h2>Créer un compte</h2>
          <form onSubmit={handleRegisterSubmit} className="register-form">
            <input type="text" name="nom" placeholder="Nom" onChange={handleRegisterChange} required />
            <input type="text" name="prenom" placeholder="Prénom" onChange={handleRegisterChange} required />
            <input type="text" name="pseudo" placeholder="Pseudo" onChange={handleRegisterChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleRegisterChange} required />
            <input type="password" name="mot_de_passe" placeholder="Mot de passe" onChange={handleRegisterChange} required />
            <button type="submit">S'inscrire</button>
          </form>
        </div>

        <div className="auth-section login-section">
          <h2>Se connecter</h2>
          <form onSubmit={handleLoginSubmit} className="register-form">
            <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} required />
            <input type="password" name="mot_de_passe" placeholder="Mot de passe" onChange={handleLoginChange} required />
            <button type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
