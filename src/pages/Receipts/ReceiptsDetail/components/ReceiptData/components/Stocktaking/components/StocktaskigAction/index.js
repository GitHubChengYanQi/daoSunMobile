import React, { useRef, useState } from 'react';
import style from '../../index.less';
import { ToolUtil } from '../../../../../../../../../util/ToolUtil';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ExclamationTriangleOutline } from 'antd-mobile-icons';
import { Button, Popup } from 'antd-mobile';
import Error from '../../../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../../../index';
import ErrorShop from '../ErrorShop';
import ShopNumber from '../../../../../../../../Work/AddShop/components/ShopNumber';
import MyList from '../../../../../../../../components/MyList';
import Icon from '../../../../../../../../components/Icon';
import { Message } from '../../../../../../../../components/Message';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';

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
    getPositionIds = () => {
    },
    noTips,
    complete = () => {
    },
  },
) => {

  const errorShopRef = useRef();

  const [visible, setVisible] = useState();

  const history = useHistory();

  const action = (positionItem, skuItem, showError) => {

    if (!showError && skuItem.lockStatus === 99) {
      Message.toast('此物料存在异常，正在处理中');
    }
    setVisible({
      showError,
      show: skuItem.lockStatus === 99,
      skuId: skuItem.skuId,
      skuResult: skuItem.skuResult,
      brandId: skuItem.brandId,
      brandResult: skuItem.brandResult,
      stockNumber: (skuItem.number || 0) - (skuItem.lockNumber || 0),
      number: (skuItem.number || 0) - (skuItem.lockNumber || 0),
      inventoryTaskId: inventoryTaskId,
      positionId: positionItem.positionId,
      anomalyId: skuItem.anomalyId || false,
      sourceId: skuItem.inventoryStockId,
      customerId: skuItem.customerId,
      details:skuItem.details
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
          <Icon type='icon-pandiankuwei1' />{positionItem.name} {storeName && '/'} {storeName}
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
                    extraWidth='124px'
                    hiddenNumber={!showStock}
                    number={(skuItem.number || 0) - (skuItem.lockNumber || 0)}
                    otherData={[
                      <span style={{ color: 'var(--adm-color-primary)' }}>
                        {ToolUtil.isObject(skuItem.brandResult).brandName || '无品牌'}
                      </span>,
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
                    action(positionItem, skuItem, show);
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
          noTips={noTips}
          response={(res) => {
            getPositionIds(res.search);
          }}
          api={api}
          params={params}
          data={data}
          ref={listRef}
          getData={(list = []) => {
            const newData = [];
            list.forEach(item => {
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
      getContainer={null}
      onMaskClick={() => {
        setVisible(false);
      }}
      visible={visible}
      destroyOnClose
    >
      <Error
        errorShopRef={errorShopRef}
        noDelete
        showError={visible && visible.showError}
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
