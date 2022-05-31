import React, { useImperativeHandle, useState } from 'react';
import { Button, Dialog, Picker } from 'antd-mobile';
import SkuItem from '../../../../../../Sku/SkuItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import Number from '../../../../../../../components/Number';
import { useRequest } from '../../../../../../../../util/Request';
import { supplierBySku } from '../../../../../../Customer/CustomerUrl';
import { MyLoading } from '../../../../../../../components/MyLoading';

const AddSku = (
  {
    numberTitle,
    onChange = () => {
    },
    type,
  }, ref) => {

  const [sku, setSku] = useState({});

  const [visible, setVisible] = useState();

  const [dataVisible, setDataVisible] = useState();

  const {
    loading: getCustomerLoading,
    data: customerData,
    run: getCustomer,
  } = useRequest(supplierBySku, { manual: true });

  const [data, setData] = useState({});

  const openSkuAdd = (sku = {}) => {
    getCustomer({ data: { skuId: sku.skuId } });
    setSku(sku);
    setData({ skuId: sku.skuId, skuResult: sku, stockNumber: sku.stockNumber });
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    openSkuAdd,
  }));

  return <>
    <Dialog
      visible={visible}
      content={getCustomerLoading ? <MyLoading skeleton /> : <div className={style.addSku}>
        <SkuItem
          skuResult={sku}
          imgSize={80}
          otherData={ToolUtil.isArray(sku.brandResults).map(item => item.brandName).join(' / ')}
          gap={10}
          extraWidth={'calc(25vw + 24px)'}
        />
        <div className={style.flex}>
          <div className={style.checkLabel}>
            品牌
          </div>
          <Button
            disabled={ToolUtil.isArray(sku.brandResults).length === 0}
            color='primary'
            fill='outline'
            className={style.check}
            onClick={() => {
              setDataVisible('brand');
            }}
          >{data.brandName || '请选择品牌'}</Button>
        </div>
        <div className={style.flex}>
          <div className={style.checkLabel}>
            供应商
          </div>
          <Button
            disabled={ToolUtil.isArray(customerData).length === 0}
            color='primary'
            fill='outline'
            className={style.check}
            onClick={() => {
              setDataVisible('customer');
            }}
          >{data.customerName || '请选择供应商'}</Button>
        </div>
        <div className={style.stockNumber}>
          <div>
            <div className={style.checkLabel}>库存</div>
            <span
              style={{ marginRight: 8 }}>
              {data.stockNumber}
            </span>
            {ToolUtil.isObject(sku.spuResult && sku.spuResult.unitResult).unitName}
          </div>
          <div className={style.instockNumber}>
            {numberTitle}
            <Number
              placeholder={`${numberTitle}数量`}
              noBorder
              max={type === 'outStock' ? data.stockNumber : undefined}
              value={data.number}
              className={style.number}
              onChange={(number) => {
                setData({ ...data, number });
              }}
            />
          </div>
        </div>
      </div>}
      onAction={(action) => {
        if (action.key === 'add') {
          onChange(data);
        }
        setVisible(false);
      }}
      actions={[[
        { text: <div style={{ color: '#000' }}>取消</div>, key: 'close' },
        {
          text: '添加',
          key: 'add',
          disabled: !data.number || (type === 'outStock' ? data.stockNumber <= 0 : (ToolUtil.isArray(customerData).length === 0 || !data.customerId)),
        },
      ]]}
    />


    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1002)' }}
      columns={[ToolUtil.isArray(sku.brandResults).map(item => {
        return {
          label: item.brandName,
          value: item.brandId,
        };
      })]}
      visible={dataVisible === 'brand'}
      onClose={() => {
        setDataVisible(null);
      }}
      value={[data.brandId]}
      onConfirm={(value, options) => {
        setData({
          ...data,
          brandId: ToolUtil.isArray(value)[0],
          brandName: ToolUtil.isObject(ToolUtil.isArray(options.items)[0]).label,
        });
      }}
    />

    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1002)' }}
      columns={[ToolUtil.isArray(customerData).map(item => {
        return {
          label: item.customerName,
          value: item.customerId,
        };
      })]}
      visible={dataVisible === 'customer'}
      onClose={() => {
        setDataVisible(null);
      }}
      value={[data.customerId]}
      onConfirm={(value, options) => {
        setData({
          ...data,
          customerId: ToolUtil.isArray(value)[0],
          customerName: ToolUtil.isObject(ToolUtil.isArray(options.items)[0]).label,
        });
      }}
    />
  </>;
};

export default React.forwardRef(AddSku);
