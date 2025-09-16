import React from 'react';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = ({ isLightMode, setIsLightMode }) => {
  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.body.classList.toggle('light-mode', !isLightMode);
  };

  return (
    <button
      className={`theme-toggle ${isLightMode ? 'light-mode' : ''}`}
      onClick={toggleTheme}
      title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
      <span className="theme-label">
        {isLightMode ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;

