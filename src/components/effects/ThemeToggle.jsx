import React from 'react';
import { motion } from 'motion/react';

const ThemeToggle = ({ isDark, onClick, logoLight, logoDark }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle theme"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <motion.div
        initial={{ rotate: isDark ? 0 : -180 }}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <img 
          src={isDark ? logoDark : logoLight} 
          alt={isDark ? "Switch to Light mode" : "Switch to Dark mode"} 
          className='icon-mode'
          style={{ pointerEvents: 'none' }}
        />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;