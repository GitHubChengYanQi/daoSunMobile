import React, { useState } from 'react';
import style from '../../index.less';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ExclamationTriangleOutline } from 'antd-mobile-icons';
import { Popup } from 'antd-mobile';
import Error from '../../../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../../../index';
import ErrorShop from '../ErrorShop';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyList from '../../../../../../../../components/MyList';
import Icon from '../../../../../../../../components/Icon';

const StocktaskigAction = (
  {
    anomalyType,
    errorNumber,
    inventoryTaskId,
    showStock,
    show,
    data = [],
    setData = () => {
    },
    refresh = () => {
    },
    errorReturn = () => {
    },
    api,
    params,
    listRef,
  },
) => {

  const [visible, setVisible] = useState();

  const dataList = () => {
    return data.map((positionItem, positionIndex) => {
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

              const border = (positionItem.show || skuResultList.length <= 2) ? skuIndex === skuResultList.length - 1 : skuIndex === 1;

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

              return <div
                className={style.sku}
                key={skuIndex}
                style={{ border: border ? 'none' : '' }}>
                <div className={style.skuItem} onClick={() => {
                  if (show) {
                    return;
                  }
                  setVisible({
                    show: skuItem.lockStatus === 99,
                    skuId: skuItem.skuId,
                    skuResult: skuItem.skuResult,
                    // inkindId: brandItem.inkind,
                    brandId: skuItem.brandId,
                    brandResult: skuItem.brandResult,
                    stockNumber: skuItem.number,
                    number: skuItem.number,
                    inventoryTaskId: inventoryTaskId,
                    positionId: positionItem.positionId,
                    anomalyId: skuItem.anomalyId || false,
                    sourceId: skuItem.inventoryStockId,
                  });
                }}>
                  <SkuItem
                    skuResult={skuItem.skuResult}
                    extraWidth='100px'
                    hiddenNumber={!showStock}
                    number={skuItem.number}
                    otherData={[ToolUtil.isObject(skuItem.brandResult).brandName || '无品牌']}
                  />
                </div>
                <div className={style.info}>
                  <div style={{ color }}>
                    <Icon type='icon-dian' /> {text}
                  </div>
                  {typeof skuItem.realNumber === 'number' &&
                  <ShopNumber show value={skuItem.realNumber} textAlign='right' />}
                  <div className={style.icon}>{icon}</div>
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
    {
      api
        ?
        <MyList
          api={api}
          params={params}
          data={data}
          ref={listRef}
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
        :
        dataList()
    }


    <Popup
      onMaskClick={() => {
        setVisible(false);
      }}
      visible={visible}
      destroyOnClose
    >
      <Error
        noDelete
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

    {!show && <ErrorShop
      noBack
      anomalyType={anomalyType}
      errorNumber={errorNumber}
      errorReturn={errorReturn}
      id={inventoryTaskId}
      onChange={!inventoryTaskId && refresh}
      refresh={inventoryTaskId && refresh}
    />}

  </div>;
};

export default StocktaskigAction;
