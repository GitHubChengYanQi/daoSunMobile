import style from '../../index.less';
import { Button } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import { LinkOutline } from 'antd-mobile-icons';
import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../../../components/Message';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import MyStepper from '../../../../../../../../../../components/MyStepper';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const getPositionsAndBrands = { url: '/storehousePositions/selectByBrand', method: 'POST' };

const Order = (
  {
    codeData,
    id,
    pickListsDetailId,
    skuId,
    customerId,
    brandId,
    outStockNumber,
    onChange = () => {
    },
  },
) => {

  const [brands, setBrands] = useState([]);

  let outNumber = 0;
  brands.map(item => {
    const positions = item.positionsResults || [];
    return positions.map(item => outNumber += (item.outStockNumber || 0));
  });

  const { loading, run } = useRequest(getPositionsAndBrands, {
    manual: true,
    onSuccess: (res) => {
      const brands = ToolUtil.isArray(res);
      const newBrands = brands.map((item) => {
        const positions = item.positionsResults || [];
        const show = brands.length === 1;
        return {
          ...item,
          show,
          positionsResults: positions.map(item => {
            const checked = positions.length === 1;
            const number = (checked && show) ? (item.number > outStockNumber ? outStockNumber : item.number) : 0;
            return { ...item, checked, outStockNumber: number };
          }),
        };
      });
      setBrands(newBrands);
      outSkuChange(newBrands);
    },
  });

  useEffect(() => {
    if (skuId) {
      run({ data: { skuId, brandId } });
    }
  }, []);

  useEffect(() => {
    if (codeData) {
      const newBrands = brands.map((item) => {
        if (item.brandId === codeData.brandId) {
          const positions = item.positionsResults || [];
          return {
            ...item, show: true, positionsResults: positions.map((item) => {
              if (item.storehousePositionsId === codeData.positionId) {
                const num = (outStockNumber - (outNumber + codeData.number)) > 0 ? codeData.number : (outStockNumber - outNumber);
                return { ...item, checked: true, outStockNumber: num };
              }
              return item;
            }),
          };
        }
        return item;
      });
      setBrands(newBrands);
      outSkuChange(newBrands);
    }
  }, [codeData]);

  const outSkuChange = (newPosition) => {
    const array = [];
    newPosition.map(item => {
      const positions = item.positionsResults || [];
      return positions.map((positionItem) => {
        if (positionItem.outStockNumber > 0) {
          array.push({
            skuId,
            pickListsDetailId,
            storehouseId: positionItem.storehouseId,
            storehousePositionsId: positionItem.storehousePositionsId,
            brandId: item.brandId || 0,
            customerId,
            number: positionItem.outStockNumber,
            pickListsId: id,
          });
        }
        return null;
      });
    });

    onChange(array);
  };

  const brandChange = (currentIndex, data) => {
    const newBrands = brands.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...data };
      }
      return item;
    });
    setBrands(newBrands);
    outSkuChange(newBrands);
  };

  const positionChange = (positionIndex, brandIndex, data) => {
    const newBrands = brands.map((item, index) => {
      if (index === positionIndex) {
        const positions = item.positionsResults || [];
        const newPositions = positions.map((item, index) => {
          if (index === brandIndex) {
            return { ...item, ...data };
          }
          return item;
        });
        return { ...item, positionsResults: newPositions };
      }
      return item;
    });
    setBrands(newBrands);
    outSkuChange(newBrands);
  };

  return <div className={style.action}>
    {brands.length === 0 && <MyEmpty description='暂无库存' />}
    {brands.map((item, index) => {

      const positions = item.positionsResults || [];

      return <div key={index}>
        <div hidden={brands.length === 1}>
          <Button
            className={ToolUtil.classNames(style.position, !item.show ? style.defaultPosition : '')}
            color={item.show ? 'primary' : 'default'}
            fill='outline'
            onClick={() => {
              let brandResults = item.brandResults || [];
              if (item.show) {
                brandResults = brandResults.map(item => {
                  return { ...item, outStockNumber: 0, checked: false };
                });
              }
              brandChange(index, { show: !item.show, brandResults });
            }}
          >
            <LinkOutline /> {item.brandName} ({item.num})
          </Button>
        </div>

        <div hidden={!item.show} className={style.allBrands}>
          {
            positions.map((positionItem, positionIndex) => {

              return <div className={style.brands} key={positionIndex}>
                <span onClick={() => {
                  if (!positionItem.checked) {
                    const num = (outStockNumber - (outNumber + positionItem.number)) > 0 ? positionItem.number : (outStockNumber - outNumber);
                    positionChange(index, positionIndex, { checked: true, outStockNumber: num });
                  }
                }}>{positionItem.name} ({positionItem.number})</span>
                <div hidden={!positionItem.checked}>
                  <ShopNumber
                    min={0}
                    value={positionItem.outStockNumber || 0}
                    onChange={(num) => {
                      let number = 0;
                      brands.map((pItem, pIndex) => {
                        const positions = pItem.positionsResults || [];
                        const newPositions = positions.filter((bIten, bIndex) => {
                          return !(pIndex === index && bIndex === positionIndex);
                        });
                        return newPositions.map(item => number += (item.outStockNumber || 0));
                      });
                      if ((number + num) > outStockNumber) {
                        return Message.toast('不能超过出库数量！');
                      }
                      if (num > positionItem.num) {
                        return Message.toast('不能超过库存数量！');
                      }
                      positionChange(index, positionIndex, { outStockNumber: num });
                    }} />
                </div>

              </div>;
            })
          }
        </div>
      </div>;
    })}

    {loading && <MyLoading />}
  </div>;
};

export default Order;
