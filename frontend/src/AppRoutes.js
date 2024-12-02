import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Register from './Register'; // Vérifie que cet import est correct
import Arena from './ArenaPage';
import Donjons from './DonjonsPage';
import Occupation from './OccupationPage';
import Codex from './CodexPage';
import Toa from './ToaPage';
import PatchNotes from './PatchNotesPage';


function AppRoutes() {
  return (
    <Routes>
      <Route path="/Register" element={<Register />} /> {/* Route pour Register */}
      <Route path="/" element={<App />} /> {/* Route pour la page d'accueil */}
      <Route path='/Arena' element={<Arena />} />
      <Route path='/donjons' element={<Donjons/>} />
      <Route path='/Occupation' element={<Occupation/>} />
      <Route path='/Codex' element={<Codex/>} />
      <Route path='/Toa' element={<Toa/>} />
      <Route path='/PatchNotes' element={<PatchNotes/>} />

    </Routes>
  );
}

export default AppRoutes;  