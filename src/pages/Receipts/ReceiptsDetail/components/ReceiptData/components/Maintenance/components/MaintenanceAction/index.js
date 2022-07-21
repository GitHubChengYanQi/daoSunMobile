import React, { useState } from 'react';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { Button } from 'antd-mobile';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import Maintenanceing from '../Maintenanceing';
import MyList from '../../../../../../../../components/MyList';
import style from '../../../Stocktaking/index.less';
import { Progress } from 'antd';

const MaintenanceAction = (
  {
    api,
    data = [],
    actionPermissions,
    setData = () => {
    },
    maintenanceId,
    show,
    listRef,
    params,
  },
) => {

  const [visible, setVisible] = useState();

  const dataList = () => {
    return data.map((positionItem, positionIndex) => {

      const skuResultList = positionItem.skuResultList || [];

      return <div
        key={positionIndex}
        className={style.positionItem}
      >
        <div className={style.positionName}>
          {positionItem.name} / {ToolUtil.isObject(positionItem.storehouseResult).name || '-'}
        </div>
        <div className={style.skus}>
          {
            skuResultList.map((skuItem, skuIndex) => {
              const brandResults = skuItem.brandResults || [];

              let total = 0;
              let complete = 0;
              brandResults.forEach(item => {
                total += item.number;
                complete += item.doneNumber;
              });

              return <div key={skuIndex} className={style.skuAction}>
                <div
                  className={style.sku}
                  style={{ border: 'none' }}
                >
                  <div className={style.skuItem}>
                    <SkuItem
                      extraWidth={actionPermissions ? '110px' : '40px'}
                      skuResult={skuItem.skuResult}
                      otherData={[brandResults.map(item => {
                        return `${item.brandName || '无品牌'} (${item.number})`;
                      }).join(' 、 ')]}
                    />
                  </div>
                  <div hidden={show} className={style.info}>
                    <Button
                      color='primary'
                      fill='outline'
                      onClick={() => {
                        const newBrandResults = [];
                        brandResults.forEach(item => {
                          const number = item.number - item.doneNumber;
                          if (number <= 0) {
                            return;
                          }
                          newBrandResults.push({ ...item, number: number });
                        });

                        setVisible({
                          ...skuItem,
                          positionId: positionItem.positionId,
                          positionName: positionItem.name,
                          brandResults: newBrandResults,
                        });
                      }}>
                      养护
                    </Button>
                  </div>
                </div>
                <div className={style.progress}>
                  <Progress
                    format={(number) => {
                      return <span className={style.blue}>{number + '%'}</span>;
                    }}
                    percent={parseInt((complete / total) * 100)}
                  />
                </div>
              </div>;
            })
          }
        </div>
        <div className={style.space} />
      </div>;
    });
  };

  return <div className={style.stocktaking}>
    <MyList params={params} ref={listRef} api={api} data={data} getData={(list = [], newList = []) => {
      const positionIds = list.map(item => item.storehousePositionsId);
      const newData = data.filter(item => positionIds.includes(item.positionId));
      newList.forEach(item => {
        const newPositionIds = newData.map(item => item.positionId);
        const newPositionIndex = newPositionIds.indexOf(item.storehousePositionsId);

        const brand = item.brandResult || {};

        if (newPositionIndex !== -1) {
          const newPosition = newData[newPositionIndex];

          const skus = newPosition.skuResultList || [];
          const skuIds = skus.map(item => item.skuId);
          const skuIndex = skuIds.indexOf(item.skuId);
          if (skuIndex !== -1) {
            const sku = skus[skuIndex];
            skus[skuIndex] = {
              ...sku,
              brandResults: [
                ...sku.brandResults,
                {
                  brandName: brand.brandName || '无品牌',
                  brandId: brand.brandId || 0,
                  number: item.number || 0,
                  doneNumber: item.doneNumber || 0,
                },
              ],
            };
            newData[newPositionIndex] = {
              ...newPosition,
              skuResultList: skus,
            };
          } else {
            newData[newPositionIndex] = {
              ...newPosition,
              skuResultList: [
                ...skus,
                {
                  skuResult: item.skuResult,
                  skuId: item.skuId,
                  brandResults: [{
                    brandName: brand.brandName || '无品牌',
                    brandId: brand.brandId || 0,
                    number: item.number || 0,
                    doneNumber: item.doneNumber || 0,
                  }],
                },
              ],
            };
          }
        } else {
          newData.push({
            positionId: item.storehousePositionsId,
            name: ToolUtil.isObject(item.storehousePositionsResult).name,
            storehouseResult: ToolUtil.isObject(item.storehousePositionsResult).storehouseResult,
            skuResultList: [{
              skuResult: item.skuResult,
              skuId: item.skuId,
              brandResults: [{
                brandName: brand.brandName || '无品牌',
                brandId: brand.brandId || 0,
                number: item.number || 0,
                doneNumber: item.doneNumber || 0,
              }],
            }],
          });
        }
      });
      setData(newData);
    }}>
      {dataList()}
    </MyList>

    <MyAntPopup
      title='养护'
      onClose={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Maintenanceing maintenanceId={maintenanceId} skuItem={visible} onSuccess={(res) => {
        const brands = res.brands || [];
        const brandIds = brands.map(item => item.brandId);
        const newData = data.map(positionItem => {
            if (positionItem.positionId === res.positionId) {
              const newSkuResultList = positionItem.skuResultList || [];
              const skuResultList = newSkuResultList.map(skuItem => {
                if (skuItem.skuId === res.skuId) {
                  const newBrandResults = skuItem.brandResults || [];
                  const brandResults = newBrandResults.map(brandItem => {
                    const brandIndex = brandIds.indexOf(brandItem.brandId);
                    if (brandIndex !== -1) {
                      return { ...brandItem, doneNumber: brandItem.doneNumber + brands[brandIndex].number };
                    } else {
                      return brandItem;
                    }
                  });
                  return { ...skuItem, brandResults };
                } else {
                  return skuItem;
                }
              });
              return { ...positionItem, skuResultList };
            } else {
              return positionItem;
            }
          },
        );
        setData(newData);
        setVisible(false);
      }} />
    </MyAntPopup>
  </div>;
};

export default MaintenanceAction;
