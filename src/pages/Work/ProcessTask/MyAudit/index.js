import React, { useRef, useState } from 'react';
import { ToolUtil } from '../../../components/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { Tabs } from 'antd-mobile';
import { useBoolean } from 'ahooks';

import topStyle from '../../../global.less';
import ProcessList from '../ProcessList';
import MySearch from '../../../components/MySearch';


const MyAudit = () => {

  const [screen, { setTrue, setFalse }] = useBoolean();

  const [key, setKey] = useState('wait');

  const [number, setNumber] = useState(0);

  const listRef = useRef();

  return <>
    <MySearch placeholder='请输入相关单据信息' historyType='process' />
    <div className={topStyle.top} style={{ top: ToolUtil.isQiyeWeixin() ? 0 : 45 }}>
      <Tabs activeKey={key} onChange={(key) => {
        const ref = listRef.current;
        switch (key) {
          case 'wait':
            ref.submit({ auditType: 'audit', status: 0 });
            break;
          case 'processed':
            ref.submit({ auditType: 'audit', status: 99 });
            break;
          case 'send':
            ref.submit({ auditType: 'send' });
            break;
          default:
            break;
        }
        setKey(key);
      }} className={topStyle.tab}>
        <Tabs.Tab title='待处理' key='wait' />
        <Tabs.Tab title='已处理' key='processed' />
        <Tabs.Tab title='抄送我' key='send' />
      </Tabs>
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

    <ProcessList setNumber={setNumber} listRef={listRef} />

  </>;
};

export default MyAudit;
