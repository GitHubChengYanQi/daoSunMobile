import React, { useState } from 'react';
import style from '../../index.less';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { Divider } from 'antd';
import { CheckOutlined, PauseCircleFilled, WarningOutlined } from '@ant-design/icons';
import { DownOutline, ExclamationOutline, UpOutline } from 'antd-mobile-icons';
import { Popup } from 'antd-mobile';
import Error from '../../../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../../../index';
import ErrorShop from '../ErrorShop';
import { Message } from '../../../../../../../../components/Message';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

const StocktaskigAction = (
  {
    anomalyType,
    errorNumber,
    inventoryTaskId,
    showStock,
    data,
    setData = () => {
    },
    refresh = () => {
    },
    errorReturn = () => {
    },
  },
) => {

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
    {
      data.map((positionItem, positionIndex) => {
        const skuResultList = positionItem.skuResultList || [];

        return <div
          key={positionIndex}
          className={style.positionItem}
        >
          <div className={style.positionName}>
            {positionItem.name} / {ToolUtil.isObject(positionItem.storehouseResult).name || '-'}
          </div>
          <div className={style.skus}>
            {
              skuResultList.map((skuItem, skuIndex) => {

                if (!positionItem.show && skuIndex >= 2) {
                  return null;
                }

                const border = (positionItem.show || skuResultList.length <= 2) ? skuIndex === skuResultList.length - 1 : skuIndex === 1;

                let color = '';
                let icon = <></>;
                switch (skuItem.inventoryStatus) {
                  case 1:
                    color = '#2EAF5D';
                    icon = <CheckOutlined />;
                    break;
                  case -1:
                  case 99:
                    color = '#FF0000';
                    icon = <ExclamationOutline />;
                    break;
                  case 2:
                    color = '#FA8F2B';
                    icon = <PauseCircleFilled />;
                    break;
                  default:
                    break;
                }

                return <div
                  className={style.sku}
                  key={skuIndex}
                  style={{ border: border ? 'none' : '' }}>
                  <div className={style.skuItem} onClick={() => {
                    if (skuItem.lockStatus === 99) {
                      Message.warningDialog({ content: '已提交，不可更改！' });
                      return;
                    }
                    setVisible({
                      skuId: skuItem.skuId,
                      skuResult: skuItem,
                      // inkindId: brandItem.inkind,
                      // brandId: brandItem.brandId,
                      // brandResult: { brandName: brandItem.brandName || '其他品牌' },
                      stockNumber: skuItem.stockNumber,
                      number: skuItem.stockNumber,
                      inventoryTaskId: inventoryTaskId,
                      positionId: positionItem.storehousePositionsId,
                      anomalyId: skuItem.anomalyId || false,
                      sourceId: skuItem.inventoryStockId,
                    });
                  }}>
                    <SkuItem
                      skuResult={skuItem}
                      extraWidth='100px'
                      hiddenNumber={!showStock}
                      number={skuItem.stockNumber}
                    />
                  </div>
                  <div>
                    <ShopNumber show value={skuItem.stockNumber} />
                    <div className={style.position} hidden={!color}>
                      <div className={style.status} style={{ borderTop: `solid 40px ${color}` }}>
                        {icon}
                      </div>
                    </div>

                  </div>
                </div>;
              })
            }

            {skuResultList.length > 2 && <Divider style={{ margin: 0 }}>
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
          <div className={style.space} />
        </div>;
      })
    }

    <Popup
      onMaskClick={() => {
        setVisible(false);
      }}
      visible={visible}
      destroyOnClose
    >
      <Error
        anomalyType={anomalyType}
        showStock={showStock}
        id={visible && visible.anomalyId}
        type={ReceiptsEnums.stocktaking}
        skuItem={visible}
        onClose={() => {
          setVisible(false);
        }}
        onEdit={refresh}
        refreshOrder={refresh}
        onSuccess={(skuItem, error, id) => {
          refresh(skuItem, error, id);
          setVisible(false);
        }}
      />
    </Popup>

    <ErrorShop
      anomalyType={anomalyType}
      errorNumber={errorNumber}
      errorReturn={errorReturn}
      id={inventoryTaskId}
      onChange={!inventoryTaskId && refresh}
      refresh={inventoryTaskId && refresh}
    />

  </div>;
};

export default StocktaskigAction;
