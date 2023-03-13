import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import { useStockForewarn } from 'MES-Apis/src/StockForewarn/hooks';
import SkuItem from '../../../Sku/SkuItem';
import styles from './index.less';
import ShopNumber from '../../../AddShop/components/ShopNumber';
import MyPicker from '../../../../components/MyPicker';
import MyRemoveButton from '../../../../components/MyRemoveButton';
import LinkButton from '../../../../components/LinkButton';
import BottomButton from '../../../../components/BottomButton';
import { Dialog, List } from 'antd-mobile';
import { SkuRender } from '../../../Sku/Sku';


const Reserve = (
  {
    sku = {},
    purchaseListList = [],
    onSuccess = () => {
    },
    onClose = () => {
    },
  },
) => {

  const [brandVisible, setBrandVisible] = useState(false);
  const [supplyVisible, setSupplyVisible] = useState(false);

  const {
    purchaseNumber = 0,
    data = {},
    setData = () => {
    },
    supplys,
    brands,
    select,
    edit,
    selectBrandId,
    openBrand,
    action,
    selectCustomerId,
    openCustomer,
    addPickPurchase,
    addLoading,
    editLoading,
    open,
    setOpen,
    setAction,
    startReserve,
    setEdit,
    waitNumber,
  } = useStockForewarn.Reserve({ sku, purchaseListList, onSuccess });


  if (waitNumber && !action) {
    return <>
      <List header='已备物料'>
        {purchaseListList.map((item, index) => (
          <List.Item
            arrow={<div>
              <div>
                x {item.number}
              </div>
              <LinkButton onClick={() => {
                setAction('edit');
                setEdit(item);
                setData({ ...item });
              }}>修改</LinkButton>
            </div>}
            key={index}
            description={<div>
              <div>品牌：{item.brandResult?.brandName || '任意'}</div>
              <div>供应商：{item.customerResult?.customerName || '任意'}</div>
            </div>}
          >
            {SkuRender(item.skuResult)}
          </List.Item>
        ))}
      </List>
      <div style={{ height: 90 }} />
      <BottomButton
        only
        text='新增待采购'
        onClick={() => {
          setAction('add');
          const number = purchaseNumber - sku.floatingCargoNumber > 0 ? purchaseNumber - sku.floatingCargoNumber : 1;
          setData({ number: number - (sku.purchaseNumber || 0) > 0 ? number - (sku.purchaseNumber || 0) : number });
        }}
      />
    </>;
  }

  return <div className={styles.box}>
    <div style={{ padding: '0 12px' }}>
      <SkuItem skuResult={sku.skuResult} />
      <div className={styles.flex}>
        <div className={styles.checkLabel}>
          采购数量
        </div>
        <ShopNumber min={1} value={data.number} onChange={(number) => {
          setData({ ...data, number });
        }} />
      </div>
      <div className={styles.flex}>
        <div className={styles.checkLabel}>
          品牌
        </div>
        <div hidden={action === 'edit'}>
          <LinkButton
            className={styles.check}
            onClick={() => {
              setBrandVisible(true);
            }}
          >
            {brands.find(item => item.brandId === data.brandId)?.brandResult?.brandName || '请选择品牌'}
          </LinkButton>
          <MyRemoveButton
            hidden={!data.brandId}
            onRemove={() => {
              selectBrandId(null);
            }}
          />
        </div>
        <div hidden={action !== 'edit'}>
          {edit.brandResult?.brandName || '任意'}
        </div>

      </div>
      <div className={styles.flex}>
        <div className={styles.checkLabel}>
          供应商
        </div>
        <div hidden={action === 'edit'}>
          <LinkButton
            className={styles.check}
            onClick={() => {
              setSupplyVisible(true);
            }}
          >
            {supplys.find(item => item.customerId === data.customerId)?.customerResult?.customerName || '请选择供应商'}
          </LinkButton>
          <MyRemoveButton
            hidden={!data.customerId}
            onRemove={() => {
              selectCustomerId(null);
            }}
          />
        </div>
        <div hidden={action !== 'edit'}>
          {edit.customerResult?.customerName || '任意'}
        </div>
      </div>
    </div>


    <MyPicker
      value={data.brandId}
      onClose={() => {
        setBrandVisible(false);
      }}
      visible={brandVisible}
      options={brands.map(item => ({ label: item.brandResult?.brandName, value: item.brandId }))}
      onChange={(option) => {
        selectBrandId(option.value);
      }}
    />

    <MyPicker
      value={data.customerId}
      onClose={() => {
        setSupplyVisible(false);
      }}
      visible={supplyVisible}
      options={supplys.map(item => ({ value: item.customerId, label: item.customerResult?.customerName }))}
      onChange={(option) => {
        selectCustomerId(option.value);
      }}
    />
    <div style={{ height: 90 }} />
    <BottomButton
      leftOnClick={() => {
        onClose();
      }}
      rightLoading={addLoading || editLoading}
      rightOnClick={() => {
        startReserve();
      }}
    />

    <Dialog
      visible={open}
      content={open}
      actions={[[
        { key: 'close', text: '取消' },
        { key: 'ok', text: '确定' },
      ]]}
      onAction={(action) => {
        if (action.key === 'ok') {
          addPickPurchase();
        } else {
          setAction(null);
        }
      }}
    />
  </div>;
};

export default Reserve;
