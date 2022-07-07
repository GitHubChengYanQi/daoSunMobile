import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { useLocation } from 'react-router-dom';
import StocktaskigAction from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/Stocktaking/components/StocktaskigAction';
import BottomButton from '../../../../components/BottomButton';
import MyNavBar from '../../../../components/MyNavBar';
import { ToolUtil } from '../../../../components/ToolUtil';

export const positionInventory = { url: '/inventory/timely', method: 'POST' };

const PositionInventory = () => {

  const [data, setData] = useState([]);

  const { run } = useRequest(positionInventory, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const { query } = useLocation();

  useEffect(() => {
    if (query.positionId) {
      run({ data: { positionId: query.positionId } });
    }
  }, []);


  const brandStatusChange = ({ skuId, brandId, positionId, status }) => {
    const newData = data.map(posiItem => {
      if (posiItem.storehousePositionsId === positionId) {
        const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
          if (skuItem.skuId === skuId) {
            const brandResults = ToolUtil.isArray(skuItem.brandResults).map(brandItem => {
              if (brandItem.brandId === brandId) {
                return { ...brandItem, inventoryStatus: status };
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

  const skuStatusChange = ({ skuId, positionId, status }) => {
    const newData = data.map(posiItem => {
      if (posiItem.storehousePositionsId === positionId) {
        const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
          if (skuItem.skuId === skuId) {
            return { ...skuItem, lockStatus: status };
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

  return <>
    <MyNavBar title='即时盘点' />
    <StocktaskigAction
      temporaryLockRun={(data) => {
        skuStatusChange({
          skuId: data.skuId,
          positionId: data.positionId,
          status: 98,
        });
      }}
      addPhoto={(data) => {
        console.log(data);
      }}
      refresh={(skuItem, error) => {
        brandStatusChange({
          skuId: skuItem.skuId,
          brandId: skuItem.brandId,
          positionId: skuItem.positionId,
          status: error,
        });
      }}
      data={data}
      setData={setData}
      actionPermissions
      showStock
    />
    <BottomButton
      disabled={stocktakings.length > 0}
      only
      text='盘点完成'
      onClick={() => {

      }}
    />

  </>;


};

export default PositionInventory;
