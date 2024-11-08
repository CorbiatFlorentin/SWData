import React, { useState } from 'react';



const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    pseudo: '',
    email: '',
    mot_de_passe: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="register-form">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
        <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
        <input type="text" name="pseudo" placeholder="Pseudo" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="mot_de_passe" placeholder="Mot de passe" onChange={handleChange} required />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;

