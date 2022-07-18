import React from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import StocktaskigAction from '../StocktaskigAction';
import BottomButton from '../../../../../../../../components/BottomButton';
import { useHistory } from 'react-router-dom';

const StocktaskingHandle = (
  {
    data = [],
    setData = () => {
    },
    complete = () => {
    },
    temporaryLockRun = () => {
    },
    inventoryTaskId,
    showStock,
    anomalyType,
  },
) => {

  const history = useHistory();

  let errorNumber = 0;
  data.forEach(posiItem => {
    ToolUtil.isArray(posiItem.skuResultList).forEach(skuItem => {
      if (skuItem.inventoryStatus === -1) {
        errorNumber++;
      }
    });
  });

  const skuReturnChange = (skus = [], status) => {
    const newData = data.map(posiItem => {
      const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
        const backSkus = skus.filter(item =>
          item.positionId === posiItem.storehousePositionsId && item.skuId === skuItem.skuId,
        );
        if (backSkus.length > 0) {
          return { ...skuItem, inventoryStatus: status, anomalyId: status === 0 ? null : skuItem.anomalyId };
        } else {
          return skuItem;
        }
      });
      return { ...posiItem, skuResultList };
    });
    setData(newData);
  };

  const skuStatusChange = ({ skuId, positionId, params = {} }) => {
    temporaryLockRun({ skuId, positionId, params });
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
      return ![0, 2].includes(item.inventoryStatus || 0);
    });
    return complete.length !== skuResultList.length;
  });


  return <>
    <StocktaskigAction
      anomalyType={anomalyType}
      inventoryTaskId={inventoryTaskId}
      errorNumber={errorNumber}
      errorReturn={skuReturnChange}
      refresh={(skuItem, error, anomalyId) => {
        if (skuItem) {
          skuStatusChange({
            params: {
              inventoryStatus: error,
              anomalyId: [2, -1].includes(error) && anomalyId,
            },
            skuId: skuItem.skuId,
            positionId: skuItem.positionId,
          });
        }
      }}
      data={data}
      setData={setData}
      showStock={showStock}
    />
    {!inventoryTaskId && <div style={{ height: 60 }} />}
    <BottomButton
      leftText='暂停'
      leftOnClick={() => {
        history.goBack();
      }}
      rightDisabled={stocktakings.length > 0}
      rightText='盘点完成'
      rightOnClick={() => {
        complete();
      }}
      disabled={stocktakings.length > 0}
      only={!inventoryTaskId}
      text='盘点完成'
      onClick={() => {
        complete();
      }}
    />
  </>;
};

export default StocktaskingHandle;
