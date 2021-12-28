import React from 'react';
import { SafeArea } from 'antd-mobile';
import Auth from '../components/Auth';

// import * as VConsole from 'vconsole';

function BasicLayout(props) {
  console.log(process.env);

  window.scrollTo(0, 0);

  // var vConsole = new VConsole();

  return (
    <>
      <Auth>
        <div style={{ height: '100vh' }}>
          <div style={{ backgroundColor: '#f4f4f4', marginBottom: '10vh' }}>
            {props.children}
          </div>
          <div>
            <SafeArea position='bottom' />
          </div>
        </div>
      </Auth>
    </>
  );
}

export default BasicLayout;
