import React, { useEffect, useState } from 'react';
import style from '../../index.less';
import { MyLoading } from '../../../../../../components/MyLoading';
import SkuItem from '../../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { ERPEnums } from '../../../../../Stock/ERPEnums';
import { Button, Picker } from 'antd-mobile';
import ShopNumber from '../../../ShopNumber';
import AddPosition
  from '../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/OneInStock/AddPosition';
import { useRequest } from '../../../../../../../util/Request';
import { supplierBySku } from '../../../../../Customer/CustomerUrl';

const Add = (
  {
    sku,
    type,
    query,
    state,
    defaultAction,
    other,
    onClose = () => {
    },
    skus = [],
    data = {},
    setData = () => {
    },
    shopEdit = () => {
    },
    addShop = () => {
    },
    params = {},
  },
) => {

  const [dataVisible, setDataVisible] = useState();

  useEffect(() => {
    const imgUrl = Array.isArray(sku.imgUrls) && sku.imgUrls[0] || state.homeLogo;
    setSnameAction(defaultAction);
    const brands = ToolUtil.isArray(sku.brandResults);
    let number = 1;
    switch (type) {
      case ERPEnums.allocation:
        number = query.askType === 'moveLibrary' ? 0 : 1;
        break;
      case ERPEnums.directInStock:
        number = 0;
        break;
      default:
        break;
    }
    const newData = {
      ...data,
      imgUrl,
      imgId: sku.imgId,
      skuId: sku.skuId,
      skuResult: sku,
      stockNumber: sku.stockNumber,
      storehouseId: sku.storehouseId,
      number,
      brandId: brands.length === 1 ? brands[0].brandId : null,
      brandName: brands.length === 1 ? brands[0].brandName : null,
      ...other,
    };
    setData(newData);
    disabledChange({ newData });
    switch (type) {
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
        getCustomer({ data: { skuId: sku.skuId } });
        break;
      default:
        break;
    }
  }, []);

  const [snameAction, setSnameAction] = useState();

  const [disabled, setDisabled] = useState();

  const disabledChange = ({ customerId, brandId, newData = data }) => {
    if (type === ERPEnums.allocation) {
      return;
    }
    const newCustomerId = customerId === undefined ? newData.customerId : customerId;
    const newBrandId = brandId === undefined ? newData.brandId : brandId;
    const snameSku = skus.filter((item) => {
      return item.skuId === newData.skuId
        &&
        (item.customerId || 0) === (newCustomerId || 0)
        &&
        (item.brandId || 0) === (newBrandId || 0);
    });
    setSnameAction(defaultAction);
    setDisabled(snameSku[0]);
  };

  const {
    loading: getCustomerLoading,
    data: customerData,
    run: getCustomer,
  } = useRequest(supplierBySku, {
    manual: true,
    onSuccess: (res) => {
      if (!data.customerId && ToolUtil.isArray(res).length === 1 && [ERPEnums.inStock, ERPEnums.directInStock].includes(type)) {
        const customer = res[0] || {};
        setData({
          ...data,
          customerId: customer.customerId,
          customerName: customer.customerName,
        });
        disabledChange({ customerId: customer.customerId });
      }
    },
  });

  const taskData = () => {
    let disabledText = '添加';
    let disabled = false;
    switch (type) {
      case ERPEnums.outStock:
        return {
          title: '出库',
          disabledText,
          customerDisabled: true,
          otherBrand: '任意品牌',
        };
      case ERPEnums.inStock:
        if (ToolUtil.isArray(customerData).length === 0) {
          disabledText = '无供应商';
          disabled = true;
        } else if (!data.customerId) {
          disabledText = '请选择供应商';
          disabled = true;
        }
        return {
          title: '入库',
          disabled,
          disabledText,
          otherBrand: '无品牌',
        };
      case ERPEnums.directInStock:
        const positions = ToolUtil.isArray(data.positions);
        const inStock = positions.filter(item => item.number);
        if (ToolUtil.isArray(customerData).length === 0) {
          disabledText = '无供应商';
          disabled = true;
        } else if (!data.customerId) {
          disabledText = '请选择供应商';
          disabled = true;
        } else if (inStock.length === 0) {
          disabledText = '请完善库位信息';
          disabled = true;
        }
        return {
          title: '入库',
          disabled,
          judge: true,
          disabledText,
          otherBrand: '无品牌',
        };
      default:
        return {};
    }
  };

  const add = () => {
    if (snameAction === 'edit') {
      shopEdit({ data: { cartId: data.cartId || disabled.cartId, ...params } });
      return;
    }
    addShop({ data: params });
  };

  return <>
    <div className={style.addSku}>
      {
        getCustomerLoading ?
          <MyLoading skeleton />
          :
          <>
            <SkuItem
              number={data.stockNumber}
              imgId='skuImg'
              skuResult={sku}
              imgSize={80}
              otherData={[ToolUtil.isArray(sku.brandResults).map(item => item.brandName).join(' / ')]}
              extraWidth={'calc(25vw + 24px)'}
            />
            <div className={style.flex} hidden={taskData().brandDisabled}>
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
              >{data.brandName || taskData().otherBrand}</Button>
            </div>
            <div hidden={taskData().customerDisabled} className={style.flex}>
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
            <div
              hidden={taskData().judge || (disabled && !snameAction) || taskData().numberDisabled}
              className={style.flex}
            >
              <div className={style.instockNumber}>
                {taskData().title}数量
                <ShopNumber value={data.number} max={taskData().max} onChange={(number) => {
                  setData({ ...data, number });
                }} />
              </div>
            </div>
            <div hidden={!taskData().judge || (disabled && !snameAction)} className={style.flex}>
              <AddPosition
                min={1}
                skuNumber={1}
                skuId={sku.skuId}
                positions={data.positions}
                setPositions={(positions = []) => {
                  setData({ ...data, positions });
                }} />
            </div>
            <div hidden={!disabled || snameAction} className={style.danger}>
              <span>已办理{taskData().title}准备是否继续添加?</span>
              <div className={style.sname} hidden={!disabled || snameAction}>
                <Button className={style.add} onClick={() => {
                  setSnameAction('add');
                }}>继续</Button>
                <Button color='primary' className={style.edit} onClick={() => {
                  setData({ ...data, ...disabled });
                  setSnameAction('edit');
                }}>修改</Button>
              </div>
            </div>
            <div className={style.buttons}>
              <Button
                className={ToolUtil.classNames(style.close, style.button)}
                onClick={() => {
                  onClose();
                }}>
                取消
              </Button>
              <Button
                disabled={taskData().disabled || (disabled && !snameAction)}
                className={ToolUtil.classNames(style.ok, style.button)}
                color='primary'
                onClick={() => {
                  add();
                }}>
                {snameAction === 'edit' ? '修改' : '添加'}
              </Button>
            </div>
          </>
      }
    </div>

    <Picker
      destroyOnClose
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[[{ label: taskData().otherBrand, value: 0 }, ...ToolUtil.isArray(sku.brandResults).map(item => {
        return {
          label: item.brandName,
          value: item.brandId,
        };
      })]]}
      visible={dataVisible === 'brand'}
      onClose={() => {
        setDataVisible(null);
      }}
      value={[data.brandId]}
      onConfirm={(value, options) => {
        const brand = ToolUtil.isArray(options.items)[0] || {};
        setData({
          ...data,
          brandId: brand.value,
          brandName: brand.label,
        });
        disabledChange({ brandId: brand.value });
      }}
    />

    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
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
        const customer = ToolUtil.isArray(options.items)[0] || {};
        setData({
          ...data,
          customerId: customer.value,
          customerName: customer.label,
        });
        disabledChange({ customerId: customer.value });
      }}
    />
  </>;
};

export default Add;
