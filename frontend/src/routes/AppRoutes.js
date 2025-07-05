import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
import Register from '../pages/RegisterPage'; 
import Arena from '../pages/ArenaPage';
import Donjons from '../pages/DonjonsPage';
import Occupation from '../pages/OccupationPage';
import Codex from '../pages/CodexPage';
import Toa from '../pages/ToaPage';
import PatchNotes from '../pages/PatchNotesPage';
import DetailsPage from '../pages/DetailsPage';
import AdminPage from "../pages/AdminPage";
import LegalMentionsPage from '../pages/LegalMentionsPage';


function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/Register" element={<Register />} /> {/* Route pour Register */}
      <Route path="/" element={<App />} /> {/* Route pour la page d'accueil */}
      <Route path='/Arena' element={<Arena />} />
      <Route path='/donjons' element={<Donjons/>} />
      <Route path='/Occupation' element={<Occupation/>} />
      <Route path='/Codex' element={<Codex/>} />
      <Route path='/Toa' element={<Toa/>} />
      <Route path='/PatchNotes' element={<PatchNotes/>} />
      <Route path="/details/:groupIndex" element={<DetailsPage />} />
      <Route path='/legal-mentions' element={<LegalMentionsPage />} />

    </Routes>
  );
}

export default AppRoutes;  