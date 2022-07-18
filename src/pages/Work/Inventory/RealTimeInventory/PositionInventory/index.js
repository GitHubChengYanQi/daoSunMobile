import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { useHistory, useLocation } from 'react-router-dom';
import MyNavBar from '../../../../components/MyNavBar';
import { MyLoading } from '../../../../components/MyLoading';
import { Message } from '../../../../components/Message';
import MyEmpty from '../../../../components/MyEmpty';
import StocktaskingHandle
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskingHandle';
import MyCard from '../../../../components/MyCard';
import style from '../index.less';
import { ToolUtil } from '../../../../components/ToolUtil';
import { ClockCircleOutline } from 'antd-mobile-icons';
import MyList from '../../../../components/MyList';
import { inventoryPageList } from '../index';
import { MyDate } from '../../../../components/MyDate';

export const positionInventory = { url: '/inventory/timely', method: 'POST' };
export const complete = { url: '/inventory/timelyAdd', method: 'POST' };

const PositionInventory = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const [logs, setLogs] = useState([]);

  const { loading, run } = useRequest(positionInventory, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const { loading: completeLoading, run: completeRun } = useRequest(complete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('盘点完成！', () => {
        history.goBack();
      });
    },
    onError: () => {
      Message.errorToast('盘点失败！');
    },
  });

  const { query } = useLocation();

  useEffect(() => {
    if (query.positionId) {
      run({ data: { positionId: query.positionId } });
    }
  }, []);


  if (loading) {
    return <MyLoading skeleton />;
  }

  if (data.length === 0) {
    return <MyEmpty description='此库位木有物料' />;
  }

  return <div style={{ height: '100%', backgroundColor: '#fff' }}>
    <MyNavBar title='即时盘点' />
    <StocktaskingHandle
      anomalyType='timelyInventory'
      showStock
      data={data}
      setData={setData}
      actionPermissions
      complete={() => {
        const stockParams = [];
        data.forEach(positionItem => {
          const skuResultList = positionItem.skuResultList || [];
          skuResultList.forEach(skuItem => {
            stockParams.push({
              status: skuItem.inventoryStatus,
              skuId: skuItem.skuId,
              positionId: positionItem.storehousePositionsId,
              number: skuItem.stockNumber,
              anomalyId: skuItem.anomalyId,
              lockStatus: skuItem.lockStatus,
            });
          });
        });
        completeRun({ data: { positionId: query.positionId, stockParams } });
      }} />

    <MyCard title='库位盘点记录'>
      <MyList api={inventoryPageList} params={{ positionId: query.positionId }} getData={setLogs} data={logs}>
        <div className={style.logs}>
          {
            logs.map((item, index) => {
              return <div key={index} className={style.logData}>
                <div>
                  盘点人员：{ToolUtil.isObject(item.user).name}
                </div>
                <div>
                  <ClockCircleOutline /> {MyDate.Show(item.createTime)}
                </div>
              </div>;
            })
          }
        </div>
      </MyList>
    </MyCard>

    {completeLoading && <MyLoading />}
  </div>;
};

export default PositionInventory;
