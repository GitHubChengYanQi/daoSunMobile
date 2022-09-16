import React from 'react';
import { TextOutline } from 'antd-mobile-icons';
import style from './index.less';
import { CloudDownloadOutlined } from '@ant-design/icons';
import MyNavBar from '../../components/MyNavBar';
import { useLocation } from 'react-router-dom';
import InstockLog from './components/InstockLog';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import { message } from 'antd';
import OutstockLog from './components/OutstockLog';
import StocktakingLog from './components/StocktakingLog';
import ErrorLog from './components/ErrorLog';
import MaintenaceLog from './components/MaintenaceLog';
import AllocationLog from './components/AllocationLog';

export const createWord = { url: '/instockReceipt/createWord', method: 'POST' };

const OrderLog = () => {

  const { query } = useLocation();

  const { id, type, time, coding } = query;

  const { loading, run } = useRequest(createWord, {
    manual: true,
    onSuccess: () => {
      message.success('模板已发送，请注意查收');
    },
    onError: () => message.error('模板发送失败，请联系管理员'),
  });

  const typeContent = () => {
    switch (type) {
      case 'instockLog':
        return {
          title: '入库',
          content: <InstockLog receiptId={id} />,
        };
      case 'outstockLog':
        return {
          title: '出库',
          content: <OutstockLog outstockOrderId={id} />,
        };
      case 'inventoryLog':
        return {
          title: '盘点',
          content: <StocktakingLog inventoryTaskId={id} />,
        };
      case 'anomaly':
        return {
          title: '异常',
          content: <ErrorLog orderId={id} />,
        };
      case 'maintenanceLog':
        return {
          title: '养护',
          content: <MaintenaceLog maintenanceLogId={id} />,
        };
        case 'allocationLog':
        return {
          title: '养护',
          content: <AllocationLog allocationLogId={id} />,
        };
      default:
        return {
          title: 'xxx',
        };
    }
  };

  return <>
    <MyNavBar title={`${typeContent().title}单`} />
    <div className={style.header}>
      <div className={style.info}>
        <TextOutline />
        <div>
          <div>{coding}</div>
          <div className={style.time}>{time}</div>
        </div>
      </div>
      <CloudDownloadOutlined onClick={() => {
        let module = '';
        switch (type) {
          case 'instockLog':
            module = 'inStock';
            break;
          case 'outstockLog':
            module = 'outStock';
            break;
          case 'inventoryLog':
            module = 'stocktaking';
            break;
          case 'maintenanceLog':
            module = 'curing';
            break;
          case 'allocationLog':
            module = 'allocation';
            break;
          case 'anomaly':
            module = 'error';
            break;
          default:
            break;
        }
        run({ data: { receiptId: id, module } });
      }} />
    </div>

    <div style={{ height: 3 }} />

    {typeContent().content}

    {loading && <MyLoading />}
  </>;
};

export default OrderLog;
