import React from 'react';
import '../assets/style/LegalMentionsPage.css'; // Assure-toi que ce fichier existe

function LegalMentionsPage() {
  return (
    <main className="legal-mentions">
      <div className="legal-card">
        <h1>📄 Mentions légales</h1>

        <section>
          <h2>Éditeur du site</h2>
          <p><strong>Nom du projet :</strong> SWData</p>
          <p><strong>Responsable :</strong> Florentin Corbiat</p>
          <p><strong>Contact :</strong> florentin.corbiat@yahoo.fr</p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p><strong>Hébergeur :</strong> Railway (bientôt)</p>
          <p><strong>Adresse :</strong> railway_support@google.com</p>
          <p><strong>Téléphone :</strong> [Numéro de téléphone]</p>
        </section>

        <section>
          <h2>Données personnelles</h2>
          <p>
            Le site peut collecter certaines données personnelles (adresse e-mail, identifiants de connexion) uniquement dans le cadre de son fonctionnement.
            Ces données ne sont ni partagées, ni revendues. Elles sont conservées jusqu’à la suppression du compte utilisateur ou à la demande expresse.
          </p>
          <p>
            Conformément au RGPD, vous pouvez exercer vos droits d’accès, de modification ou de suppression en contactant : <strong>florentin.corbiat@teamrcm.fr</strong>.
          </p>
          <p>
            Si aucune activité n’est enregistrée depuis 2 ans, un protocole de suppression automatique est prévu selon la loi.
          </p>
        </section>

        <section>
          <h2>Modification</h2>
          <p>Ces mentions légales peuvent être modifiées à tout moment sans préavis.<br />Dernière mise à jour : 12 juin 2025.</p>
        </section>
      </div>
    </main>
  );
}

export default LegalMentionsPage;
