import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { useHistory, useLocation } from 'react-router-dom';
import StocktaskigAction
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskigAction';
import BottomButton from '../../../../components/BottomButton';
import MyNavBar from '../../../../components/MyNavBar';
import { ToolUtil } from '../../../../components/ToolUtil';
import { MyLoading } from '../../../../components/MyLoading';
import { Message } from '../../../../components/Message';
import MyEmpty from '../../../../components/MyEmpty';

export const positionInventory = { url: '/inventory/timely', method: 'POST' };
export const complete = { url: '/inventory/timelyAdd', method: 'POST' };

const PositionInventory = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

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
        history.push('/Work/Inventory/RealTimeInventory');
      });
    },
  });

  const { query } = useLocation();

  useEffect(() => {
    if (query.positionId) {
      run({ data: { positionId: query.positionId } });
    }
  }, []);


  const brandStatusChange = ({ skuId, brandId, positionId, status, anomalyId }) => {
    const newData = data.map(posiItem => {
      if (posiItem.storehousePositionsId === positionId) {
        const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
          if (skuItem.skuId === skuId) {
            const brandResults = ToolUtil.isArray(skuItem.brandResults).map(brandItem => {
              if (brandItem.brandId === brandId) {
                return { ...brandItem, inventoryStatus: status, anomalyId };
              } else {
                return brandItem;
              }
            });
            return { ...skuItem, brandResults, lockStatus: 0 };
          }
          return skuItem;
        });
        return { ...posiItem, skuResultList };
      }
      return posiItem;
    });
    setData(newData);
  };

  const skuReturnChange = (skus = [], status) => {
    const newData = data.map(posiItem => {
      const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
        let back = false;
        const brandResults = ToolUtil.isArray(skuItem.brandResults).map(brandItem => {
          const backSkus = skus.filter(item =>
            item.positionId === posiItem.storehousePositionsId && item.skuId === skuItem.skuId && item.brandId === brandItem.brandId,
          );
          if (backSkus.length > 0) {
            back = true;
            return { ...brandItem, inventoryStatus: status, anomalyId: status === 0 ? null : brandItem.anomalyId };
          } else {
            return brandItem;
          }
        });
        return { ...skuItem, brandResults, lockStatus: back ? 0 : skuItem.lockStatus };
      });
      return { ...posiItem, skuResultList };
    });
    setData(newData);
  };

  const skuStatusChange = ({ skuId, positionId, params = {} }) => {
    const newData = data.map(posiItem => {
      if (posiItem.storehousePositionsId === positionId) {
        const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
          if (skuItem.skuId === skuId) {
            return { ...skuItem, ...params };
          }
          return skuItem;
        });
        return { ...posiItem, skuResultList };
      }
      return posiItem;
    });
    setData(newData);
  };

  const stocktakings = data.filter((item) => {
    const skuResultList = item.skuResultList || [];
    const complete = skuResultList.filter(item => {
      return item.lockStatus === 98;
    });
    return complete.length !== skuResultList.length;
  });

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (data.length === 0){
    return <MyEmpty description='此库位木有物料' />
  }

  return <div style={{ height: '100%', backgroundColor: '#fff' }}>
    <MyNavBar title='即时盘点' />
    <StocktaskigAction
      temporaryLockRun={(data) => {
        skuStatusChange({
          skuId: data.skuId,
          positionId: data.positionId,
          params: {
            lockStatus: 98,
          },
        });
      }}
      errorReturn={skuReturnChange}
      addPhoto={(data) => {
        skuStatusChange({
          skuId: data.skuId,
          positionId: data.positionId,
          data: {
            enclosure: data.enclosure,
          },
        });
      }}
      refresh={(skuItem, error, anomalyId) => {
        if (skuItem) {
          brandStatusChange({
            skuId: skuItem.skuId,
            brandId: skuItem.brandId,
            positionId: skuItem.positionId,
            status: error,
            anomalyId: [2, -1].includes(error) && anomalyId,
          });
        }
      }}
      data={data}
      setData={setData}
      actionPermissions
      showStock
    />
    <div style={{ height: 60 }} />
    <BottomButton
      disabled={stocktakings.length > 0}
      only
      text='盘点完成'
      onClick={() => {
        const detailParams = [];
        data.forEach(positionItem => {
          const skuResultList = positionItem.skuResultList || [];
          skuResultList.forEach(skuItem => {
            const brandResults = skuItem.brandResults || [];
            brandResults.forEach(brandItem => {
              detailParams.push({
                inkindId: brandItem.inkind,
                status: brandItem.inventoryStatus,
                skuId: skuItem.skuId,
                brandId: brandItem.brand,
                positionId: positionItem.storehousePositionsId,
                number: brandItem.number,
                anomalyId: brandItem.anomalyId,
                enclosure: skuItem.enclosure,
                lockStatus: skuItem.lockStatus,
              });
            });
          });
        });
        completeRun({ data: { positionId:query.positionId,detailParams } });
      }}
    />

    {completeLoading && <MyLoading />}
  </div>;
};

export default PositionInventory;
