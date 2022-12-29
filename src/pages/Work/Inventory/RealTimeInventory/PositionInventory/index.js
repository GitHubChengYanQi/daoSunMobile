import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { useHistory, useLocation } from 'react-router-dom';
import MyNavBar from '../../../../components/MyNavBar';
import { MyLoading } from '../../../../components/MyLoading';
import { Message } from '../../../../components/Message';
import StocktaskingHandle
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskingHandle';
import MyCard from '../../../../components/MyCard';
import style from '../index.less';
import { ToolUtil } from '../../../../components/ToolUtil';
import { ClockCircleOutline } from 'antd-mobile-icons';
import MyList from '../../../../components/MyList';
import { inventoryPageList } from '../index';
import { MyDate } from '../../../../components/MyDate';
import { storehousePositionsDetail } from '../../../../Scan/InStock/components/Url';

export const positionInventory = { url: '/inventory/timely', method: 'POST' };
export const complete = { url: '/inventory/timelyAdd', method: 'POST' };


const PositionInventory = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  const [logs, setLogs] = useState([]);

  const [empty, setEmpty] = useState();

  const { loading, run } = useRequest(positionInventory, {
    manual: true,
    onSuccess: (res) => {
      const skus = res || [];
      const newData = [];
      if (skus.length === 0) {
        setEmpty(true);
        setData([{
          positionId: query.positionId,
          name: query.name,
        }]);
        return;
      }
      const winHistory = window.history || {};
      const historyState = winHistory.state || {};
      ToolUtil.back({
        getContainer: document.getElementById('timelyInventory'),
        title: '盘点结果未提交，是否退出？',
        key: 'timelyInventory',
        disabled: historyState.title === 'timelyInventory',
      });
      skus.forEach(item => {
        const newPositionIds = newData.map(item => item.positionId);
        const newPositionIndex = newPositionIds.indexOf(item.positionId);
        if (newPositionIndex !== -1) {
          const newPosition = newData[newPositionIndex];
          newData[newPositionIndex] = { ...newPosition, skuResultList: [...newPosition.skuResultList, item] };
        } else {
          newData.push({
            positionId: item.positionId,
            name: ToolUtil.isObject(item.positionsResult).name,
            storehouseResult: ToolUtil.isObject(item.positionsResult).storehouseResult,
            skuResultList: [item],
          });
        }
      });
      setData(newData);
    },
  });

  const { loading: completeLoading, run: completeRun } = useRequest(complete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('盘点完成！', () => {
        history.go(-2);
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

  return <div id='timelyInventory' style={{ height: '100%', backgroundColor: '#fff', paddingBottom: 60 }}>
    <MyNavBar title='即时盘点' />
    <StocktaskingHandle
      anomalyType='timelyInventory'
      noSubmit={empty}
      showStock
      data={data}
      setData={setData}
      complete={() => {
        const stockParams = [];
        data.forEach(positionItem => {
          const skuResultList = positionItem.skuResultList || [];
          skuResultList.forEach(skuItem => {
            stockParams.push({
              status: skuItem.status,
              skuId: skuItem.skuId,
              positionId: positionItem.positionId,
              number: skuItem.number,
              realNumber: skuItem.realNumber,
              anomalyId: skuItem.anomalyId,
              lockStatus: skuItem.lockStatus,
              brandId: skuItem.brandId,
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
              return <div key={index} className={style.logData} onClick={() => {
                history.push(`/Work/Inventory/RealTimeInventory/Detail?inventoryTaskId=${item.inventoryTaskId}`);
              }}>
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
