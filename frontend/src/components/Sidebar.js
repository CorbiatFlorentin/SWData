import React from 'react';
import './App.css'; 

function Sidebar() {
  const links = [
    { name: 'Your Custom Page', url: '/custom-page' },
    { name: 'Twitch', url: 'https://www.twitch.tv/'},
    { name: 'Coupons SW', url: 'https://swq.jp/l/fr-FR/'} 
  ];

  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target={link.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
