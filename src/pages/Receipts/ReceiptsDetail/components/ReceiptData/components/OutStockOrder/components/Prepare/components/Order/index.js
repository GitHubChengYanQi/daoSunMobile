import style from '../../index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../../../components/Message';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';
import ShopNumber
  from '../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyCheck from '../../../../../../../../../../components/MyCheck';
import InkindList from '../../../../../../../../../../components/InkindList';
import { TrademarkCircleOutlined } from '@ant-design/icons';

export const getPositionsAndBrands = { url: '/storehousePositions/selectByBrand', method: 'POST' };

const Order = (
  {
    id,
    pickListsDetailId,
    skuId,
    customerId,
    brandId,
    outStockNumber,
    onChange = () => {
    },
    className,
    storehouseId,
    inkindRef,
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
            const checked = show && positions.length === 1;
            const number = (checked && show) ? ((typeof outStockNumber === 'number' && item.number > outStockNumber) ? outStockNumber : item.number) : 0;
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
      run({ data: { skuId, brandId, storehouseId } });
    }
  }, [skuId]);

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
            inkindId: positionItem.inkindId,
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

  return <div className={ToolUtil.classNames(className, style.action)}>
    {brands.length === 0 && <MyEmpty description='暂无库存' />}
    {brands.map((item, index) => {

      const positions = item.positionsResults || [];

      return <div key={index}>
        <div>
          <div
            className={ToolUtil.classNames(style.position, !item.show ? style.defaultPosition : style.show)}
            color={item.show ? 'primary' : 'default'}
          >
            <div onClick={() => {
              let positionsResults = item.positionsResults || [];
              if (item.show) {
                positionsResults = positionsResults.map(item => {
                  return { ...item, outStockNumber: 0, checked: false };
                });
              }
              brandChange(index, { show: !item.show, positionsResults });
            }} className={style.brandName}>
              <TrademarkCircleOutlined /> {item.brandName} ({item.num})
            </div>

            <div hidden={!item.show} className={style.allBrands}>
              {
                positions.map((positionItem, positionIndex) => {

                  return <div
                    className={ToolUtil.classNames(style.brands, positionItem.checked && style.checked)}
                    key={positionIndex}>
                    <div className={style.positionName} onClick={() => {
                      if (!positionItem.checked) {
                        const num = typeof outStockNumber === 'number' ? (outStockNumber - (outNumber + positionItem.number)) > 0 ? positionItem.number : (outStockNumber - outNumber) : positionItem.number;
                        positionChange(index, positionIndex, { checked: true, outStockNumber: num });
                      } else {
                        positionChange(index, positionIndex, { checked: false, outStockNumber: 0 });
                      }
                    }}>
                      <MyCheck checked={positionItem.checked} />
                      <span>{positionItem.name} ({positionItem.number})</span>
                    </div>

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
                          if (typeof outStockNumber === 'number' && (number + num) > outStockNumber) {
                            return Message.toast('不能超过出库数量！');
                          }
                          if (num > positionItem.num) {
                            return Message.toast('不能超过库存数量！');
                          }
                          positionChange(index, positionIndex, { outStockNumber: num, inkinds: [] });
                        }} />
                    </div>

                  </div>;
                })
              }
            </div>
          </div>
        </div>
      </div>;
    })}

    <InkindList
      ref={inkindRef}
      onSuccess={(inkinds = []) => {
        let addNum = 0;
        const newBrands = brands.map(item => {
          const brands = inkinds.filter(inkindItem => inkindItem.brandId === item.brandId);
          if (brands.length > 0) {
            const positions = item.positionsResults || [];
            const newPositions = positions.map(item => {
              const posis = brands.filter(posiItem => posiItem.storehousePositionsId === item.storehousePositionsId);
              if (posis.length > 0) {
                let number = 0;
                posis.forEach(item => number += item.number);
                const outNum = (outNumber + addNum) - item.outStockNumber;
                const num = typeof outStockNumber === 'number' ? (outStockNumber - (outNum + number)) > 0 ? number : (outStockNumber - outNum) : item.number;
                addNum += num;
                return {
                  ...item,
                  checked: true,
                  outStockNumber: num,
                };
              }
              return item;
            });
            return {
              ...item,
              show: true,
              positionsResults: newPositions,
            };
          }
          return item;
        });
        setBrands(newBrands);
        outSkuChange(newBrands);
      }}
    />

    {loading && <MyLoading />}
  </div>;
};

export default Order;
