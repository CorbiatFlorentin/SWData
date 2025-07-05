import React from 'react';
import '../assets/style/App.css'; 


function Sidebar() {
  const links = [
    { name: 'Twitch', url: 'https://www.twitch.tv/'},
    { name: 'Coupons SW', url: 'https://swq.jp/l/fr-FR/'}, 
    { name: 'Mentions légales', url: '/legal-mentions' }
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
