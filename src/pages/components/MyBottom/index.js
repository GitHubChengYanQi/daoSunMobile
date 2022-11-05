import React from 'react';
import MyNavBar from '../MyNavBar';

const MyBottom = ({ children, leftActuions, buttons,noBottom }) => {


  return <>
    <div style={{ minHeight: `100vh` }}>
      {children}
    </div>
    <div hidden={noBottom} id='bottom' style={{
      position: 'sticky',
      bottom: 0,
      zIndex: 999,
      boxShadow: 'rgb(0, 0, 0,0.1) 0px -4px 10px',
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
  </>;
};

export default MyBottom;
