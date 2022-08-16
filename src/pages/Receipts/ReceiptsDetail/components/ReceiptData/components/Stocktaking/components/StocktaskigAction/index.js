import React, { useRef, useState } from 'react';
import style from '../../index.less';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ExclamationTriangleOutline } from 'antd-mobile-icons';
import { Button, Popup } from 'antd-mobile';
import Error from '../../../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../../../index';
import ErrorShop from '../ErrorShop';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import MyList from '../../../../../../../../components/MyList';
import Icon from '../../../../../../../../components/Icon';
import { Message } from '../../../../../../../../components/Message';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';
import MyAntPopup from '../../../../../../../../components/MyAntPopup';
import StocktaskLog from './components/StocktaskLog';

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

  const errorShopRef = useRef();

  const [visible, setVisible] = useState();

  const [log, setLog] = useState();

  const history = useHistory();

  const action = (positionItem, skuItem) => {

    if (skuItem.lockStatus === 99) {
      Message.toast('此物料存在异常，正在处理中');
    }
    setVisible({
      show: skuItem.lockStatus === 99,
      skuId: skuItem.skuId,
      skuResult: skuItem.skuResult,
      brandId: skuItem.brandId,
      brandResult: skuItem.brandResult,
      stockNumber: skuItem.number,
      number: skuItem.number,
      inventoryTaskId: inventoryTaskId,
      positionId: positionItem.positionId,
      anomalyId: skuItem.anomalyId || false,
      sourceId: skuItem.inventoryStockId,
      customerId: skuItem.customerId,
    });
  };

  const dataList = () => {
    return data.map((positionItem, positionIndex) => {
      const skuResultList = positionItem.skuResultList || [];

      const storeName = ToolUtil.isObject(positionItem.storehouseResult).name;

      return <div
        key={positionIndex}
        className={style.positionItem}
      >
        <div className={style.positionName}>
          <Icon type='icon-pandiankuwei' />{positionItem.name} {storeName && '/'} {storeName}
        </div>
        <div className={style.skus}>
          {skuResultList.length === 0 && <MyEmpty description='暂无物料' />}
          {
            skuResultList.map((skuItem, skuIndex) => {

              const border = (positionItem.show || skuResultList.length <= 2) ? skuIndex === skuResultList.length - 1 : skuIndex === 1;

              let color;
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

              return <div
                className={style.sku}
                key={skuIndex}
                style={{ border: border ? 'none' : '' }}>
                <div className={style.skuItem} onClick={() => {
                  if (anomalyType === 'timelyInventory') {
                    history.push(`/Work/Sku/SkuDetail?skuId=${skuItem.skuId}`);
                  }
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
                <div className={style.info}>
                  <div style={{ color }} className={style.actionStatus}>
                    <div className={style.icon}>{icon}</div>
                    <Icon type='icon-dian' /> {text}
                  </div>
                  {typeof skuItem.realNumber === 'number' &&
                  <ShopNumber show value={skuItem.realNumber} textAlign='right' />}
                  <Button className={style.inventoryButton} onClick={() => {
                    if (show) {
                      setLog({
                        sourceId: inventoryTaskId,
                        skuId: skuItem.skuId,
                        brandId: skuItem.brandId,
                        storehousePositionsId: positionItem.positionId,
                      });
                      return;
                    }
                    action(positionItem, skuItem);
                  }}>{show ? '查看' : '盘点'}</Button>
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
        errorShopRef={errorShopRef}
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

    <MyAntPopup title='盘点记录' visible={log} onClose={() => setLog()}>
      <StocktaskLog data={log} />
    </MyAntPopup>

    {!show && <ErrorShop
      errorShopRef={errorShopRef}
      showStock={showStock}
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
