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
import Positions from '../../../../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/InstockShop/components/Positions';

const AddSku = (
  {
    onChange = () => {
    },
    type,
    skus = [],
    judge,
  }, ref) => {

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const [sku, setSku] = useState({});

  const [imgUrl, setImgUrl] = useState();

  const [visible, setVisible] = useState();

  const [dataVisible, setDataVisible] = useState();

  const { run: addShop } = useRequest(shopCartAdd, {
    manual: true,
    onSuccess: (res) => {
      onChange({ ...data, cartId: res });
    },
  });

  const {
    loading: getCustomerLoading,
    data: customerData,
    run: getCustomer,
  } = useRequest(supplierBySku, {
    manual: true,
    onSuccess: (res) => {
      if (ToolUtil.isArray(res).length === 1 && type === 'inStock') {
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
        (data.customerId ? item.customerId === data.customerId : true)
        &&
        (data.brandId ? item.brandId === data.brandId : true);
    });
    return snameSku.length > 0;
  };

  const openSkuAdd = (sku = {}) => {
    getCustomer({ data: { skuId: sku.skuId } });
    setSku(sku);
    setImgUrl(Array.isArray(sku.imgUrls) && sku.imgUrls[0] || state.homeLogo);
    setData({ skuId: sku.skuId, skuResult: sku, stockNumber: sku.stockNumber, number: 1 });
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    openSkuAdd,
  }));

  const taskData = () => {
    let disabledText = '添加';
    let disabled = false;
    switch (type) {
      case 'allocation':
        return {
          title: '调拨',
          disabledText,
        };
      case 'curing':
        return {
          title: '养护',
          disabledText,
        };
      case 'stocktaking':
        return {
          title: '盘点',
          disabledText,
        };
      case 'outStock':
        return {
          title: '出库',
          disabledText,
          customerDisabled: true,
        };
      case 'inStock':
        if (ToolUtil.isArray(customerData).length === 0) {
          disabledText = '无供应商';
          disabled = true;
        } else if (!data.customerId) {
          disabledText = '请选择供应商';
          disabled = true;
        } else if (judge && !data.positionId) {
          disabledText = '请选择库位';
          disabled = true;
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

  const createBall = (top, left) => {

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
      const shop = document.getElementById('shop');
      if (shop) {
        bar.style.left = (shop.offsetLeft + 36) + 'px';
        bar.style.top = (shop.offsetTop) + 'px';
      }
    }, 0);

    /**
     * 动画结束后，删除
     */
    bar.ontransitionend = () => {
      bar.remove();
      i++;
      if (i === 2) {
        addShop({
          data: {
            type,
            skuId: data.skuId,
            brandId: data.brandId,
            customerId: data.customerId,
            number: data.number,
            storehousePositionsId: data.positionId,
          },
        });
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
      {
        getCustomerLoading ? <MyLoading skeleton /> : <div className={style.addSku}>
          <SkuItem
            imgId='skuImg'
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
          <div hidden={!judge} className={style.flex}>
            <div className={style.checkLabel}>
              库位
            </div>
            <Button
              color='primary'
              fill='outline'
              className={style.check}
              onClick={() => {
                setDataVisible('position');
              }}
            >{data.positionName || '请选择库位'}</Button>
          </div>
          <div className={style.stockNumber}>
            <div>
              <div className={style.checkLabel}>库存</div>
              <span style={{ marginRight: 8 }}>
              {data.stockNumber}
            </span>
              {ToolUtil.isObject(sku.spuResult && sku.spuResult.unitResult).unitName}
            </div>
            <div className={style.instockNumber}>
              {taskData().title}数量
              <ShopNumber value={data.number} onChange={(number) => {
                setData({ ...data, number });
              }} />
            </div>
          </div>
        </div>
      }
      <div className={style.buttons}>
        <Button
          className={ToolUtil.classNames(style.close, style.button)}
          onClick={() => {
            setVisible(false);
          }}>
          取消
        </Button>
        <Button
          disabled={taskData().disabled || disabled()}
          className={ToolUtil.classNames(style.ok, style.button)}
          color='primary'
          onClick={() => {
            const skuImg = document.getElementById('skuImg');
            const top = skuImg.getBoundingClientRect().top;
            const left = skuImg.getBoundingClientRect().left;
            setVisible(false);
            createBall(top, left);
          }}>
          {disabled() ? '已添加' : taskData().disabledText}
        </Button>
      </div>
    </Popup>


    <Picker
      popupStyle={{ '--z-index': 'var(--adm-popup-z-index, 1002)' }}
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
        const customer = ToolUtil.isArray(options.items)[0] || {};
        setData({
          ...data,
          customerId: customer.value,
          customerName: customer.label,
        });
      }}
    />

    <Popup visible={dataVisible === 'position'} className={style.positionPopup}>
      <Positions
        onClose={() => setDataVisible(null)}
        onSuccess={(value = {}) => {
          setDataVisible(null);
          setData({
            ...data,
            positionId: value.id,
            positionName: value.name,
          });
        }} />
    </Popup>
  </>;
};

export default React.forwardRef(AddSku);
