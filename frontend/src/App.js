import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Button from './Button';
import arenaImage from './Img/Arena.jpeg';
import occupationImage from './Img/Occupation.jpeg';
import donjonsImage from './Img/Donjons.jpeg';
import toaImage from './Img/Toa.jpeg';
import codexImage from './Img/Codex.jpeg';
import patchNotesImage from './Img/PatchNotes.jpeg';
import Sidebar from './Sidebar';


function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [items] = useState([
    { id: 1, name: 'Arena', description: 'Lorem ipsum dolor...', image: arenaImage, page: '/arena' },
    { id: 2, name: 'Occupation', description: 'Lorem ipsum dolor...', image: occupationImage, page: '/occupation' },
    { id: 3, name: 'Donjons', description: 'Lorem ipsum dolor...', image: donjonsImage, page: '/donjons' },
    { id: 4, name: 'Toa', description: 'Lorem ipsum dolor...', image: toaImage, page: '/toa' },
    { id: 5, name: 'Codex', description: 'Lorem ipsum dolor...', image: codexImage, page: '/codex' },
    { id: 6, name: 'PatchNotes', description: 'Lorem ipsum dolor...', image: patchNotesImage, page: './PatchNotes' }
  ]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const navigate = useNavigate();

  return (
    <div>
      <Sidebar />
      <div className="container">
        <div className="slide">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`item ${index === currentIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="content">
                <div className="name">{item.name}</div>
                <div className="des">{item.description}</div>
                <button
                  className="see-more"
                  onClick={() => navigate(item.page)}  // Naviguer vers la page spécifique
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="button-container">
          <Button onClick={prevSlide} direction="prev" label="Previous slide" />
          <Button onClick={nextSlide} direction="next" label="Next slide" />
        </div>
      </div>
    </div>
  );
}

export default App;

