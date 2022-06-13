import React, { useState } from 'react';
import topStyle from '../../../global.less';
import { ToolUtil } from '../../../components/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import ProcessList from '../ProcessList';
import MySearch from '../../../components/MySearch';


const MyStart = () => {


  const [screen, { setTrue, setFalse }] = useBoolean();

  const [number, setNumber] = useState(0);

  return <>
    <MySearch placeholder='请输入相关单据信息' historyType='process' />
    <div className={topStyle.top} style={{ top: ToolUtil.isQiyeWeixin() ? 0 : 45 }}>
      <div
        className={topStyle.screen}
        id='screen'
        onClick={() => {
          if (screen) {
            setFalse();
          } else {
            document.getElementById('screen').scrollIntoView();
            setTrue();
          }
        }}
      >
        <div className={topStyle.stockNumber}>数量：<span>{number}</span></div>
        <div
          className={ToolUtil.classNames(topStyle.screenButton, screen ? topStyle.checked : '')}
        >
          筛选 {screen ? <CaretUpFilled /> : <CaretDownFilled />}
        </div>
      </div>
    </div>

    <ProcessList setNumber={setNumber} />
  </>;
};

export default MyStart;
