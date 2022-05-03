import React, { useEffect, useState } from 'react';

const MyBottom = ({ children, leftActuions, buttons,noBottom }) => {

  const [bottomHeight, seBottomHeight] = useState(0);

  useEffect(() => {
    if (document.getElementById('bottom')) {
      const height = document.getElementById('bottom').clientHeight;
      seBottomHeight(height);
    }
  }, []);

  return <div>
    <div style={{ minHeight: `100vh` }}>
      {children}
    </div>
    <div hidden={noBottom} id='bottom' style={{
      position: 'sticky',
      bottom: 0,
      zIndex: 999,
      boxShadow: 'rgb(24, 69, 181,0.1) 0px 0px 10px',
      backgroundColor: '#fff',
      padding: 8,
    }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {leftActuions}
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
          {buttons}
        </div>
      </div>
    </div>
  </div>;
};

export default MyBottom;
