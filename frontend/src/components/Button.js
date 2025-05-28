import React from 'react';


const Button = ({ onClick, direction, label }) => {
  return (
    <button className={`button ${direction}`} onClick={onClick} type="button">
      <i
        className={`fa-solid fa-arrow-${direction === 'prev' ? 'left' : 'right'}`}
        aria-hidden="true"
      ></i>
      <span className="sr-only">{label}</span> {/* Txt for help*/}
    </button>
  );
};

export default Button;
