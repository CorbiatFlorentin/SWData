import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style/PatchNotes.css';

const PatchNotesPage = () => {
  const [articles, setArticles] = useState([]); // Stocker les articles récupérés
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Appel de l'API backend
        const response = await axios.get('http://localhost:5000/api/patchnotes');
        setArticles(response.data); // Met à jour les articles avec les données récupérées
      } catch (err) {
        console.error('Erreur lors de la récupération des articles :', err);
        setError('Erreur lors du chargement des articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles(); // Appel de la fonction
  }, []);

  return (
    <div className="page-container">
      <p>
        Bienvenue sur la page PatchNotes ! Ici, vous pouvez trouver toutes les informations
        pertinentes concernant les mises à jour du jeu.
      </p>

      <h2>Dernières mises à jour</h2>
      {loading && <p>Chargement des articles...</p>}
      {error && <p>{error}</p>}

      <div className="articles-container">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="article-box">
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </div>
          ))
        ) : (
          !loading && <p>Aucun article trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default PatchNotesPage;
