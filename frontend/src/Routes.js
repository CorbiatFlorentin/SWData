import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App'; // Importez le composant contenant le slider
import Navbar from './Navbar';
import ArenaPage from './ArenaPage';
import OccupationPage from './OccupationPage';
import DonjonsPage from './DonjonsPage';
import ToaPage from './ToaPage';
import CodexPage from './CodexPage';
import PatchNotesPage from './PatchNotesPage';

function AppRoutes() {
  return (
    <div>
    <Navbar />
    <Routes>
      <Route path="/" element={<App />} /> {/* Page avec le slider */}
      <Route path="/arena" element={<ArenaPage />} />
      <Route path="/occupation" element={<OccupationPage />} />
      <Route path="/donjons" element={<DonjonsPage />} />
      <Route path="/toa" element={<ToaPage />} />
      <Route path="/codex" element={<CodexPage />} />
      <Route path="/patch-notes" element={<PatchNotesPage />} />
    </Routes>
    </div>
  );
}

export default AppRoutes;

