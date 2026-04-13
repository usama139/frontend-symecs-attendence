import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/institute_logo.jpg" alt="Institute Logo" className="header-logo" />
        <div>
          <h1 className="gradient-text header-title">Sardar Yaseen Malik Institute of Information Technology, Mirpurkhas</h1>
          <p className="header-subtitle">Developed by <strong>Usama Ali HOD computer Symecs</strong></p>
        </div>
      </div>
    </header>
  );
};

export default Header;
