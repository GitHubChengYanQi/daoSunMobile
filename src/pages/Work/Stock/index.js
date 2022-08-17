import React, { useRef, useState } from 'react';
import Icon, { ScanIcon } from '../../components/Icon';
import MyEmpty from '../../components/MyEmpty';
import style from './index.less';
import StockDetail, { shopCartShow } from './StockDetail';
import MyNavBar from '../../components/MyNavBar';
import MyTablBar from '../../components/MyTablBar';
import SkuShop from '../Instock/InstockAsk/coponents/SkuInstock/components/SkuShop';
import Dynamic from './Dynamic';
import Task from './Task';
import { useRequest } from '../../../util/Request';
import { ToolUtil } from '../../components/ToolUtil';
import { ERPEnums } from './ERPEnums';
import { MyLoading } from '../../components/MyLoading';
import { connect } from 'dva';
import TaskBottom from './Task/components/TaskBottom';
import Report from '../../Report';

const Stock = (props) => {

  const [key, setKey] = useState('stock');

  const shopRef = useRef();

  const ids = props.location.query;

  const [stockDetail, setStockDetail] = useState({});

  const [taskKey, setTaskKey] = useState();

  const tasks = [
    { text: '出库任务', key: ERPEnums.outStock },
    { text: '入库任务', key: ERPEnums.inStock },
  ];

  const { loading: getDefaultShop, refresh } = useRequest({
    ...shopCartShow,
    data: { types: [...tasks.map(item => item.key), ERPEnums.directInStock] },
  }, {
    onSuccess: (res) => {
      if (ToolUtil.isArray(res).length > 0) {
        if (!stockDetail.task) {
          setStockDetail({ ...stockDetail, task: res[res.length - 1] });
        }
      } else {
        setStockDetail({ ...stockDetail, task: null });
      }
    },
  });

  const content = () => {
    switch (key) {
      case 'stock':
        return <StockDetail
          refreshTask={refresh}
          tasks={tasks}
          storehousePositionsId={ids.storehousePositionsId}
          setTask={(task, judge) => {
            setStockDetail({ ...stockDetail, task, judge });
          }}
          setSkus={(skus, type) => {
            shopRef.current.jump(() => {
              setStockDetail({ ...stockDetail, skus, task: type });
            }, null);
          }}
          stockDetail={stockDetail}
        />;
      case 'Message':
        return <Task keyChange={setTaskKey} />;
      case 'report':
        return <Report />;
      case 'dynamic':
        return <Dynamic />;
      default:
        return <MyEmpty height='100%' />;
    }
  };

  const contentBottom = () => {
    switch (key) {
      case 'stock':
        const skus = stockDetail.skus || [];
        return stockDetail.task && <SkuShop
          shopRef={shopRef}
          switchType
          className={style.popup}
          noClose
          judge={stockDetail.judge}
          bottom={70}
          skus={skus}
          onDelete={() => {
            refresh();
          }}
          setSkus={(skus) => {
            setStockDetail({ ...stockDetail, skus });
          }}
          taskTypeChange={(task) => {
            setStockDetail({ ...stockDetail, task });
          }}
          type={stockDetail.task}
        />;
      case 'Message':
        return <TaskBottom taskKey={taskKey} />;
      default:
        return <></>;
    }
  };


  return <div className={style.pageIndex}>
    <MyNavBar title='仓储中心' />
    <div
      className={style.content}
    >
      {content()}
    </div>

    {contentBottom()}

    <MyTablBar
      className={style.tab}
      onChange={(key) => {
        switch (key) {
          case 'scan':
            props.dispatch({
              type: 'qrCode/wxCpScan',
            });
            return;
          default:
            setStockDetail({ ...stockDetail, task: null });
            setKey(key);
            return;
        }
      }}
      activeKey={key}
      tabBarItems={
        [{
          title: '仓储',
          key: 'stock',
          icon: <Icon type='icon-cangchu' />,
        }, {
          title: '任务',
          key: 'Message',
          icon: <Icon type='icon-xiaoxi2' />,
        }, {
          key: 'scan',
          icon: <ScanIcon />,
          className: style.scan,
        }, {
          title: '报表',
          key: 'report',
          icon: <Icon type='icon-baobiao1' />,
        }, {
          title: '动态',
          key: 'dynamic',
          icon: <Icon type='icon-dongtai' />,
        }]
      } />

    {getDefaultShop && <MyLoading />}
  </div>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Stock);
