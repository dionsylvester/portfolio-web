import React from 'react';
import './divider.css';

const divider = ({theme, setTheme}) => {
  const toggle_mode = () => {
    theme == 'light' ? setTheme('dark') : setTheme('light');
  }

  return (
    <div className="divider"></div>
  );
};

export default divider;