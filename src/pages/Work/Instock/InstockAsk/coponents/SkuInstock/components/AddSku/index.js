import React, { useImperativeHandle, useState } from 'react';
import { Button, Picker, Popup } from 'antd-mobile';
import SkuItem from '../../../../../../Sku/SkuItem';
import style from './index.less';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { useRequest } from '../../../../../../../../util/Request';
import { supplierBySku } from '../../../../../../Customer/CustomerUrl';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { useModel } from 'umi';
import ShopNumber from '../ShopNumber';
import { shopCartAdd, shopCartEdit } from '../../../../../Url';
import AddPosition
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/OneInStock/AddPosition';
import { ERPEnums } from '../../../../../../Stock/ERPEnums';
import Positions
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';
import { useLocation } from 'react-router-dom';

const AddSku = (
  {
    onChange = () => {
    },
    type: defaultType,
    skus = [],
    onClose = () => {
    },
    defaultAction,
  }, ref) => {

  const [type, setType] = useState(defaultType);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const { query } = useLocation();

  const [sku, setSku] = useState({});

  const [visible, setVisible] = useState();

  const [dataVisible, setDataVisible] = useState();

  const addShopBall = (cartId) => {
    const skuImg = document.getElementById(data.imgId || 'skuImg');
    if (skuImg) {
      const top = skuImg.getBoundingClientRect().top;
      const left = skuImg.getBoundingClientRect().left;
      setVisible(false);
      createBall(top, left, cartId, data, type);
    } else {
      onChange({ ...data, cartId }, type);
    }

  };

  const { loading: addLoading, run: addShop } = useRequest(shopCartAdd, {
    manual: true,
    onSuccess: (res) => {
      addShopBall(res);
    },
  });

  const { run: shopEdit } = useRequest(shopCartEdit, {
    manual: true,
    onSuccess: () => {
      addShopBall();
      onClose();
    },
  });

  const [snameAction, setSnameAction] = useState();

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

  const [data, setData] = useState({});

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

  const openSkuAdd = async (sku = {}, initType, other = {}) => {
    const type = initType || defaultType;
    const imgUrl = Array.isArray(sku.imgUrls) && sku.imgUrls[0] || state.homeLogo;
    setSnameAction(defaultAction);
    setType(type);
    setSku(sku);
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
      case ERPEnums.curing:
        break;
      case ERPEnums.outStock:
      case ERPEnums.allocation:
        setVisible(true);
        break;
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
        getCustomer({ data: { skuId: sku.skuId } });
        setVisible(true);
        break;
      default:
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    openSkuAdd,
  }));

  const taskData = () => {
    let disabledText = '添加';
    let disabled = false;
    switch (type) {
      case ERPEnums.allocation:
        return {
          title: '调拨',
          disabledText,
          customerDisabled: true,
          otherBrand: '任意品牌',
          brandDisabled: query.askType === 'moveLibrary',
          numberDisabled: query.askType === 'moveLibrary',
          disabled: query.askType === 'moveLibrary' && !data.outPosition,
        };
      case ERPEnums.curing:
        return {
          title: '养护',
          disabledText,
          otherBrand: '请选择品牌',
        };
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
    const positionNums = [];
    if (type === ERPEnums.allocation) {
      positionNums.push({
        positionId: ToolUtil.isObject(data.outPosition).id,
        toPositionId: ToolUtil.isObject(data.inPosition).id,
        storehouseId: query.storeHouseId,
      });
    } else {
      ToolUtil.isArray(data.positions).map(item => {
        if (item.number) {
          return positionNums.push({ positionId: item.id, num: item.number });
        }
        return null;
      });
    }

    const params = {
      type,
      skuId: data.skuId,
      brandId: data.brandId,
      customerId: data.customerId,
      number: data.number,
      storehousePositionsId: data.positionId,
      positionNums,
      storehouseId: data.storehouseId,
    };

    if (snameAction === 'edit') {
      shopEdit({ data: { cartId: data.cartId || disabled.cartId, ...params } });
      return;
    }
    addShop({ data: params });
  };

  const createBall = (top, left, cartId, newData = {}, type) => {

    const shop = document.getElementById('shop');

    if (!shop) {
      onChange({ ...newData, cartId }, type);
      return;
    }
    let i = 0;

    const bar = document.createElement('div');

    bar.style.backgroundImage = `url(${newData.imgUrl})`;
    bar.style.backgroundColor = '#e1e1e1';
    bar.style.backgroundSize = 'cover';
    bar.style.border = 'solid #F1F1F1 1px';
    bar.style.borderRadius = '4px';
    bar.style.zIndex = '1001';
    bar.style.position = 'fixed';
    bar.style.display = 'block';
    bar.style.left = left + 'px';
    bar.style.top = top + 'px';
    bar.style.width = '50px';
    bar.style.height = '50px';
    bar.style.transition = 'left .6s linear, top .6s cubic-bezier(0.5, -0.5, 1, 1)';

    document.body.appendChild(bar);
    // 添加动画属性
    setTimeout(() => {
      bar.style.left = (shop.offsetLeft + 36) + 'px';
      bar.style.top = (shop.offsetTop) + 'px';
    }, 0);

    /**
     * 动画结束后，删除
     */
    bar.ontransitionend = () => {
      bar.remove();
      i++;
      if (i === 2 && cartId) {
        onChange({ ...newData, cartId }, type);
      }

    };
  };


  return <>

    {addLoading && <MyLoading />}

    <Popup
      destroyOnClose
      className={style.addSkuPopup}
      visible={visible}
      onMaskClick={() => {
        setVisible(false);
        onClose();
      }}
    >
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
              <div className={style.flex} hidden={type !== ERPEnums.allocation}>
                <div className={style.checkLabel}>
                  调出库位 <span hidden={query.askType !== 'moveLibrary'}>*</span>
                </div>
                <Button
                  color='primary'
                  fill='outline'
                  className={style.check}
                  onClick={() => {
                    setDataVisible('outPosition');
                  }}
                >{ToolUtil.isObject(data.outPosition).name || '请选择库位'}</Button>
              </div>
              <div className={style.flex} hidden={type !== ERPEnums.allocation}>
                <div className={style.checkLabel}>
                  调入库位
                </div>
                <Button
                  color='primary'
                  fill='outline'
                  className={style.check}
                  onClick={() => {
                    setDataVisible('inPosition');
                  }}
                >{ToolUtil.isObject(data.inPosition).name || '请选择库位'}</Button>
              </div>
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
              <div hidden={taskData().judge || (disabled && !snameAction) || taskData().numberDisabled}
                   className={style.flex}>
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
                    setVisible(false);
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
    </Popup>


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

    <Popup visible={['outPosition', 'inPosition'].includes(dataVisible)} destroyOnClose className={style.positionPopup}>
      <Positions
        single
        ids={dataVisible === 'outPosition' ? (data.outPosition && [data.outPosition]) : (data.inPosition && [data.inPosition])}
        onClose={() => setDataVisible(null)}
        onSuccess={(value = []) => {
          const position = value[0] || {};
          if (dataVisible === 'outPosition') {
            setData({
              ...data,
              outPosition: position,
            });
          } else {
            setData({
              ...data,
              inPosition: position,
            });
          }
          setDataVisible(null);
        }} />
    </Popup>
  </>;
};

export default React.forwardRef(AddSku);
