import React, { useEffect, useState } from 'react';
import style from './index.less';
import { Badge, Button, Popup, Tabs } from 'antd-mobile';
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
    taskTypeChange = () => {
    },
    type,
    switchType,
    noClose,
    className,
    judge,
    ask,
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
          brandId: item.brandId,
          number: item.number,
          positions: ToolUtil.isArray(item.storehousePositions).map(item => {
            return {
              id: item.storehousePositionsId,
              name: item.name,
              number: item.number,
            };
          }),
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

  const { run: shopEdit } = useRequest(shopCartEdit, { manual: true });

  useEffect(() => {
    if (type) {
      showShop({
        data: {
          type,
        },
      });
    }
  }, [type]);

  const taskData = (item = {}) => {
    switch (type) {
      case 'allocation':
        return {
          title: '调拨任务明细',
          type: '调拨申请',
        };
      case 'curing':
        return {
          title: '养护任务明细',
          type: '养护申请',
        };
      case 'stocktaking':
        return {
          title: '盘点任务明细',
          type: '盘点申请',
        };
      case 'outStock':
        return {
          title: '出库任务明细',
          otherData: item.brandName,
          type: '出库申请',
        };
      case 'inStock':
      case 'directInStock':
        let number = 0;
        const positions = ToolUtil.isArray(item.positions).map(item => {
          number += item.number;
          return `${item.name}(${item.number})`;
        });
        return {
          title: '入库任务明细',
          type: '入库申请',
          otherData: `${item.customerName || '-'} /  ${item.brandName || '-'}`,
          more: judge && positions.join('、'),
          number,
        };
      default:
        return {
          title: '选择明细',
        };
    }
  };

  const tasks = [
    { title: '出库任务', key: 'outStock' },
    { title: '入库任务', key: 'inStock' },
    { title: '盘点任务', key: 'stocktaking' },
    { title: '调拨任务', key: 'allocation' },
    { title: '养护任务', key: 'curing' },
  ];

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

      {switchType && <Tabs className={style.tabs} activeKey={type} onChange={(key) => {
        taskTypeChange(key);
      }}>
        {tasks.map(item => {
          return <Tabs.Tab {...item} />;
        })}

      </Tabs>}
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
                  extraWidth={judge ? '50px' : '130px'}
                  otherData={taskData(item).otherData}
                  more={taskData(item).more}
                />
              </div>
              <div className={style.action}>
                <RemoveButton onClick={() => {
                  shopDelete({ data: { ids: [item.cartId] } });
                }} />
                <div>
                  <ShopNumber
                    show={judge}
                    id={`stepper${index}`}
                    value={judge ? taskData(item).number : item.number}
                    onChange={async (number) => {
                      const res = await shopEdit({ data: { cartId: item.cartId, number } });
                      skuChange(res, number);
                    }}
                  />
                </div>
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
          <div>
            <div className={style.type}>{taskData().type}</div>
            <div className={style.shopNumber}>已选<span>{skus.length}</span>类</div>
          </div>
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
              case 'directInStock':
                history.push({
                  pathname: '/Work/Instock/InstockAsk/Submit',
                  query: {
                    createType: type,
                  },
                  state: {
                    skus,
                    judge,
                  },
                });
                break;
              default:
                break;
            }
          }}>{ask ? '发起申请' : '确认'}
        </Button>
      </div>
    </div>
  </>;
};

export default SkuShop;
