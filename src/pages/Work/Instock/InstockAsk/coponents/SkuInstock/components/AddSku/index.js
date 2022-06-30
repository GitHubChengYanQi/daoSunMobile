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
import { shopCartAdd } from '../../../../../Url';
import AddPosition
  from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/OneInStock/AddPosition';
import { ERPEnums } from '../../../../../../Stock/ERPEnums';
import LinkButton from '../../../../../../../components/LinkButton';

const AddSku = (
  {
    onChange = () => {
    },
    type: defaultType,
    skus = [],
    judge,
    onClose = () => {
    },
  }, ref) => {

  const [type, setType] = useState(defaultType);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const [sku, setSku] = useState({});

  const [imgUrl, setImgUrl] = useState();

  const [visible, setVisible] = useState();

  const [dataVisible, setDataVisible] = useState();

  const { run: addShop } = useRequest(shopCartAdd, {
    manual: true,
    onSuccess: (res) => {
      onChange({ ...data, cartId: res },type);
    },
  });

  const {
    loading: getCustomerLoading,
    data: customerData,
    run: getCustomer,
  } = useRequest(supplierBySku, {
    manual: true,
    onSuccess: (res) => {
      if (ToolUtil.isArray(res).length === 1 && [ERPEnums.inStock, ERPEnums.directInStock].includes(type)) {
        setData({
          ...data,
          customerId: res[0].customerId,
          customerName: res[0].customerName,
        });
      }
    },
  });

  const [data, setData] = useState({});

  const disabled = () => {
    const snameSku = skus.filter((item) => {
      return item.skuId === data.skuId
        &&
        (item.customerId || 0) === (data.customerId || 0)
        &&
        (item.brandId || 0) === (data.brandId || 0);
    });
    return snameSku.length > 0;
  };

  const openSkuAdd = (sku = {}, initType) => {
    const type = initType || defaultType;
    setType(type);
    setSku(sku);
    setImgUrl(Array.isArray(sku.imgUrls) && sku.imgUrls[0] || state.homeLogo);
    setData({ skuId: sku.skuId, skuResult: sku, stockNumber: sku.stockNumber, number: judge ? 0 : 1 });
    switch (type) {
      case ERPEnums.allocation:
        break;
      case ERPEnums.curing:
        break;
      case ERPEnums.stocktaking:
        addShop({
          data: {
            type,
            skuId: sku.skuId,
          },
        });
        break;
      case ERPEnums.outStock:
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
        };
      case ERPEnums.curing:
        return {
          title: '养护',
          disabledText,
        };
      case ERPEnums.stocktaking:
        return {
          title: '盘点',
          disabledText,
        };
      case ERPEnums.outStock:
        return {
          title: '出库',
          disabledText,
          customerDisabled: true,
        };
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
        if (ToolUtil.isArray(customerData).length === 0) {
          disabledText = '无供应商';
          disabled = true;
        } else if (!data.customerId) {
          disabledText = '请选择供应商';
          disabled = true;
        } else if (judge) {
          const positions = ToolUtil.isArray(data.positions);
          const inStock = positions.filter(item => item.number);
          if (inStock.length === 0) {
            disabledText = '请完善库位信息';
            disabled = true;
          }
        }
        return {
          title: '入库',
          disabled,
          disabledText,
        };
      default:
        return {};
    }
  };

  const add = () => {
    const positionNums = [];
    if (judge) {
      ToolUtil.isArray(data.positions).map(item => {
        if (item.number) {
          return positionNums.push({ positionId: item.id, num: item.number });
        }
        return null;
      });
    }


    addShop({
      data: {
        type,
        skuId: data.skuId,
        brandId: data.brandId,
        customerId: data.customerId,
        number: data.number,
        storehousePositionsId: data.positionId,
        positionNums,
      },
    });
  };

  const createBall = (top, left) => {

    const shop = document.getElementById('shop');

    if (!shop) {
      add();
      return;
    }
    let i = 0;

    const bar = document.createElement('div');

    bar.style.backgroundImage = `url(${imgUrl})`;
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
      if (i === 2) {
        add();
      }

    };
  };

  return <>
    <Popup
      destroyOnClose
      className={style.addSkuPopup}
      visible={visible}
      onMaskClick={() => {
        setVisible(false);
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
                otherData={ToolUtil.isArray(sku.brandResults).map(item => item.brandName).join(' / ')}
                gap={8}
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
              <div hidden={judge} className={style.flex}>
                <div className={style.instockNumber}>
                  {taskData().title}数量
                  <ShopNumber value={data.number} onChange={(number) => {
                    setData({ ...data, number });
                  }} />
                </div>
              </div>
              <div hidden={!disabled()} className={style.danger}>
                已办理{taskData().title}准备是否继续添加
              </div>
              <div hidden={!judge} className={style.flex}>
                <AddPosition
                  min={1}
                  skuNumber={1}
                  skuId={sku.skuId}
                  positions={data.positions}
                  setPositions={(positions) => {
                    setData({ ...data, positions });
                  }}
                />
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
                  disabled={taskData().disabled}
                  className={ToolUtil.classNames(style.ok, style.button)}
                  color='primary'
                  onClick={() => {
                    const skuImg = document.getElementById('skuImg');
                    const top = skuImg.getBoundingClientRect().top;
                    const left = skuImg.getBoundingClientRect().left;
                    setVisible(false);
                    createBall(top, left);
                  }}>
                  添加
                </Button>
              </div>
            </>

        }
      </div>
    </Popup>


    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1003)' }}
      columns={[[{ label: '其他品牌', value: 0 }, ...ToolUtil.isArray(sku.brandResults).map(item => {
        return {
          label: item.brandName,
          value: item.brandId,
        };
      })]]}
      visible={dataVisible === 'brand'}
      onClose={() => {
        setDataVisible(null);
      }}
      onConfirm={(value, options) => {
        const brand = ToolUtil.isArray(options.items)[0] || {};
        setData({
          ...data,
          brandId: brand.value,
          brandName: brand.label,
        });
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
      }}
    />
  </>;
};

export default React.forwardRef(AddSku);
