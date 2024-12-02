import React, { useState } from 'react';
import { useUser } from './UserContext'; 

const Register = () => {
  const { setUser } = useUser(); 
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

  // Gestion des champs pour le formulaire d'inscription
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  // Gestion des champs pour le formulaire de connexion
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Soumission du formulaire d'inscription
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      console.log('Reponse Object', response);

      let data;
      try {
        data = await response.json();
        console.log('Response JSON Parsed:', data);
      } catch (err) {
        console.error('Erreur lors de la conversion JSON:', err);
        console.log('Response Text:', await response.text());
        return;
      }
      
      if (response.ok) {
        alert('Inscription réussie');
        setUser({ pseudo: registerData.pseudo }); 
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  // Soumission du formulaire de connexion
  const handleLoginSubmit = async (e) => {
    console.log('Données envoyées pour /login:', loginData);

    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      console.log('Response Status:', response.status); 
      console.log('Response Headers:', response.headers); 

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        //alert('Connexion réussie');
        setUser({ pseudo: data.pseudo }); // Mettre à jour le contexte avec le pseudo retourné par le serveur
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
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


