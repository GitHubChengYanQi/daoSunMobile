import React from 'react';
import { NoticeBar } from 'antd-mobile';
import Tark from './component/Tark';


const Home = () => {


  const data = new Date();

  const time = data.getFullYear() + '年' + (data.getMonth() + 1) + '月' + data.getDate();

  let xq = '';
  switch (data.getDay()) {
    case 0 :
      xq = '星期日';
      break;
    case 1:
      xq = '星期一';
      break;
    case 2:
      xq = '星期二';
      break;
    case 3:
      xq = '星期三';
      break;
    case 4:
      xq = '星期四';
      break;
    case 5:
      xq = '星期五';
      break;
    case 6:
      xq = '星期六';
      break;
    default:
      break;
  }

  return (
    <>

      <NoticeBar
        icon
        content={
          <div>
            <span style={{ fontSize: 24 }}>{time}</span>
            {xq}
          </div>
        } color='default' />


      <Tark />
    </>
  );
};

export default Home;
