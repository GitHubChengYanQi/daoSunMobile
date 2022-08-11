import React, { useState } from 'react';
import { ToolUtil } from '../../../../../components/ToolUtil';
import MyList from '../../../../../components/MyList';
import style from '../../ReceiptData/components/Stocktaking/index.less';
import MyEmpty from '../../../../../components/MyEmpty';
import { ExclamationTriangleOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../Work/Sku/SkuItem';
import Icon from '../../../../../components/Icon';
import ShopNumber from '../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { UserName } from '../../../../../components/User';
import { MyDate } from '../../../../../components/MyDate';

export const historyList = {url:'/inventoryStock/historyList',method:'POST'}

const StocktaskingLog = ({ detail = {} }) => {

  const [data, setData] = useState([]);

  const showStock = detail.method === 'OpenDisc';

  const dataList = () => {
    return data.map((positionItem, positionIndex) => {
      const skuResultList = positionItem.skuResultList || [];

      const storeName = ToolUtil.isObject(positionItem.storehouseResult).name;

      return <div
        key={positionIndex}
        className={style.positionItem}
      >
        <div className={style.positionName}>
          {positionItem.name} {storeName && '/'} {storeName}
        </div>
        <div className={style.skus}>
          {skuResultList.length === 0 && <MyEmpty description='暂无物料' />}
          {
            skuResultList.map((skuItem, skuIndex) => {

              let color = '';
              let icon = '';
              let text = '';
              switch (skuItem.status) {
                case 0:
                  text = '进行中';
                  color = '#666666';
                  break;
                case 1:
                  text = '已完成';
                  color = '#257BDE';
                  // icon = <CheckOutlined />;
                  break;
                case -1:
                case 99:
                  text = '已完成';
                  color = '#257BDE';
                  if (!showStock && skuItem.errorNum === 0) {
                    break;
                  }
                  icon = <ExclamationTriangleOutline />;
                  break;
                case 2:
                  text = '暂停中';
                  color = '#FA8F2B';
                  // icon = <PauseCircleFilled />;
                  break;
                default:
                  text = '进行中';
                  color = '#666666';
                  break;
              }

              return <div key={skuIndex}>
                <div
                  className={style.sku}
                  key={skuIndex}
                  style={{ border: 'none' }}>
                  <div className={style.skuItem} onClick={() => {

                  }}>
                    <SkuItem
                      skuResult={skuItem.skuResult}
                      extraWidth='100px'
                      hiddenNumber={!showStock}
                      number={skuItem.number}
                      otherData={[
                        ToolUtil.isObject(skuItem.brandResult).brandName || '无品牌',
                      ]}
                    />
                  </div>
                  <div className={style.info} style={{ justifyContent: 'center' }}>
                    <div style={{ color }} className={style.actionStatus}>
                      <div className={style.icon}>{icon}</div>
                      <Icon type='icon-dian' /> {text}
                    </div>
                    {typeof skuItem.realNumber === 'number' &&
                    <ShopNumber show value={skuItem.realNumber} textAlign='right' />}
                  </div>
                </div>
                <div className={style.update}>
                  <div className={style.time}>{MyDate.Show(skuItem.updateTime)}</div>
                  <div><UserName user={skuItem.user} /></div>
                </div>
              </div>;
            })
          }
        </div>
        <div className={style.space} />
      </div>;
    });
  };

  return <div className={style.stocktaking}>
    <MyList
      api={historyList}
      params={{ inventoryId:detail.inventoryTaskId }}
      data={data}
      getData={(list = [], newList = []) => {
        const positionIds = list.map(item => item.positionId);
        const newData = data.filter(item => positionIds.includes(item.positionId));
        newList.forEach(item => {
          const newPositionIds = newData.map(item => item.positionId);
          const newPositionIndex = newPositionIds.indexOf(item.positionId);
          if (newPositionIndex !== -1) {
            const newPosition = newData[newPositionIndex];
            newData[newPositionIndex] = { ...newPosition, skuResultList: [...newPosition.skuResultList, item] };
          } else {
            newData.push({
              positionId: item.positionId,
              name: ToolUtil.isObject(item.positionsResult).name,
              storehouseResult: ToolUtil.isObject(item.positionsResult).storehouseResult,
              skuResultList: [item],
            });
          }
        });
        setData(newData);
      }}>
      {dataList()}
    </MyList>
  </div>;
};

export default StocktaskingLog;
