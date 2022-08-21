import React, { useState } from 'react';
import MyList from '../../../../components/MyList';
import SkuItem from '../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../components/ToolUtil';
import style from './index.less';
import ShopNumber from '../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import LinkButton from '../../../../components/LinkButton';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import InkindItem from '../../../../components/InkindList/components/InkindItem';
import { Space } from 'antd-mobile';

const list = { url: '/inkind/list', method: 'POST' };

const InkindList = ({ anomaly, inkindIds }) => {

  const [data, setData] = useState([]);

  return <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
    <MyList
      api={list}
      params={{ inkindIds, anomaly: anomaly ? 1 : null }}
      getData={(list, newList) => {
        const skuIds = list.map(item => item.skuId);
        const newData = data.filter(item => skuIds.includes(item.skuId));
        newList.forEach(item => {
          const positionsResult = ToolUtil.isObject(item.positionsResult);
          const newSkuIds = newData.map(item => item.skuId);
          const newSkuIndex = newSkuIds.indexOf(item.skuId);
          if (newSkuIndex !== -1) {
            const newSku = newData[newSkuIndex];
            const positions = newSku.positions || [];
            const newPositionIds = positions.map(item => item.positionId);
            const newPositionIndex = newPositionIds.indexOf(item.positionId);
            if (newPositionIndex !== -1) {
              const position = positions[newPositionIndex];
              positions[newPositionIndex] = { ...position, inkindList: [...position.inkindList, item] };
            } else {
              newData.push({
                positionId: item.positionId,
                name: positionsResult.name,
                storehouseName: ToolUtil.isObject(positionsResult.storehouseResult).name,
                inkindList: [item],
              });
            }
            newData[newSkuIndex] = { ...newSku, number: item.number + newSku.number, positions };
          } else {
            newData.push({
              skuId: item.skuId,
              skuResult: item.skuSimpleResult,
              number: item.number,
              positions: [{
                positionId: item.positionId,
                name: positionsResult.name,
                storehouseName: ToolUtil.isObject(positionsResult.storehouseResult).name,
                inkindList: [item],
              }],
            });
          }
        });
        setData(newData);
      }}
      data={data}
    >
      {
        data.map((item, index) => {
          const positions = item.positions || [];
          return <div key={index} className={style.sku}>
            <div className={style.skuItem}>
              <SkuItem skuResult={item.skuResult} className={style.row} />
              <div>
                <ShopNumber show value={item.number} />
                <LinkButton onClick={() => {
                  const newData = data.map((dataItem, dataIndex) => {
                    if (dataIndex === index) {
                      return { ...item, open: !dataItem.open };
                    }
                    return item;
                  });
                  setData(newData);
                }}><Space align='center'>明细{item.open ? <UpOutline /> : <DownOutline />}</Space></LinkButton>
              </div>
            </div>
            <div hidden={!item.open} className={style.positions}>
              {
                positions.map((item, index) => {
                  return <InkindItem noActions key={index} positionItem={item} />;
                })
              }
            </div>
          </div>;
        })
      }
    </MyList>
  </div>;
};

export default InkindList;
