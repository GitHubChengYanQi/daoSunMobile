import React from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import StocktaskigAction from '../StocktaskigAction';
import BottomButton from '../../../../../../../../components/BottomButton';

const StocktaskingHandle = (
  {
    getPositionIds = () => {
    },
    data = [],
    setData = () => {
    },
    complete = () => {
    },
    inventoryTaskId,
    showStock,
    anomalyType,
    params,
    api,
    listRef,
    show,
    shopCartNum,
    refresh = () => {
    },
    noSubmit,
  },
) => {

  let errorNumber = 0;
  data.forEach(posiItem => {
    ToolUtil.isArray(posiItem.skuResultList).forEach(skuItem => {
      if (skuItem.status === -1 && skuItem.lockStatus !== 99) {
        errorNumber++;
      }
    });
  });

  const skuReturnChange = (skus = [], status) => {
    const newData = data.map(posiItem => {
      const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
        const backSkus = skus.filter(item =>
          item.positionId === posiItem.positionId && item.skuId === skuItem.skuId && item.brandId === skuItem.brandId,
        );
        if (backSkus.length > 0) {
          return {
            ...skuItem,
            status,
            anomalyId: status === 0 ? null : skuItem.anomalyId,
            lockStatus: status === 99 ? 99 : skuItem.lockStatus,
          };
        } else {
          return skuItem;
        }
      });
      return { ...posiItem, skuResultList };
    });
    setData(newData);
    refresh();
  };

  const skuStatusChange = ({ skuId, positionId, brandId, params = {} }) => {
    const newData = data.map(posiItem => {
      if (posiItem.positionId === positionId) {
        const skuResultList = ToolUtil.isArray(posiItem.skuResultList).map(skuItem => {
          if (skuItem.skuId === skuId && skuItem.brandId === brandId) {
            return { ...skuItem, ...params };
          }
          return skuItem;
        });
        return { ...posiItem, skuResultList };
      }
      return posiItem;
    });
    setData(newData);
    refresh();
  };

  const stocktakings = data.filter((item) => {
    const skuResultList = item.skuResultList || [];
    const complete = skuResultList.filter(item => {
      return ![0, 2].includes(item.status || 0);
    });
    return complete.length !== skuResultList.length;
  });

  const errNum = typeof shopCartNum === 'number' ? shopCartNum : errorNumber;

  return <>
    <StocktaskigAction
      complete={complete}
      getPositionIds={getPositionIds}
      show={show}
      listRef={listRef}
      params={params}
      api={api}
      anomalyType={anomalyType}
      inventoryTaskId={inventoryTaskId}
      errorNumber={errNum}
      errorReturn={skuReturnChange}
      refresh={(skuItem, error, anomalyId) => {
        if (skuItem) {
          skuStatusChange({
            params: {
              status: error,
              anomalyId: [2, -1].includes(error) && anomalyId,
              realNumber: skuItem.realNumber,
              errorNum: skuItem.errorNumber,
            },
            skuId: skuItem.skuId,
            positionId: skuItem.positionId,
            brandId: skuItem.brandId,
          });
        }
      }}
      data={data}
      setData={setData}
      showStock={showStock}
    />
    <div hidden={show || noSubmit}>
      <BottomButton
        disabled={stocktakings.length > 0 || errNum > 0}
        only
        text='提交'
        onClick={() => {
          complete();
        }}
      />
    </div>

  </>;
};

export default StocktaskingHandle;
