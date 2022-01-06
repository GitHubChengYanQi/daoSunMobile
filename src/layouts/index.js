import React from 'react';
import Auth from '../components/Auth';
// import * as VConsole from 'vconsole';

function BasicLayout(props) {

  window.scrollTo(0, 0);

  return (
    <Auth>
      <div style={{backgroundColor: '#f4f4f4' }}>
        <div style={{ marginBottom: '10vh' }}>
          {props.children}
        </div>
      </div>
    </Auth>
  );
}

export default BasicLayout;
