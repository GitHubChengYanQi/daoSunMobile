import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { useHistory, useLocation } from 'react-router-dom';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import style from './index.less';
import StocktaskingHandle
  from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskingHandle';
import { MyLoading } from '../../../components/MyLoading';
import Icon from '../../../components/Icon';
import { inventoryComplete } from '../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking';
import { Message } from '../../../components/Message';

export const taskList = { url: '/inventoryStock/taskList', method: 'POST' };

const StartStockTaking = () => {

  const { query } = useLocation();

  const history = useHistory();

  const [data, setData] = useState([]);
  console.log(data);

  const { loading: getTaskLoading, run: getTaskList } = useRequest(taskList, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const { loading, run } = useRequest(inventoryComplete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('提交成功！', () => {
        history.goBack();
      });
    },
  });

  useEffect(() => {
    if (query.id) {
      getTaskList({ data: { inventoryId: query.id } });
    }
  }, []);

  const [sort, setSort] = useState({});

  const sortAction = (field) => {
    let order = 'descend';
    if (sort.field === field) {
      switch (sort.order) {
        case 'ascend':
          order = '';
          break;
        case 'descend':
          order = 'ascend';
          break;
        default:
          order = 'descend';
          break;
      }
    }
    setSort({ field, order });
  };

  const sortShow = (field) => {

    if (sort.field !== field) {
      return <Icon type='icon-paixu' />;
    }

    const order = sort.order;

    switch (order) {
      case  'ascend' :
        return <Icon type='icon-paixubeifen' />;
      case  'descend' :
        return <Icon type='icon-paixubeifen2' />;
      default:
        return <Icon type='icon-paixu' />;
    }
  };

  if (!query.id) {
    return <MyEmpty />;
  }

  if (getTaskLoading) {
    return <MyLoading skeleton />;
  }

  return <div style={{ backgroundColor: '#fff', height: '100%' }}>
    <MyNavBar title='盘点任务' />
    <MySearch />
    <div className={style.header}>
      <div className={style.number}>涉及 <span className='blue'>{data.length}</span> 个库位 <span className='blue'>22</span>类物料
      </div>
      <div className={style.screen}>
        <div onClick={() => {
          sortAction('position');
        }}>
          库位 {sortShow('position')}
        </div>
        <div>
          状态
        </div>
      </div>
    </div>

    <StocktaskingHandle
      inventoryTaskId={query.id}
      anomalyType='StocktakingError'
      showStock={query.showStock === '1'}
      data={data}
      setData={setData}
      actionPermissions
      complete={() => {
        run({ data: { inventoryIds: [query.id] } });
      }} />

    {loading && <MyLoading />}
  </div>;
};

export default StartStockTaking;
