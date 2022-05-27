import React, { useImperativeHandle, useState } from 'react';
import { Button, Dialog, Picker, Toast } from 'antd-mobile';
import SkuItem from '../../../../../../Sku/SkuItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import Number from '../../../../../../../components/Number';
import { brandListSelect } from '../../../../../../Stock/components/StockDetail/components/Screen/components/Url';
import { useRequest } from '../../../../../../../../util/Request';
import { supplierIdSelect } from '../../../../../../Customer/CustomerUrl';

const AddSku = (
  {
    onChange = () => {
    },
  }, ref) => {

  const [sku, setSku] = useState({});

  const [visible, setVisible] = useState();

  const [dataVisible, setDataVisible] = useState();

  const { data: brandData } = useRequest(brandListSelect);

  const { data: customerData } = useRequest({ ...supplierIdSelect, data: { supply: 1 } });

  const [data, setData] = useState({});

  const openSkuAdd = (sku = {}) => {
    setSku(sku);
    setData({ skuId: sku.skuId, skuResult: sku });
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    openSkuAdd,
  }));

  return <>
    <Dialog
      visible={visible}
      content={<div className={style.addSku}>
        <SkuItem skuResult={sku} imgSize={80} otherData='123' gap={10} extraWidth={'calc(25vw + 24px)'} />
        <div className={style.flex}>
          <div className={style.checkLabel}>
            品牌
          </div>
          <Button
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
            {sku.stockNumber}{ToolUtil.isObject(sku.spuResult && sku.spuResult.unitResult).unitName}
          </div>
          <div className={style.instockNumber}>
            入库
            <Number
              placeholder='入库数量'
              noBorder
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
          if (!data.number) {
            return Toast.show({ content: '请输入入库数量!', position: 'bottom' });
          }
          onChange(data);
        }
        setVisible(false);
      }}
      actions={[[
        { text: <div>取消</div>, key: 'close' },
        { text: '添加', key: 'add' },
      ]]}
    />


    <Picker
      popupStyle={{'--z-index': 'var(--adm-popup-z-index, 1002)'}}
      columns={[brandData || []]}
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
      popupStyle={{'--z-index': 'var(--adm-popup-z-index, 1002)'}}
      columns={[customerData || []]}
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
