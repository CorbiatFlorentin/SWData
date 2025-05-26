import React, { useEffect, useState } from 'react';
import axios from 'axios';
import isURL from 'validator/lib/isURL';
import escape from 'validator/lib/escape'; 
import '../assets/style/PatchNotes.css';

const PatchNotesPage = () => {
  const [articles, setArticles] = useState([]); // Stocke articles
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error State


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        //Call API backend
        const response = await axios.get('http://localhost:5000/api/patchnotes');
        setArticles(response.data); 
      } catch (err) {
        console.error('Error during fecth articles :', err);
        setError('Erreur lors du chargement des articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles(); 
  }, []);

  function isSafeUrl(url) {
    
    return isURL(url, { protocols: ['http','https'], host_whitelist: ['sw.com2us.com'], require_protocol: true });
  }

  return (
    <div className="page-container">
      <p>
        Bienvenue sur la page PatchNotes ! Ici, vous pouvez trouver toutes les informations
        pertinentes concernant les mises à jour du jeu.
      </p>

      <h2>Dernières mises à jour</h2>
      {loading && <p>Chargement des articles...</p>}
      {error   && <p className="error">{error}</p>}

      <div className="articles-container">
        {articles.length > 0 ? (
          articles.map((article, index) => {
            const safe = isSafeUrl(article.link);
             const title = escape(article.title);

            return (
              <div key={index} className="article-box" lang='fr'>
                {safe ? (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                ) : (
                  <span>{title} (lien invalide)</span>
                )}
              </div>
            );
          })
        ) : (
          !loading && <p>Aucun article trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default PatchNotesPage;
