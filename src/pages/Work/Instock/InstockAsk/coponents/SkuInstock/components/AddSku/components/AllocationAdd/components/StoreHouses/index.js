import React, { useEffect, useState } from 'react';
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

export const storehouse = { url: '/stockDetails/getStockNumberBySkuId', method: 'POST' };

const StoreHouses = (
  {
    moveLibrary,
    open,
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

  const [storeHouses, setStoreHouses] = useState([]);

  const { loading: storeHouseLoaing, run: getStoreHouse } = useRequest(storeHouseSelect, { manual: true });

  const storeFormat = (res, open) => {
    setStoreHouses(res || []);
    if (!open) {
      setSelectStore(true);
    }
  };
  const getBrandNumbers = (brands, brandNumbers) => {
    brands.forEach(item => {
      if (item.checked) {
        const brandNumberIds = brandNumbers.map(item => item.id);
        const brandNumberIndex = brandNumberIds.indexOf(item.brandId);
        if (brandNumberIndex === -1) {
          brandNumbers.push({ id: item.brandId, number: item.number });
        } else {
          const brandNumber = brandNumbers[brandNumberIndex];
          brandNumbers[brandNumberIndex] = { ...brandNumber, number: brandNumber.number + item.number };
        }
      }
    });
  };

  const change = (newData = []) => {
    let brandNumbers = [];
    newData.forEach(item => {
      if (item.show) {
        if (item.id === storehouseId) {
          const positions = item.positions || [];
          positions.forEach(item => {
            const brands = item.brands || [];
            getBrandNumbers(brands, brandNumbers);
          });
        } else {
          const brands = item.brands || [];
          getBrandNumbers(brands, brandNumbers);
        }
      }
    });
    let overflow = false;
    brandNumbers.forEach(item => {
      const brand = initBrands.filter(initItem => initItem.brandId === item.id)[0] || {};
      if (item.number > brand.maxNumber) {
        overflow = true;
      }
    });
    if (overflow) {
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
  const columns = ToolUtil.isArray(storeHouses).filter(item => {
    if (checkedPosi === 0) {
      return item.value !== storehouseId && !storeIds.includes(item.value);
    }
    return !storeIds.includes(item.value);
  });

  const outFormat = (stockDetails = [], open) => {
    const storeHouse = [];
    stockDetails.forEach(stockItem => {
      if (stockItem.number === 0) {
        return;
      }

      let checkBrand = {};
      let checkPositionBrand = {};
      let checkStore = {};
      if (open) {
        checkStore = data.filter(item => item.id === stockItem.storehouseId)[0] || {};
        const checkBrands = ToolUtil.isArray(checkStore.brands).filter(item => item.checked);
        const checkPositions = ToolUtil.isArray(checkStore.positions);
        const checkPosition = checkPositions.filter(item => item.id === stockItem.storehousePositionsId)[0] || {};
        const checkPositionBrands = ToolUtil.isArray(checkPosition.brands).filter(item => item.checked) || [];

        checkBrand = checkBrands.filter(item => item.brandId === stockItem.brandId)[0] || {};
        checkPositionBrand = checkPositionBrands.filter(item => item.brandId === stockItem.brandId)[0] || {};
      }

      const sname = stockItem.storehouseId === storehouseId;
      const storeHouseIds = storeHouse.map(item => item.value);
      const storeHouseIndex = storeHouseIds.indexOf(stockItem.storehouseId);
      const addBrand = {
        brandId: stockItem.brandId,
        brandName: ToolUtil.isObject(stockItem.brandResult).brandName || '无品牌',
        maxNumber: stockItem.number,
        checked: Boolean(checkBrand.brandId),
        number: checkBrand.number || 1,
      };
      const addPosition = {
        id: stockItem.storehousePositionsId,
        name: ToolUtil.isObject(stockItem.storehousePositionsResult).name,
        number: stockItem.number,
        brands: [{
          brandId: stockItem.brandId,
          brandName: ToolUtil.isObject(stockItem.brandResult).brandName || '无品牌',
          maxNumber: stockItem.number,
          checked: Boolean(checkPositionBrand.brandId),
          number: checkPositionBrand.number || 1,
        }],
      };
      if (storeHouseIndex === -1) {
        storeHouse.push({
          value: stockItem.storehouseId,
          label: ToolUtil.isObject(stockItem.storehouseResult).name,
          number: stockItem.number,
          show: Boolean(checkStore.id),
          brands: sname ? [] : [addBrand],
          positions: sname ? [addPosition] : [],
        });
      } else {
        const store = storeHouse[storeHouseIndex] || {};
        const brands = store.brands || [];
        const positions = store.positions || [];

        if (sname) {
          const positionIds = positions.map(item => item.id);
          const positionsIndex = positionIds.indexOf(stockItem.storehousePositionsId);
          if (positionsIndex === -1) {
            positions.push(addPosition);
          } else {
            const position = positions[positionsIndex] || {};
            const brands = position.brands || [];
            const brandIds = brands.map(item => item.brandId);
            const brandIndex = brandIds.indexOf(stockItem.brandId);
            if (brandIndex === -1) {
              brands.push(addBrand);
            } else {
              const brand = brands[brandIndex] || {};
              brands[brandIndex] = {
                ...brand,
                maxNumber: brand.maxNumber + stockItem.number,
              };
            }
            positions[positionsIndex] = {
              ...position,
              number: stockItem.number + position.number,
              brands,
            };
          }
        } else {
          const brandIds = brands.map(item => item.brandId);
          const brandIndex = brandIds.indexOf(stockItem.brandId);
          if (brandIndex === -1) {
            brands.push(addBrand);
          } else {
            const brand = brands[brandIndex] || {};
            brands[brandIndex] = {
              ...brand,
              maxNumber: brand.maxNumber + stockItem.number,
            };
          }
        }

        storeHouse[storeHouseIndex] = {
          ...store,
          number: stockItem.number + store.number,
          brands,
          positions,
        };
      }
    });

    const storeIds = data.map(item => item.id);
    const columns = storeHouse.filter(item => {
      if (checkedPosi === 0) {
        return item.value !== storehouseId && !storeIds.includes(item.value);
      }
      return !storeIds.includes(item.value);
    });
    if (columns.length === 0) {
      Message.toast('暂无库存!');
      return;
    }
    setStoreHouses(storeHouse);
    if (!open) {
      setSelectStore(true);
    } else {
      const storeData = [];
      storeHouse.forEach(item => {
        if (!item.show) {
          return;
        }
        storeData.push({
          id: item.value,
          name: item.label,
          number: item.number,
          show: true,
          brands: item.brands,
          positions: item.positions,
        });
      });
      change(storeData);
    }
  };

  const { loading, run } = useRequest(storehouse, {
    manual: true,
  });

  useEffect(() => {
    if (open) {
      if (out) {
        getStoreHouse().then((res) => {
          storeFormat(res, true);
        });
      } else {
        run({
          data: {
            skuId,
            brandIds: (initBrands.length === 1 && initBrands[0].brandId === null) ? null : initBrands.map(item => item.brandId),
          },
        }).then((res) => {
          outFormat(res, true);
        });
      }
    }
  }, []);

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

  const brandDom = ({ storehouseId, positionId, brands = [] }) => {

    return brands.map((brandItem, brandIndex) => {

      return <div
        style={{ backgroundColor: positionId && '#fff' }}
        className={ToolUtil.classNames(style.brands, (!positionId && brandItem.checked) && style.checked)}
        key={brandIndex}>
        <div className={style.positionName} onClick={() => {
          brandChange({ checked: !brandItem.checked, number: 1 }, storehouseId, brandItem.brandId, positionId);
        }}>
          <MyCheck fontSize={14} checked={brandItem.checked} />
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
      指定{moveLibrary ? '移' : '调'}{out ? '入' : '出'}库(位)
      <div hidden={ToolUtil.isArray(storeHouses).length !== 0 && columns.length === 0} className={style.select}>
        选择<PlusCircleFilled onClick={() => {
        if (data.length > 0) {
          setSelectStore(true);
          return;
        }
        if (out) {
          getStoreHouse().then((res) => {
            storeFormat(res);
          });
        } else {
          run({
            data: {
              skuId,
              brandIds: (initBrands.length === 1 && initBrands[0].brandId === null) ? null : initBrands.map(item => item.brandId),
            },
          }).then((res) => {
            outFormat(res);
          });
        }
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
        if (!storeHouse.value) {
          return;
        }
        const brands = storeHouse.brands || initBrands || [];
        const storeData = {
          id: storeHouse.value,
          name: storeHouse.label,
          number: storeHouse.number,
          show: true,
          brands: brands.map(item => ({ ...item, checked: moveLibrary || brands.length === 1 })),
          positions: ToolUtil.isArray(storeHouse.positions).map(item => {
            const brands = item.brands || [];
            return { ...item, brands: brands.map(item => ({ ...item, checked: false })) };
          }),
        };
        change([...data, storeData]);

        if (storeHouse.value === storehouseId && out) {
          setVisible({
            ...storeData,
            positions: [],
          });
        }
      }}
    />

    <MyPositions
      visible={visible.id}
      title={visible.name || '所有库位'}
      value={visible.positions || []}
      skuId={out ? undefined : skuId}
      checkShow={(item) => {
        const checkedPositionIds = [];
        brandAndPositions.forEach(brandItem => {
          if (!brandItem.show) {
            return;
          }
          const positions = brandItem.positions || [];
          positions.forEach(positionItem => {
            if (!positionItem.checked) {
              return;
            }
            checkedPositionIds.push(positionItem.id);
          });
        });

        return !checkedPositionIds.includes(item.key) && (out || item.num > 0) && ToolUtil.isArray(item.loops).length === 0;
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

    {(loading || storeHouseLoaing) && <MyLoading />}
  </div>;
};

export default StoreHouses;
