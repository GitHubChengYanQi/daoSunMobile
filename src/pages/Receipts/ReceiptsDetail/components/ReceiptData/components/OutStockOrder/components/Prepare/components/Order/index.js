import style from '../../index.less';
import { Button, Stepper } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';
import { LinkOutline } from 'antd-mobile-icons';
import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../components/MyLoading';
import { Message } from '../../../../../../../../../../components/Message';
import MyEmpty from '../../../../../../../../../../components/MyEmpty';

const getPositionsAndBrands = { url: '/storehousePositions/selectBySku', method: 'POST' };

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

  const [positions, setPositions] = useState([]);

  let outNumber = 0;
  positions.map(item => {
    const brandResults = item.brandResults || [];
    return brandResults.map(item => outNumber += (item.outStockNumber || 0));
  });

  const { loading, run } = useRequest(getPositionsAndBrands, {
    manual: true,
    onSuccess: (res) => {
      setPositions(ToolUtil.isArray(res).map((item) => {
        const brandResults = item.brandResults || [];
        let brandNumber = 0;
        brandResults.map(item => brandNumber += item.num);
        if ((item.number - brandNumber) > 0) {
          brandResults.push({ other: true, num: item.number - brandNumber });
        }
        return {
          ...item,
          brandResults,
        };
      }));
    },
  });

  useEffect(() => {
    if (skuId) {
      run({ data: { skuId,brandId } });
    }
  }, []);

  useEffect(() => {
    if (codeData) {
      const newPosition = positions.map((item) => {
        if (item.storehousePositionsId === codeData.positionId) {
          const brandResults = item.brandResults || [];
          return {
            ...item, show: true, brandResults: brandResults.map((item) => {
              if (item.brandId === codeData.brandId) {
                const num = (outStockNumber - (outNumber + codeData.number)) > 0 ? codeData.number : (outStockNumber - outNumber);
                return { ...item, checked:true,outStockNumber:num };
              }
              return item;
            }),
          };
        }
        return item;
      });
      setPositions(newPosition);
      outSkuChange(newPosition);
    }
  }, [codeData]);

  const outSkuChange = (newPosition) => {
    const array = [];
    newPosition.map(item => {
      const brands = item.brandResults || [];
      return brands.map((brandItem) => {
        if (brandItem.outStockNumber > 0) {
          array.push({
            skuId,
            pickListsDetailId,
            storehouseId: item.storehouseId,
            storehousePositionsId: item.storehousePositionsId,
            brandId: brandItem.brandId || 0,
            customerId,
            number: brandItem.outStockNumber,
            pickListsId: id,
          });
        }
        return null;
      });
    });

    onChange(array);
  };

  const positionChange = (currentIndex, data) => {
    const newPosition = positions.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...data };
      }
      return item;
    });
    setPositions(newPosition);
    outSkuChange(newPosition);
  };

  const brandChange = (positionIndex, brandIndex, data) => {
    const newPosition = positions.map((item, index) => {
      if (index === positionIndex) {
        const brandResults = item.brandResults || [];
        const newbrandResults = brandResults.map((item, index) => {
          if (index === brandIndex) {
            return { ...item, ...data };
          }
          return item;
        });
        return { ...item, brandResults: newbrandResults };
      }
      return item;
    });
    setPositions(newPosition);
    outSkuChange(newPosition);
  };

  return <div className={style.action}>
    {positions.length === 0 && <MyEmpty description='暂无库存' />}
    {positions.map((item, index) => {

      const brandResults = item.brandResults || [];
      let brandNumber = 0;
      brandResults.map(item => brandNumber += (item.outStockNumber || 0));

      return <div key={index}>
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
            positionChange(index, { show: !item.show, brandResults });
          }}
        >
          <LinkOutline /> {item.name} ({item.number})
        </Button>
        <div hidden={!item.show} className={style.allBrands}>
          {
            brandResults.map((brandItem, brandIndex) => {

              return <div className={style.brands} key={brandIndex}>
                <span onClick={() => {
                  if (!brandItem.checked) {
                    const num = (outStockNumber - (outNumber + brandItem.num)) > 0 ? brandItem.num : (outStockNumber - outNumber);
                    brandChange(index, brandIndex, { checked: true, outStockNumber: num });
                  }
                }}>{brandItem.other ? '其他品牌' : brandItem.brandName} ({brandItem.num})</span>
                <div hidden={!brandItem.checked}>
                  <Stepper
                    min={0}
                    value={brandItem.outStockNumber || 0}
                    style={{
                      '--button-text-color': '#000',
                    }}
                    onChange={(num) => {
                      let number = 0;
                      positions.map((pItem, pIndex) => {
                        const brandResults = pItem.brandResults || [];
                        const newBrands = brandResults.filter((bIten, bIndex) => {
                          return !(pIndex === index && bIndex === brandIndex);
                        });
                        return newBrands.map(item => number += (item.outStockNumber || 0));
                      });
                      if ((number + num) > outStockNumber) {
                        return Message.toast('不能超过出库数量！');
                      }
                      if (num > brandItem.num){
                        return Message.toast('不能超过库存数量！');
                      }
                      brandChange(index, brandIndex, { outStockNumber: num });
                    }}
                  />
                </div>

              </div>;
            })
          }
          <div className={style.count}>
            合计：{brandNumber}
          </div>
        </div>
      </div>;
    })}

    {loading && <MyLoading />}
  </div>;
};

export default Order;
