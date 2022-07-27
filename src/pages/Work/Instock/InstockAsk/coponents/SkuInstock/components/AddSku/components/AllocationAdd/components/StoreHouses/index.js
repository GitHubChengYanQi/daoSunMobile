import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../../components/MyLoading';
import { Button } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../../../components/ToolUtil';
import { LinkOutline } from 'antd-mobile-icons';
import ShopNumber from '../../../../../ShopNumber';
import style
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/index.less';
import { AddButton } from '../../../../../../../../../../../components/MyButton';
import MyRemoveButton from '../../../../../../../../../../../components/MyRemoveButton';
import { Message } from '../../../../../../../../../../../components/Message';
import MyPositions from '../../../../../../../../../../../components/MyPositions';

export const storehouse = { url: '/stockDetails/getStockNumberBySkuId', method: 'GET' };

const StoreHouses = (
  {
    total,
    skuId,
    value = [],
    onChange = () => {
    },
    out,
    stotrhouseId,
    brandAndPositions = [],
  },
) => {

  const [data, setData] = useState([]);

  const [visible, setVisible] = useState({});

  const change = (newData = []) => {
    let number = 0;
    newData.forEach(item => {
      if (item.show) {
        if (item.id === stotrhouseId) {
          const brands = item.brands || [];
          brands.forEach(item => {
            const positions = item.positions || [];
            positions.forEach(item => {
              number += item.number;
            });
          });
        } else {
          number += item.number;
        }
      }
    });
    if (number > total) {
      Message.toast('不能超出指定数量！');
      return;
    }
    setData(newData);
    onChange(newData.filter(item => item.show));
  };

  const init = (array = []) => {
    change(array.map(item => {
      const storehouse = item.storehouseResult || {};
      let brands = [];
      if (storehouse.storehouseId === stotrhouseId) {
        brands = brandAndPositions.length > 0 ? brandAndPositions.map(item => {
          return {
            brandId: item.brandId,
            number: item.number,
            brandName: item.brandName || '任意品牌',
          };
        }) : [{
          brandId: 0,
          number: total,
          brandName: '任意品牌',
        }];
      }

      return {
        number: 1,
        maxNumber: item.number,
        id: storehouse.storehouseId,
        name: storehouse.name,
        brands,
      };
    }));
  };

  const { loading, data: storeData } = useRequest({ ...storehouse, params: { skuId } }, {
    onSuccess: (res) => {
      if (value.length > 0){
        return change(value);
      }
      init(res);
    },
  });

  const dataChange = (params = {}, id) => {
    const newData = data.map(item => {
      if (item.id === id) {
        return { ...item, ...params };
      }
      return item;
    });
    change(newData);
  };


  const brandChange = (params = {}, brandId, storehouseId) => {
    const newData = data.map(item => {
      if (item.id === storehouseId) {
        const brands = item.brands || [];
        const newBrands = brands.map(item => {
          if (item.brandId === brandId) {
            return { ...item, ...params };
          }
          return item;
        });
        return { ...item, brands: newBrands };
      }
      return item;
    });
    change(newData);
  };


  const positionChange = (number, storehouseId, brandId, positionIndex, maxNumber) => {
    let num = 0;
    const newData = data.map(item => {
      if (item.id === storehouseId) {
        const brands = item.brands || [];

        const newBrands = brands.map(item => {
          if (item.brandId === brandId) {
            const newPositions = item.positions.map((item, index) => {
              if (index === positionIndex) {
                num += number;
                return { ...item, number, num: number };
              }
              num += item.number;
              return item;
            });
            return { ...item, positions: newPositions };
          }
          return item;
        });
        return { ...item, brands: newBrands };
      }
      return item;
    });

    if (num > maxNumber) {
      return Message.toast('不能超出指定数量！');
    }

    change(newData);
  };

  useEffect(() => {
    init(storeData);
  }, [total]);

  if (loading) {
    return <MyLoading skeleton />;
  }

  const positionsDom = (storehouseId, brandId, positions = [], maxNumber) => {

    return positions.map((positionItem, positionIndex) => {

      return <div
        className={ToolUtil.classNames(style.brands, positionItem.checked && style.checked)}
        key={positionIndex}>
        <div className={style.positionName}>
           <span>
          {positionItem.name} <span hidden={out}>({positionItem.maxNumber || 0})</span>
        </span>
        </div>

        <div>
          <ShopNumber
            max={!out ? positionItem.maxNumber : undefined}
            min={1}
            value={positionItem.number || 0}
            onChange={(number) => {
              positionChange(number, storehouseId, brandId, positionIndex, maxNumber);
            }} />
        </div>
        <MyRemoveButton onRemove={() => {
          brandChange({ positions: positions.filter((item, posiIndex) => posiIndex !== positionIndex) }, brandId, storehouseId);
        }} />

      </div>;
    });
  };

  return <div className={style.action} style={{ padding: 0 }}>
    {data.map((item, index) => {

      const brands = item.brands || [];

      return <div key={index}>
        <div className={style.storeItem}>
          <Button
            disabled={out ? false : item.maxNumber === 0}
            className={ToolUtil.classNames(style.position, !item.show ? style.defaultPosition : '')}
            color={item.show ? 'primary' : 'default'}
            fill='outline'
            onClick={() => {
              dataChange({ show: !item.show }, item.id);
            }}
          >
            <LinkOutline /> {item.name} <span hidden={out}>({item.maxNumber})</span>
          </Button>
          <div hidden={!item.show || stotrhouseId === item.id}>
            <ShopNumber min={1} max={out ? undefined : item.maxNumber} value={item.number} onChange={(number) => {
              dataChange({ number }, item.id);
            }} />
          </div>
        </div>

        <div hidden={!(item.show && stotrhouseId === item.id)} className={style.allBrands}>
          {brands.map((brandItem, brandIndex) => {
            const positions = brandItem.positions || [];
            return <div key={brandIndex} className={style.storeBrands}>
              <div className={style.storeBrandItem}>
                {brandItem.brandName} ({brandItem.number})
              </div>
              <div className={style.storeBrandPositions}>
                {positionsDom(item.id, brandItem.brandId, positions, brandItem.number)}
                <AddButton
                  width={40}
                  height={24}
                  onClick={() => setVisible({
                    ...item,
                    positions,
                    brandId: brandItem.brandId,
                    brandNum: brandItem.number,
                  })} />
              </div>
            </div>;
          })}
        </div>
      </div>;
    })}

    <MyPositions
      visible={visible.id}
      title={visible.name || '所有库位'}
      value={visible.positions || []}
      skuId={out ? undefined : skuId}
      checkShow={(item) => {
        return (out || item.num > 0) && ToolUtil.isArray(item.loops).length === 0;
      }}
      storehouseId={visible.id}
      onClose={() => setVisible({})}
      onSuccess={(value = []) => {
        let num = 0;
        const positions = value.map(item => {
          num += (item.num || 1);
          return { ...item, number: item.num || 1, maxNumber: item.number };
        });
        if (num > visible.brandNum) {
          return Message.toast('不能超出指定数量!');
        }
        const newData = data.map(item => {
          if (item.id === visible.id) {
            const brands = item.brands || [];
            const newBrands = brands.map(item => {
              if (item.brandId === visible.brandId) {
                return { ...item, positions };
              }
              return item;
            });
            return {
              ...item,
              brands: newBrands,
            };
          }
          return item;
        });
        change(newData);
        setVisible({});
      }} />
  </div>;
};

export default StoreHouses;
