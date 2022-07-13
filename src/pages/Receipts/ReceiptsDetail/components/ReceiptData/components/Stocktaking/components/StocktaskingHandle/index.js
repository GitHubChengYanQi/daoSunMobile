import React  from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import StocktaskigAction from '../StocktaskigAction';
import BottomButton from '../../../../../../../../components/BottomButton';

const StocktaskingHandle = (
  {
    data = [],
    setData = () => {
    },
    complete = () => {
    },
    addPhoto = () => {
    },
    temporaryLockRun = () => {
    },
    actionPermissions,
    inventoryTaskId,
    showStock,
    anomalyType,
  },
) => {

  let errorNumber = 0;
  data.forEach(posiItem => {
    ToolUtil.isArray(posiItem.skuResultList).forEach(skuItem => {
      ToolUtil.isArray(skuItem.brandResults).forEach(brandItem => {
        if (brandItem.inventoryStatus === -1) {
          errorNumber++;
        }
      });
    });
  });

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


  return <>
    <StocktaskigAction
      anomalyType={anomalyType}
      inventoryTaskId={inventoryTaskId}
      errorNumber={errorNumber}
      temporaryLockRun={(data) => {
        temporaryLockRun(data);
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
        addPhoto(data);
        skuStatusChange({
          skuId: data.skuId,
          positionId: data.positionId,
          params: {
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
      actionPermissions={actionPermissions}
      showStock={showStock}
    />
    {!inventoryTaskId && <div style={{ height: 60 }} />}
    {actionPermissions && <BottomButton
      disabled={stocktakings.length > 0}
      only
      text='盘点完成'
      onClick={() => {
        complete();
      }}
    />}
  </>;
};

export default StocktaskingHandle;
