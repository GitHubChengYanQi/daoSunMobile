import React, { useState } from 'react';
import style from './index.less';
import { ToolUtil } from '../../../../../components/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { Tabs } from 'antd-mobile';
import { useBoolean } from 'ahooks';
import PurchaseOrder from './components/PurchaseOrder';
import MyEmpty from '../../../../../components/MyEmpty';
import SplitDiv from '../../../../../components/SplitDiv';

const ReceiptsInstock = () => {

  const [key, setKey] = useState('purchase');

  const [screen, { setTrue, setFalse }] = useBoolean();

  const content = () => {
    switch (key) {
      case 'purchase':
        return <PurchaseOrder type={key} />;
      case 'production':
        return <MyEmpty />;
      case 'outSku':
        return <MyEmpty />;
      case 'outItem':
        return <MyEmpty />;
      default:
        return <MyEmpty />;
    }
  };

  return <div style={{ height: '100%' }}>
    <SplitDiv overflow='auto' id='receiptsInstock'>
      <div>
        <div className={style.screen}>
          <div className={style.stockNumber}>数量：<span>{0}</span></div>
          <div
            className={ToolUtil.classNames(style.screenButton, screen ? style.checked : '')}
            onClick={() => {
              if (screen) {
                setFalse();
              } else {
                setTrue();
              }
            }}>
            筛选 {screen ? <CaretUpFilled /> : <CaretDownFilled />}
          </div>
        </div>
        <Tabs activeKey={key} onChange={setKey} className={style.tab}>
          <Tabs.Tab title='采购订单' key='purchase' />
          <Tabs.Tab title='生产完工单' key='production' />
          <Tabs.Tab title='退料单' key='outSku' />
          <Tabs.Tab title='退货单' key='outItem' />
        </Tabs>
      </div>

      {content()}
    </SplitDiv>
  </div>;
};

export default ReceiptsInstock;
