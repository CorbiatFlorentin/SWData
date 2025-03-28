import React, { useState } from 'react';
import { useUser } from '../UserContext'; 

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

  const [emailReset, setEmailReset] = useState('');

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

  // Gestion des champs pour la réinitialisation de mot de passe
  const handleResetChange = (e) => {
    setEmailReset(e.target.value);
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

      const data = await response.json();
      if (response.ok) {
        alert('Inscription réussie');
        setUser({ pseudo: registerData.pseudo }); 
        localStorage.setItem('token', data.token); // Stocker le token
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  // Soumission du formulaire de connexion
  // Connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
  
      const data = await response.json();
      if (response.ok) {
        login({ pseudo: data.pseudo }, data.token); // Utilisation correcte de login
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };
  


  // Soumission du formulaire de réinitialisation de mot de passe
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailReset })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Un email de réinitialisation a été envoyé');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  };

  // Suppression de compte
  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
        try {
            const token = localStorage.getItem('token'); // Récupération du token JWT depuis le stockage local
            if (!token) {
                alert('Vous devez être connecté pour supprimer votre compte.');
                return;
            }

            const response = await fetch('http://localhost:5000/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envoi du token dans l'en-tête
                }
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.error);
                return;
            }

            alert('Compte supprimé avec succès');
            setUser(null); // Déconnexion
            localStorage.removeItem('token'); // Suppression du token local
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
        }
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
          <button onClick={handleDeleteAccount} className="delete-account-btn">Supprimer mon compte</button>
          <h3>Mot de passe oublié ?</h3>
          <form onSubmit={handleResetSubmit} className="reset-form">
            <input type="email" placeholder="Email" onChange={handleResetChange} required />
            <button type="submit">Réinitialiser</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

