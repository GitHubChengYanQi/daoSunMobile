import React, { useState } from 'react';
import { useRequest } from '../../../../../../../../../../../../util/Request';
import { MyLoading } from '../../../../../../../../../../../components/MyLoading';
import { Picker } from 'antd-mobile';
import { ToolUtil } from '../../../../../../../../../../../components/ToolUtil';
import ShopNumber from '../../../../../ShopNumber';
import style
  from '../../../../../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/OutStockOrder/components/Prepare/index.less';
import { AddButton } from '../../../../../../../../../../../components/MyButton';
import MyRemoveButton from '../../../../../../../../../../../components/MyRemoveButton';
import { Message } from '../../../../../../../../../../../components/Message';
import MyPositions from '../../../../../../../../../../../components/MyPositions';
import MyCheck from '../../../../../../../../../../../components/MyCheck';
import { PlusCircleFilled } from '@ant-design/icons';
import { storeHouseSelect } from '../../../../../../../../../../Quality/Url';

export const storehouse = { url: '/stockDetails/getStockNumberBySkuId', method: 'GET' };

const StoreHouses = (
  {
    total,
    skuId,
    data = [],
    onChange = () => {
    },
    out,
    storehouseId,
    brandAndPositions = [],
  },
) => {

  const [visible, setVisible] = useState({});

  const [selectStore, setSelectStore] = useState();

  const { loading: storeHouseLoaing, data: storeHouses } = useRequest(storeHouseSelect);

  const change = (newData = []) => {
    let number = 0;
    newData.forEach(item => {
      if (item.show) {
        if (item.id === storehouseId) {
          const positions = item.positions || [];
          positions.forEach(item => {
            const brands = item.brands || [];
            brands.forEach(item => {
              if (item.checked) {
                number += item.number;
              }
            });
          });
        } else {
          const brands = item.brands || [];
          brands.forEach(item => {
            if (item.checked) {
              number += item.number;
            }
          });
        }
      }
    });
    if (number > total) {
      Message.toast('不能超出指定数量！');
      return false;
    }
    onChange(newData);
    return true;
  };

  let checkedPosi = 0;
  const initBrands = [];
  brandAndPositions.length > 0 ? brandAndPositions.forEach(item => {
    if (item.show) {
      const positions = item.positions || [];
      const checkPositions = positions.filter(item => item.checked);
      checkedPosi += checkPositions.length;
      initBrands.push({
        brandId: item.brandId,
        maxNumber: item.number,
        number: 1,
        brandName: item.brandName || '无品牌',
        checked: brandAndPositions.length === 1,
      });
    }
  }) : initBrands.push({
    brandId: null,
    maxNumber: total,
    number: 1,
    brandName: '任意品牌',
    checked: true,
  });

  const storeIds = data.map(item => item.id);
  const columns = ToolUtil.isArray(storeHouses).filter(item => (checkedPosi === 0 && item.value !== storehouseId) && !storeIds.includes(item.value));

  const { loading, run } = useRequest({ ...storehouse, params: { skuId } }, {
    manual: true,
    onSuccess: (res) => {
      const skus = res || [];
      if (skus.length === 0) {
        return Message.toast('无库存！');
      }
      const storeHouse = skus[0].storehouseResult;

      let number = 0;

      const positions = [];
      const brands = [];

      const initBrandIds = initBrands.map(item => item.brandId);

      const allBrand = initBrandIds.length === 1 && initBrandIds[0] === null;

      if (storeHouse.storehouseId === storehouseId) {
        skus.forEach(item => {
          const positionIds = positions.map(item => item.id);
          const positionIndex = positionIds.indexOf(item.storehousePositionsId);
          if (positionIndex === -1) {
            if (allBrand || initBrandIds.includes(item.brandId)) {
              number += item.number;
              positions.push({
                id: item.storehousePositionsId,
                name: ToolUtil.isObject(item.storehousePositionsResult).name,
                number: item.number,
                maxNumber: item.number,
                brands: [{
                  brandId: item.brandId,
                  brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
                  maxNumber: item.number,
                  number: 1,
                }],
              });
            }
          } else {
            number += item.number;
            const position = positions[positionIndex];
            positions[positionIndex] = {
              ...position,
              number: position.number + item.number,
              maxNumber: position.number + item.number,
              brands: [...position.brands, {
                brandId: item.brandId,
                brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
                maxNumber: item.number,
                number: 1,
              }],
            };
          }
        });
        if (positions.length === 0) {
          return Message.toast('无库存！');
        }
      } else {
        skus.forEach(item => {
          const brandIds = brands.map(item => item.brandId);
          const brandIndex = brandIds.indexOf(item.brandId);
          if (brandIndex === -1) {
            if (allBrand || initBrandIds.includes(item.brandId)) {
              number += item.number;
              brands.push({
                brandId: item.brandId,
                brandName: ToolUtil.isObject(item.brandResult).brandName || '无品牌',
                number: item.number,
                maxNumber: item.number,
              });
            }
          } else {
            number += item.number;
            const brand = brands[brandIndex];
            brands[brandIndex] = {
              ...brand,
              number: brand.number + item.number,
              maxNumber: brand.number + item.number,
            };
          }
        });
        if (brands.length === 0) {
          return Message.toast('无库存！');
        }
      }

      if (storeHouse) {
        const storeData = {
          id: storeHouse.storehouseId,
          name: storeHouse.name,
          show: true,
          number,
          brands,
          positions,
        };
        change([...data, storeData]);
      }
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

  const brandChange = (params = {}, storehouseId, brandId, positionId) => {
    const newData = data.map(item => {
      if (item.id === storehouseId) {
        if (positionId) {
          const positions = item.positions || [];
          const newPositions = positions.map(item => {
            if (item.id === positionId) {
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
          return { ...item, positions: newPositions };
        } else {
          const brands = item.brands || [];
          const newBrands = brands.map(item => {
            if (item.brandId === brandId) {
              return { ...item, ...params };
            }
            return item;
          });
          return { ...item, brands: newBrands };
        }
      }
      return item;
    });
    change(newData);
  };

  if (storeHouseLoaing) {
    return <MyLoading skeleton />;
  }

  const brandDom = ({ storehouseId, positionId, brands = [] }) => {

    return brands.map((brandItem, brandIndex) => {

      return <div
        style={{ backgroundColor: positionId && '#fff' }}
        className={ToolUtil.classNames(style.brands, (!positionId && brandItem.checked) && style.checked)}
        key={brandIndex}>
        <div className={style.positionName} onClick={() => {
          brandChange({ checked: !brandItem.checked, number: 1 }, storehouseId, brandItem.brandId, positionId);
        }}>
          <MyCheck fontSize={16} checked={brandItem.checked} />
          <span>{brandItem.brandName}<span hidden={out}>({brandItem.maxNumber})</span></span>
        </div>

        <div hidden={!brandItem.checked}>
          <ShopNumber
            max={out ? undefined : brandItem.maxNumber}
            min={1}
            value={brandItem.number || 0}
            onChange={(number) => {
              brandChange({ number }, storehouseId, brandItem.brandId, positionId);
            }} />
        </div>
      </div>;
    });
  };

  return <div className={style.action} style={{ padding: 0, overflow: 'visible' }}>
    <div className={style.storeHouseTitle}>
      指定调{out ? '入' : '出'}库
      <div className={style.select} hidden={columns.length === 0}>
        选择<PlusCircleFilled onClick={() => {
        setSelectStore(true);
      }} />
      </div>
    </div>
    {data.map((item, index) => {

      const brands = item.brands || [];

      const positions = item.positions || [];

      return <div key={index} className={style.storehouse}>
        <div className={style.storehouseItem}>
          {item.name} <span hidden={out}>({item.number})</span>
          <div className={style.remove}>
            <MyRemoveButton onRemove={() => {
              change(data.filter(store => store.id !== item.id));
            }} />
          </div>
        </div>

        <div hidden={!item.show} className={ToolUtil.classNames(style.allBrands, style.content)}>
          {storehouseId === item.id ? <>
            {
              positions.map((positionItem, positionIndex) => {
                const brands = positionItem.brands || [];
                return <div key={positionIndex} className={style.storeBrands}>
                  <div className={style.storeBrandItem}>
                    <div>
                      {positionItem.name} <span hidden={out}>({positionItem.number})</span>
                    </div>
                    {out && <MyRemoveButton onRemove={() => {
                      dataChange({ positions: positions.filter((item, posiIndex) => posiIndex !== positionIndex) }, item.id);
                    }} />}
                  </div>
                  <div className={style.storeBrandPositions}>
                    {brandDom({ storehouseId: item.id, brands, positionId: positionItem.id })}
                  </div>
                </div>;
              })
            }
            {out && <AddButton
              width={40}
              height={24}
              onClick={() => setVisible({
                ...item,
                positions,
              })} />}
          </> : brandDom({ storehouseId: item.id, brands })}
        </div>
      </div>;
    })}

    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[columns || []]}
      visible={selectStore}
      onClose={() => setSelectStore(false)}
      onConfirm={(value, options) => {
        const storeHouse = options.items[0] || {};
        if (out) {
          const storeData = {
            id: storeHouse.value,
            name: storeHouse.label,
            show: true,
            brands: initBrands,
          };
          change([...data, storeData]);

          if (storeHouse.value === storehouseId) {
            setVisible({
              ...storeData,
              positions: [],
            });
          }
        } else {
          run({ params: { skuId, storehouseId: storeHouse.value } });
        }
      }}
    />

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
        const positions = value.map(item => {
          return { ...item, number: item.num || 1, maxNumber: item.number, brands: item.brands || initBrands };
        });
        const newData = data.map(item => {
          if (item.id === visible.id) {
            return {
              ...item,
              positions,
            };
          }
          return item;
        });
        if (change(newData)) {
          setVisible({});
        }
      }} />

    {loading && <MyLoading />}
  </div>;
};

export default StoreHouses;
