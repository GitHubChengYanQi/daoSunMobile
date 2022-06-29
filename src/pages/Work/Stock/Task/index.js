import React, { useRef, useState } from 'react';
import { Tabs } from 'antd-mobile';
import style from './index.less';
import MySearch from '../../../components/MySearch';
import { ReceiptsEnums } from '../../../Receipts';
import MyList from '../../../components/MyList';
import InStockTask from './components/InStockTask';
import { ToolUtil } from '../../../components/ToolUtil';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import topStyle from '../../../global.less';
import { useBoolean } from 'ahooks';
import OutStockTask from './components/OutStockTask';
import StocktakingTask from './components/StocktakingTask';

export const processTask = { url: '/activitiProcessTask/auditList', method: 'POST' };

const Task = (
  {
    activeKey,
    keyChange=()=>{},
    top,
  },
) => {

  const [key, setKey] = useState(activeKey || ReceiptsEnums.instockOrder);

  const [data, setData] = useState([]);

  const [number, setNumber] = useState();

  const tabs = [
    { title: '调拨任务', key: 'allocation' },
    { title: '出库任务', key: ReceiptsEnums.outstockOrder },
    { title: '入库任务', key: ReceiptsEnums.instockOrder },
    { title: '养护任务', key: 'curing' },
    { title: '盘点任务', key: ReceiptsEnums.stocktaking },
  ];

  const content = () => {
    switch (key) {
      case 'allocation':
        return <></>;
      case ReceiptsEnums.outstockOrder:
        return <OutStockTask data={data} setData={setData} />;
      case ReceiptsEnums.instockOrder:
        return <InStockTask data={data} setData={setData} />;
      case 'curing':
        return <></>;
      case ReceiptsEnums.stocktaking:
        return <StocktakingTask data={data} />
      default:
        return <></>;
    }
  };

  const [screen, { setTrue, setFalse }] = useBoolean();

  const ref = useRef();

  return <div>
    <MySearch placeholder='请输入物料相关信息' />
    <div hidden={activeKey}>
      <Tabs activeKey={key} onChange={(key) => {
        setKey(key);
        keyChange(key);
        ref.current.submit({ type: key });
      }} className={style.tab}>
        {
          tabs.map((item) => {
            return <Tabs.Tab {...item} />;
          })
        }
      </Tabs>
    </div>

    <div className={topStyle.top} style={{top}}>
      <div
        className={topStyle.screen}
        style={{ borderBottom: 'solid 1px #F5F5F5' }}
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
        <div className={topStyle.stockNumber}>单据：<span>{number}</span></div>
        <div
          className={ToolUtil.classNames(topStyle.screenButton, screen ? topStyle.checked : '')}
        >
          筛选 {screen ? <CaretUpFilled /> : <CaretDownFilled />}
        </div>
      </div>
    </div>


    <MyList
      ref={ref}
      api={processTask}
      data={data}
      getData={setData}
      params={{ type: activeKey || ReceiptsEnums.instockOrder }}
      response={(res) => {
        setNumber(res.count);
      }}
    >
      {content()}
    </MyList>

  </div>;
};

export default Task;
