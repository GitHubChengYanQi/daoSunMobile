import React, { useState } from 'react';
import style from '../../../index.less';
import { MyLoading } from '../../../../../../../../../../../components/MyLoading';
import { Popup } from 'antd-mobile';
import { Message } from '../../../../../../../../../../../components/Message';
import Positions from '../../Positions';
import { useRequest } from '../../../../../../../../../../../../util/Request';
import { getPositionsBySkuIds } from '../index';
import MyRemoveButton from '../../../../../../../../../../../components/MyRemoveButton';
import { AddButton } from '../../../../../../../../../../../components/MyButton';
import ShopNumber
  from '../../../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { ToolUtil } from '../../../../../../../../../../../components/ToolUtil';
import MyPositions from '../../../../../../../../../../../components/MyPositions';

const AddPosition = (
  {
    storehouseId,
    positions = [],
    setPositions = () => {

    },
    total,
    skuNumber,
    skuId,
    min = 0,
    verification,
    maxNumber,
  },
) => {

  const [visible, setVisible] = useState();

  const positionResults = (data, array = [], item) => {
    if (!Array.isArray(data)) {
      return item ? array.push({ name: item.title, id: item.key }) : [];
    }
    data.map((item) => {
      return positionResults(item.loops, array, item);
    });
    return array;
  };

  const { loading: getPositionsLoading } = useRequest(
    { ...getPositionsBySkuIds, data: { skuIds: [skuId] } },
    {
      manual: positions.length > 0,
      onSuccess: (res) => {
        const results = positionResults(res);
        const positions = [];
        if (results.length === 1) {
          positions.push({ ...results[0], number: total || min });
        } else {
          results.map((item, index) => {
            if (!total || index <= total) {
              positions.push({ ...item, number: 1 });
            }
            return null;
          });
        }
        setPositions(positions);
      },
    });

  return <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <div className={style.position}>
      <div className={ToolUtil.classNames(style.positionItem, style.border)}>

        <div className={style.positionName}>
          库位
        </div>

        <div className={style.positionAction}>
          数量
        </div>
      </div>
      <div className={style.space} />
      {
        getPositionsLoading ?
          <MyLoading skeleton title='正在获取库位信息，请稍后...' noLoadingTitle />
          :
          positions.map((item, index) => {
            return <div key={index} className={style.positionItem}>

              <div className={style.positionName}>
                {item.name}
              </div>

              <div className={style.positionAction}>
                <div className={style.number}>
                  <ShopNumber
                    min={min}
                    value={item.number || 0}
                    onChange={(number) => {
                      let allNumber = 0;
                      const newPositions = positions.map((item, currentIndex) => {
                        if (currentIndex === index) {
                          return { ...item, number };
                        }
                        allNumber += (item.number || 0);
                        return item;
                      });
                      if (total && (number + allNumber) > total) {
                        return Message.toast('不能超过申请数量!');
                      } else {
                        setPositions(newPositions);
                      }
                    }}
                  />
                </div>

                <div className={style.remove}>
                  <MyRemoveButton onRemove={() => {
                    setPositions(positions.filter((item, currentIndex) => currentIndex !== index));
                  }} />
                </div>
              </div>
            </div>;
          })
      }
    </div>

    <div className={style.addPosition}>
      <AddButton
        disabled={positions.length === maxNumber}
        onClick={() => {
          setVisible(true);
        }}
      />
    </div>


    <MyPositions
      storehouseId={storehouseId}
      visible={visible}
      value={positions}
      verification={verification}
      maxNumber={maxNumber}
      onClose={() => setVisible(false)}
      onSuccess={(value = []) => {
        setVisible(false);
        const ids = positions.map(item => item.id);
        const newPosition = value.filter(item => {
          return !ids.includes(item.id);
        });
        if (newPosition.length === 1) {
          return setPositions(value.map(item => {
            if (item.id === newPosition[0].id) {
              return { number: skuNumber, ...item };
            }
            return item;
          }));
        }
        setPositions(value.map(item => {
          return { ...item, number: min };
        }));
      }} />
  </div>;
};

export default AddPosition;
