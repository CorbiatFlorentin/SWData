import React from 'react';
import './App.css'; 

function Sidebar() {
  const links = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com' },
    { name: 'Your Custom Page', url: '/custom-page' },
    { name: 'Twitch', url: 'https://https://fr.www.twitch.tv'},
    { name: 'Coupons SW', url: 'https://swq.jp/l/fr-FR/'} 
  ];

  return (
    <div className="sidebar">
      <h3>Navigation</h3>
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
