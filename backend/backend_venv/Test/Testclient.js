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
        console.log('✅ JSON Answer:', data);
      } catch (err) {
        console.error('❌ Error  parsing JSON :', err.message);
      }
    } else {
      console.error('❌ Response non JSON');
    }
  } catch (err) {
    console.error('❌ Error request/fetch :', err.message);
  }
}

(async () => {
  await testerEndpoint('/auth/register', {
    nom: 'John',
    prenom: 'Doe1',
    pseudo: 'johndoe1',
    email: 'john.doe1@example.com',
    mot_de_passe: 'password123',
  });

  await testerEndpoint('/auth/login', {
    email: 'john.doe1@example.com',
    mot_de_passe: 'password123',
  });
})();
