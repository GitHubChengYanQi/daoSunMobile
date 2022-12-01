import React, { useState } from 'react';
import { AddButton } from '../../../../../components/MyButton';
import CheckSkus from '../../../../Sku/CheckSkus';
import MyAntPopup from '../../../../../components/MyAntPopup';
import SkuItem from '../../../../Sku/SkuItem';
import styles from './index.less';
import Label from '../../../../../components/Label';
import LinkButton from '../../../../../components/LinkButton';
import ShopNumber from '../../../../AddShop/components/ShopNumber';
import { Input } from 'antd-mobile';
import Brands from '../../../../ProcessTask/MyAudit/components/Brands';
import MyPicker from '../../../../../components/MyPicker';
import { useRequest } from '../../../../../../util/Request';
import { MyLoading } from '../../../../../components/MyLoading';
import { MathCalc } from '../../../../../components/ToolUtil';
import MyRemoveButton from '../../../../../components/MyRemoveButton';

export const unitListSelect = { url: '/unit/listSelect', method: 'POST' };
export const orderDetailRecord = { url: '/orderDetail/record', method: 'POST' };

const AddSku = (
  {
    customerId,
    onChange = () => {
    },
  }) => {

  const [visible, setVisible] = useState(false);

  const [open, setOpen] = useState();

  const [data, setData] = useState([]);

  const { loading, run: getRecord } = useRequest(orderDetailRecord, { manual: true });

  const change = (newData) => {
    setData(newData);
    onChange(newData);
  };

  const addData = (skus) => {
    change(skus.map(item => {
      const skuItem = data.find(skuItem => item.skuId === skuItem.skuId) || {};
      return {
        ...skuItem,
        skuResult: item,
        skuId: item.skuId,
        unitId: skuItem.unitId || item?.spuResult?.unitId,
        unitName: skuItem.unitName || item?.spuResult?.unitResult?.unitName,
      };
    }));
  };

  const dataChange = (param = {}, key) => {
    const newData = data.map((item, index) => {
      if (index === key) {
        return { ...item, ...param };
      }
      return item;
    });
    change(newData);
  };

  return <div>
    {
      data.map((skuItem, skuIndex) => {
        return <div key={skuIndex} className={styles.skuItem}>
          <div style={{ padding: 0 }}>
            <SkuItem
              extraWidth='60px'
              className={styles.sku}
              noView
              skuResult={skuItem.skuResult}
            />
            <MyRemoveButton onRemove={() => {
              change(data.filter((item, index) => index !== skuIndex));
            }} />
          </div>
          <div>
            <Label className={styles.label}>品牌</Label>：
            <div onClick={() => setOpen({
              skuId: skuItem.skuId,
              type: 'brand',
              key: skuIndex,
              value: skuItem.brandId,
              label: skuItem.brandName,
            })}>
              {skuItem.brandName || <LinkButton>请选择品牌</LinkButton>}
            </div>
          </div>
          <div>
            <Label className={styles.label}>单位</Label>：
            <div onClick={() => setOpen({ type: 'unit', key: skuIndex, value: skuItem.unitId })}>
              {skuItem.unitName || <LinkButton>请选择单位</LinkButton>}
            </div>
          </div>
          <div>
            <Label className={styles.label}>数量</Label>：
            <ShopNumber
              min={0.01}
              value={skuItem.purchaseNumber}
              onChange={(purchaseNumber) => dataChange({
                purchaseNumber,
                totalPrice: MathCalc(skuItem.onePrice, purchaseNumber, 'cheng'),
              }, skuIndex)}
            />
          </div>
          <div>
            <Label className={styles.label}>单价</Label>：
            <ShopNumber
              min={0.01}
              decimal={2}
              value={skuItem.onePrice}
              onChange={(onePrice) => dataChange({
                onePrice,
                totalPrice: MathCalc(skuItem.purchaseNumber, onePrice, 'cheng'),
              }, skuIndex)}
            />
            <Label style={{ marginLeft: 24 }} className={styles.label}>总价</Label>：
            <ShopNumber
              min={0.01}
              value={skuItem.totalPrice}
              onChange={(totalPrice) => dataChange({
                totalPrice,
                onePrice: MathCalc(totalPrice, skuItem.purchaseNumber, 'chu'),
              }, skuIndex)}
            />
          </div>
          <div>
            <Label className={styles.label}>备注</Label>：
            <Input
              value={skuItem.remark || ''}
              placeholder='请输入备注'
              onChange={(remark) => dataChange({ remark }, skuIndex)}
            />
          </div>
          <span className={styles.space} />
        </div>;
      })
    }

    <div style={{ textAlign: 'center' }}>
      <AddButton
        onClick={() => {
          setVisible(true);
        }}
      >添加物料</AddButton>
    </div>


    <MyAntPopup title='选择物料' onClose={() => setVisible(false)} visible={visible} position='right'>
      <CheckSkus
        value={data.map(item => item.skuResult)}
        onChange={(skus = []) => {
          addData(skus);
          setVisible(false);
        }}
        onCheck={(skus) => {
          addData(skus);
        }}
      />
    </MyAntPopup>

    <Brands
      value={[{ brandId: open?.value, brandName: open?.label }]}
      visible={open?.type === 'brand'}
      onClose={() => setOpen()}
      onChange={async (brand) => {
        const brandId = brand.brandId === 'any' ? 0 : brand.brandId;
        let record;
        if (customerId) {
          record = await getRecord({
            data: {
              customerId,
              skuId: open.skuId,
              brandId,
            },
          });
        }
        if (record) {
          dataChange({
            onePrice: record.onePrice,
            purchaseNumber: record.purchaseNumber,
            totalPrice: record.totalPrice,
            deliveryDate: record.deliveryDate,
            remark: record.remark,

            brandId: brandId,
            brandName: brand.brandName,
          }, open.key);
          return;
        }
        dataChange({
          brandId: brandId,
          brandName: brand.brandName,
        }, open.key);
      }}
    />

    <MyPicker
      api={unitListSelect}
      value={open?.value}
      visible={open?.type === 'unit'}
      onClose={() => setOpen()}
      onChange={(option) => {
        dataChange({ unitId: option.value, unitName: option.label }, open.key);
      }}
    />

    {loading && <MyLoading />}

  </div>;
};

export default AddSku;
