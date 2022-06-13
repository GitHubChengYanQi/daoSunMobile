import React, { useEffect, useState } from 'react';
import style from './index.less';
import { Badge, Button, Popup } from 'antd-mobile';
import SkuItem from '../../../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { RemoveButton } from '../../../../../../../components/MyButton';
import MyEmpty from '../../../../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';
import Icon from '../../../../../../../components/Icon';
import LinkButton from '../../../../../../../components/LinkButton';
import ShopNumber from '../ShopNumber';
import { useRequest } from '../../../../../../../../util/Request';
import { shopCartAllList, shopCartDelete, shopCartEdit } from '../../../../../Url';

const SkuShop = (
  {
    skus = [],
    onClear = () => {
    },
    setSkus = () => {
    },
    type,
    noClose,
    className,
  },
) => {

  const [visible, setVisible] = useState();

  const history = useHistory();

  const skuChange = (cartId, number) => {
    const newSkus = skus.map(item => {
      if (item.cartId === cartId) {
        return { ...item, number };
      }
      return item;
    });
    setSkus(newSkus);
  };

  const skuDelete = (cartIds = []) => {
    const newSkus = skus.filter(item => {
      return !cartIds.includes(item.cartId);
    });
    setSkus(newSkus);
  };

  const { run: showShop } = useRequest(shopCartAllList, {
    manual: true,
    onSuccess: (res) => {
      setSkus(ToolUtil.isArray(res).map((item) => {
        return {
          cartId: item.cartId,
          skuId: item.skuId,
          skuResult: item.skuResult,
          customerId: item.customerId,
          customerName: ToolUtil.isObject(item.customer).customerName,
          brandName: ToolUtil.isObject(item.brandResult).brandName,
          number: item.number,
        };
      }));
    },
  });

  const { run: shopDelete } = useRequest(shopCartDelete, {
    manual: true,
    onSuccess: (res) => {
      skuDelete(res);
    },
  });

  const { run: shopEdit } = useRequest(shopCartEdit, {manual: true});

  useEffect(() => {
    if (type) {
      showShop({
        data: {
          type,
        },
      });
    }
  }, []);

  const taskData = () => {
    switch (type) {
      case 'allocation':
        return {
          title: '调拨任务明细',
        };
      case 'curing':
        return {
          title: '养护任务明细',
        };
      case 'stocktaking':
        return {
          title: '盘点任务明细',
        };
      case 'outStock':
        return {
          title: '出库任务明细',
        };
      case 'inStock':
        return {
          title: '入库任务明细',
        };
      default:
        return {
          title: '选择明细',
        };
    }
  };

  return <>
    <Popup
      className={ToolUtil.classNames(style.popup, className)}
      visible={visible}
      onMaskClick={() => {
        setVisible(false);
      }}
    >
      <div className={style.popupTitle}>
        <div>
          {taskData().title}
        </div>
        <div className={style.empty} />
        <div onClick={() => {
          onClear();
          shopDelete({ data: { ids: skus.map(item => item.cartId) } });
        }}>
          <RemoveButton /> 全部清除
        </div>
      </div>

      <div className={style.skuList}>
        {skus.length === 0 && <MyEmpty description='请添加物料' />}
        {
          skus.map((item, index) => {
            const skuResult = item.skuResult || {};
            return <div key={index} className={style.skuItem}>
              <div className={style.sku}>
                <SkuItem
                  skuResult={skuResult}
                  imgSize={80}
                  gap={10}
                  extraWidth='130px'
                  otherData={item.customerName}
                />
              </div>
              <div className={style.action}>
                <RemoveButton onClick={() => {
                  shopDelete({ data: { ids: [item.cartId] } });
                }} />
                <div className={style.empty} />
                <ShopNumber
                  value={item.number}
                  unitName={ToolUtil.isObject(skuResult.spuResult && skuResult.spuResult.unitResult).unitName}
                  onChange={async (number) => {
                    const res = await shopEdit({ data: { cartId: item.cartId, number } });
                    skuChange(res, number);
                  }}
                />
              </div>
            </div>;
          })
        }
      </div>

    </Popup>

    <div className={style.bottom} id='shop'>
      <div className={style.bottomMenu}>
        <div className={style.shop} onClick={() => {
          setVisible(!visible);
        }}>
          <Badge content={skus.length || null} color='#FA8F2B' style={{ '--top': '5px', '--right': '5px' }}>
            <Icon
              id='shopIcon'
              type='icon-cangchuche'
              style={{ color: skus.length > 0 ? 'var(--adm-color-primary)' : '#B5B6B8' }}
            />
          </Badge>
          <div>已选<span>{skus.length}</span>类</div>
        </div>
        {!noClose && <LinkButton className={style.close} onClick={() => {
          history.goBack();
        }}>取消</LinkButton>}
        <Button
          disabled={skus.length === 0}
          color='primary'
          className={style.submit}
          onClick={() => {
            switch (type) {
              case 'allocation':
              case 'curing':
              case 'stocktaking':
                break;
              case 'outStock':
              case 'inStock':
                history.push({
                  pathname: '/Work/Instock/InstockAsk/Submit',
                  query: {
                    createType: type,
                  },
                  state: {
                    skus,
                  },
                });
                break;
              default:
                break;
            }
          }}>确认
        </Button>
      </div>
    </div>
  </>;
};

export default SkuShop;
