import React, { useEffect, useRef, useState } from 'react';
import topStyle from '../../../global.less';
import { ToolUtil } from '../../../../util/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import ProcessList from '../ProcessList';
import MySearch from '../../../components/MySearch';
import { useModel } from 'umi';

export const myStart = {url:'/activitiProcessTask/LoginStart',method:'POST'}

const MyStart = () => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};
  const userInfo = state.userInfo || {};

  const [screen, { setTrue, setFalse }] = useBoolean();

  const [number, setNumber] = useState(0);

  const ref = useRef();

  useEffect(() => {
    ToolUtil.isObject(ref.current).submit({ createUser: userInfo.id });
  }, []);


  return <>
    <MySearch placeholder='请输入单据相关信息' historyType='process' />
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

    <ProcessList all api={myStart} setNumber={setNumber} listRef={ref} />
  </>;
};

export default MyStart;
