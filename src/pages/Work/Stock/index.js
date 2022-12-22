import React, { useRef, useState } from 'react';
import Icon, { ScanIcon } from '../../components/Icon';
import MyEmpty from '../../components/MyEmpty';
import style from './index.less';
import StockDetail, { shopCartShow } from './StockDetail';
import MyNavBar from '../../components/MyNavBar';
import MyTablBar from '../../components/MyTablBar';
import SkuShop from '../AddShop/components/SkuShop';
import Dynamic from './Dynamic';
import Task from './Task';
import { useRequest } from '../../../util/Request';
import { ToolUtil } from '../../components/ToolUtil';
import { ERPEnums } from './ERPEnums';
import { MyLoading } from '../../components/MyLoading';
import { connect } from 'dva';
import TaskBottom from './Task/components/TaskBottom';
import Report from '../../Report';
import KeepAlive from '../../../components/KeepAlive';


export const StockContent = connect(({ qrCode }) => ({ qrCode }))((
  props,
) => {

  const [key, setKey] = useState('stock');

  const shopRef = useRef();

  const [scrollTop, setScrollTop] = useState(0);

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
        return <Task stock />;
      case 'report':
        return <Report />;
      case 'dynamic':
        return <Dynamic />;
      default:
        return <MyEmpty height='100%' />;
    }
  };

  let contentBottom = <></>;
  switch (key) {
    case 'stock':
      const skus = stockDetail.skus || [];
      contentBottom = stockDetail.task ? <SkuShop
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
      /> : <></>;
      break;
    case 'Message':
      contentBottom = <TaskBottom taskKey={taskKey} />;
      break;
    default:
      break;
  }

  return <div className={style.pageIndex} style={{
    scrollMarginTop: scrollTop,
  }}>
    <MyNavBar title='仓储中心' />
    <div
      id='content'
      className={style.content}
      onScroll={(event) => {
        setScrollTop(event.target.scrollTop);
      }}
    >
      {content()}
    </div>

    {contentBottom}

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
});

const Stock = () => {
  return <KeepAlive id='stock' contentId='content'>
    <StockContent />
  </KeepAlive>;
};

export default Stock;
