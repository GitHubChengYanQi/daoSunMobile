import React, { useState } from 'react';
import style from '../../index.less';
import MyCard from '../../../../../../../../components/MyCard';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { Button } from 'antd-mobile';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import Maintenanceing from '../Maintenanceing';
import MyList from '../../../../../../../../components/MyList';

const MaintenanceAction = (
  {
    api,
    data = [],
    actionPermissions,
    setData = () => {
    },
    maintenanceId,
    refresh = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  return <div className={style.stocktaking}>
    <div className={style.title}>
      库位：{data.length}
    </div>

    <MyList api={api} data={data} getData={setData}>
      {
        data.map((positionItem, positionIndex) => {
          const skuList = positionItem.object || [];

          return <MyCard
            key={positionIndex}
            title={<>{positionItem.name} / {ToolUtil.isObject(positionItem.storehouseResult).name || '-'}
            </>}>
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
                        extraWidth={actionPermissions ? '110px' : '40px'}
                        skuResult={skuItem}
                        otherData={[brandResults.map(item => {
                          return `${item.brandName} (${item.number})`;
                        }).join(' 、 ')]}
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
            </div>
          </MyCard>;
        })
      }
    </MyList>

    <MyAntPopup
      title='养护'
      onClose={() => setVisible(false)}
      visible={visible}
      destroyOnClose
    >
      <Maintenanceing maintenanceId={maintenanceId} skuItem={visible} onSuccess={() => {
        refresh();
        setVisible(false);
      }} />
    </MyAntPopup>
  </div>;
};

export default MaintenanceAction;
