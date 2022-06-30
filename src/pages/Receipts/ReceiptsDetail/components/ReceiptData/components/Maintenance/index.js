import React, { useEffect, useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../Work/Sku/SkuItem';
import { Divider } from 'antd';
import { Button, Popup } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import Maintenanceing from './components/Maintenanceing';
import MyAntPopup from '../../../../../../components/MyAntPopup';

export const inventoryAddPhoto = { url: '/inventoryDetail/addPhoto', method: 'POST' };
export const temporaryLock = { url: '/inventoryDetail/temporaryLock', method: 'POST' };

const Maintenance = (
  {
    permissions,
    receipts,
    getAction = () => {
      return {};
    },
    refresh,
  },
) => {

  const actionPermissions = getAction('maintenanceing').id && permissions;

  const [data, setData] = useState([]);

  useEffect(() => {
    const detailResultsByPositions = receipts.detailResultsByPositions || [];
    setData(detailResultsByPositions);
  }, [receipts.detailResultsByPositions]);

  const [visible, setVisible] = useState();

  const positionChange = (params, currentIndex) => {
    const newData = data.map((item, index) => {
      if (index === currentIndex) {
        return { ...item, ...params };
      } else {
        return item;
      }
    });
    setData(newData);
  };

  return <div className={style.stocktaking}>

    <div className={style.title}>
      库位：{data.length}
    </div>

    {
      data.map((positionItem, positionIndex) => {
        const skuList = positionItem.object || [];

        return <div key={positionIndex} className={style.position}>
          <div className={style.title}>
            {positionItem.name} / {ToolUtil.isObject(positionItem.storehouseResult).name || '-'}
          </div>

          <div className={style.skus}>
            {
              skuList.map((skuItem, skuIndex) => {
                const brandResults = skuItem.brandResults || [];

                if (!positionItem.show && skuIndex >= 2) {
                  return null;
                }

                const border = (positionItem.show || skuList.length <= 2) ? skuIndex === skuList.length - 1 : skuIndex === 1;

                return <div
                  className={style.skuItem}
                  key={skuIndex}
                  style={{ border: border ? 'none' : '' }}>
                  <div className={style.skuRow}>
                    <SkuItem
                      extraWidth={actionPermissions ? '74px' : '24px'}
                      skuResult={skuItem}
                      otherData={brandResults.map(item => {
                        return `${item.brandName} (${item.number})`;
                      }).join(' 、 ')}
                    />
                  </div>
                  <div hidden={!actionPermissions}>
                    <Button
                      color='primary'
                      fill='outline'
                      onClick={() => setVisible({
                        ...skuItem,
                        positionId: positionItem.storehousePositionsId,
                        positionName: positionItem.name,
                      })}>
                      养护
                    </Button>
                  </div>
                </div>;
              })
            }

            {skuList.length > 2 && <Divider style={{ margin: 0 }}>
              <div onClick={() => {
                positionChange({ show: !positionItem.show }, positionIndex);
              }}>
                {
                  positionItem.show ?
                    <UpOutline />
                    :
                    <DownOutline />
                }
              </div>
            </Divider>}
          </div>
        </div>;
      })
    }

    <MyAntPopup
      title='养护'
      onClose={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Maintenanceing skuItem={visible} onSuccess={() => {
        refresh();
        setVisible(false);
      }} />
    </MyAntPopup>

  </div>;
};

export default Maintenance;
