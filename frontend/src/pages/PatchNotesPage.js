import React, { useEffect, useState } from 'react';
import axios from 'axios';
import isURL from 'validator/lib/isURL';
import escape from 'validator/lib/escape'; 
import '../assets/style/PatchNotes.css';

const PatchNotesPage = () => {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const API = process.env.REACT_APP_API_BASE;
 


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API}/patchnotes`); 
        setArticles(response.data); 
      } catch (err) {
        console.error('Error during fecth articles :', err);
        setError('Erreur lors du chargement des articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles(); 
  }, [API]);
  console.log("API endpoint:", API);
  

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
