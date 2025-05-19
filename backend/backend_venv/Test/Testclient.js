async function testerEndpoint(path, payload) {
  const url = `http://localhost:5000${path}`;
  console.log(`\n=== TEST ${path} ===`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('Status :', res.status);
    const contentType = res.headers.get('content-type') || '';
    console.log('Content-Type :', contentType);

    const text = await res.text();
    console.log('Body reçu (début) :\n', text.slice(0, 200));

 
    if (contentType.includes('application/json')) {
      try {
        const data = JSON.parse(text);
        console.log('✅ Réponse JSON parsée :', data);
      } catch (err) {
        console.error('❌ Erreur de parsing JSON :', err.message);
      }
    } else {
      console.error('❌ Réponse non JSON');
    }
  } catch (err) {
    console.error('❌ Erreur requête/fetch :', err.message);
  }
}

(async () => {
  // 1. Inscription sur /auth/register
  await testerEndpoint('/auth/register', {
    nom: 'John',
    prenom: 'Doe1',
    pseudo: 'johndoe1',
    email: 'john.doe1@example.com',
    mot_de_passe: 'password123',
  });

  // 2. Connexion sur /auth/login
  await testerEndpoint('/auth/login', {
    email: 'john.doe1@example.com',
    mot_de_passe: 'password123',
  });
})();
