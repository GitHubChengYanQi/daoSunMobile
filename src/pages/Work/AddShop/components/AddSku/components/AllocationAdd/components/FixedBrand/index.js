import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import { ToolUtil } from '../../../../../../../../../util/ToolUtil';
import { LinkOutline } from 'antd-mobile-icons';
import ShopNumber from '../../../../../ShopNumber';
import MyCheck from '../../../../../../../../components/MyCheck';
import { AddButton } from '../../../../../../../../components/MyButton';
import MyPositions from '../../../../../../../../components/MyPositions';
import { TrademarkCircleOutlined } from '@ant-design/icons';

const FixedBrand = (
  {
    out,
    sku,
    outPositionData = [],
    storehouseName,
    storehouseId,
    value = [],
    onChange = () => {
    },
  },
) => {

  const brands = sku.brandResults || [];

  const [data, setData] = useState([]);

  const [visible, setVisible] = useState({});

  const change = (newData) => {
    setData(newData);
    onChange(newData);
  };

  const dataChange = (params = {}, brandId) => {
    const newData = data.map(item => {
      if (item.brandId === brandId) {
        return { ...item, ...params };
      }
      return item;
    });
    change(newData);
  };

  const positionChange = (params = {}, brandId, positionIndex) => {
    const newData = data.map(item => {
      if (item.brandId === brandId) {
        let number = 0;
        const newPositions = item.positions.map((item, index) => {
          if (index === positionIndex) {
            return { ...item, ...params };
          }
          return item;
        });
        newPositions.forEach(item => {
          if (item.checked) {
            number += item.outStockNumber;
          }
        });
        return { ...item, number: number || (out ? item.num : 1), positions: newPositions };
      }
      return item;
    });
    change(newData);
  };

  useEffect(() => {
    if (value.length > 0) {
      setData(value);
      return;
    }
    if (out) {
      const newBrands = outPositionData.map((item) => {
        const positions = item.positionsResults || [];
        return {
          ...item,
          number: item.number,
          positions: positions.map(item => {
            return { ...item, id: item.storehousePositionsId, outStockNumber: item.number };
          }),
        };
      });
      setData(newBrands);
    } else {
      setData(brands);
    }
  }, []);

  return <div className={style.action}>
    {data.map((item, index) => {

      const positions = item.positions || [];

      const positionCheckeds = positions.filter(item => item.checked);

      return <div key={index}>
        <div className={style.storeItem}>
          <div
            className={ToolUtil.classNames(style.position, !item.show ? style.defaultPosition : style.show)}
          >
            <div className={style.brandName}>
              <div className={style.name} onClick={() => {
                let params;
                if (out) {
                  params = { show: !item.show, number: item.num };
                } else {
                  params = { show: !item.show, number: 1, positions: [] };
                }
                dataChange(params, item.brandId);
              }}>
                <TrademarkCircleOutlined />  {item.brandName} <span hidden={!out}>({item.num})</span>
              </div>

              {item.show &&
              <ShopNumber
                className={style.number}
                show={positionCheckeds.length > 0}
                max={out ? item.num : undefined}
                value={item.number}
                onChange={(number) => {
                  dataChange({ number }, item.brandId);
                }} />}
            </div>
            <div hidden={!item.show} className={style.allBrands} style={{ padding: 0, paddingBottom: 8 }}>
              {
                positions.map((positionItem, positionIndex) => {

                  return <div
                    className={ToolUtil.classNames(style.brands, positionItem.checked && style.checked)}
                    key={positionIndex}>
                    <div className={style.positionName} onClick={() => {
                      if (!positionItem.checked) {
                        const num = positionItem.number;
                        positionChange({ checked: true, outStockNumber: out ? num : 1 }, item.brandId, positionIndex);
                      } else {
                        positionChange({ checked: false, outStockNumber: 0 }, item.brandId, positionIndex);
                      }
                    }}>
                      <MyCheck fontSize={16} checked={positionItem.checked} />
                      <span className={style.name}>{positionItem.name}<span hidden={!out}>({positionItem.number})</span></span>
                    </div>

                    <div hidden={!positionItem.checked}>
                      <ShopNumber
                        max={out ? positionItem.number : undefined}
                        value={positionItem.outStockNumber || 0}
                        onChange={(num) => {
                          positionChange({ outStockNumber: num }, item.brandId, positionIndex);
                        }} />
                    </div>

                  </div>;
                })
              }
              {!out && <AddButton width={40} height={24} onClick={() => setVisible(item)} />}
            </div>
          </div>
        </div>
      </div>;
    })}

    <MyPositions
      title={storehouseName}
      visible={visible.brandId}
      storehouseId={storehouseId}
      onClose={() => setVisible({})}
      value={visible.positions || []}
      onSuccess={(value = []) => {
        let number = 0;
        const positions = value.map(item => {
          number += (item.outStockNumber || 1);
          return {
            ...item,
            outStockNumber: item.outStockNumber || 1,
            checked: true,
          };
        });
        const newData = data.map(item => {
          if (item.brandId === visible.brandId) {
            return {
              ...item,
              number,
              positions,
            };
          }
          return item;
        });
        change(newData);
        setVisible({});
      }} />
  </div>;
};

export default FixedBrand;
