import React, { useState } from 'react';
import style from '../../../index.less';
import { MyLoading } from '../../../../../../../../../../../components/MyLoading';
import { AddOutline } from 'antd-mobile-icons';
import { Button, Popup } from 'antd-mobile';
import { Message } from '../../../../../../../../../../../components/Message';
import Positions from '../../Positions';
import { useRequest } from '../../../../../../../../../../../../util/Request';
import { getPositionsBySkuIds } from '../index';
import MyStepper from '../../../../../../../../../../../components/MyStepper';
import MyRemoveButton from '../../../../../../../../../../../components/MyRemoveButton';

const AddPosition = (
  {
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
        if (results.length === 1) {
          results[0] = { ...results[0], number: total || min };
        }
        const positions = [];
        results.map((item, index) => {
          if (!total || index <= total) {
            positions.push({ ...item, number: 1 });
          }
          return null;
        });
        setPositions(positions);
      },
    });

  return <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <div className={style.position}>
      {
        getPositionsLoading ?
          <MyLoading skeleton title='正在获取库位信息，请稍后...' noLoadingTitle />
          :
          positions.map((item, index) => {
            return <div key={index} className={style.positionItem}>

              <div className={style.action}>
                {item.name}
              </div>

              <div style={{ marginRight: 8 }}>
                <MyStepper
                  min={min}
                  style={{
                    '--button-text-color': '#000',
                  }}
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

              <MyRemoveButton onRemove={() => {
                setPositions(positions.filter((item, currentIndex) => currentIndex !== index));
              }} />
            </div>;
          })
      }
    </div>

    <Button
      disabled={positions.length === maxNumber}
      className={style.addPositions}
      color='primary'
      fill='outline'
      onClick={() => {
        setVisible(true);
      }}
    ><AddOutline /></Button>

    <Popup visible={visible} destroyOnClose className={style.positionPopup}>
      <Positions
        verification={verification}
        maxNumber={maxNumber}
        ids={positions}
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
    </Popup>
  </div>;
};

export default AddPosition;
