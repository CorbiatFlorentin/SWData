const fetch = require('node-fetch');

// Fonction pour s'inscrire
async function registerUser() {
  const response = await fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom: 'John',
      prenom: 'Doe',
      pseudo: 'johndoe',
      email: 'john.doe@example.com',
      mot_de_passe: 'password123',
    }),
  });

  const data = await response.json();
  console.log('Inscription:', data);
}

// Fonction pour se connecter
async function loginUser() {
  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john.doe@example.com',
      mot_de_passe: 'password123',
    }),
  });

  const data = await response.json();
  console.log('Connexion:', data);
}

// Tester les deux étapes dans l'ordre
async function testAPI() {
  console.log('Tentative d\'inscription...');
  await registerUser();

  console.log('Tentative de connexion...');
  await loginUser();
}

testAPI();
