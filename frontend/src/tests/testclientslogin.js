const fetch = require('node-fetch');

// Inscription
fetch('http://localhost:5000/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nom: 'John',
    prenom: 'Doe',
    pseudo: 'johndoe',
    email: 'john.doe@example.com',
    mot_de_passe: 'password123',
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log('Inscription:', data);
  })
  .catch((err) => console.error('Error:', err));

// Connexion
fetch('http://localhost:5000/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john.doe@example.com',
    mot_de_passe: 'password123',
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log('Connection:', data);
  })
  .catch((err) => console.error('Erreur:', err));
