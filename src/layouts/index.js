import React from 'react';
import Auth from '../components/Auth';
import safeAreaInsets from 'safe-area-insets';
// import * as VConsole from 'vconsole';

function BasicLayout(props) {

  window.scrollTo(0, 0);

  // var vConsole = new VConsole();

  console.log('safe-area-inset-top', safeAreaInsets.top)
  console.log('safe-area-inset-bottom', safeAreaInsets.bottom)


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
