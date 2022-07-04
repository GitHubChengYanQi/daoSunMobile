import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import { Badge, Button, Popup, Tabs } from 'antd-mobile';
import SkuItem from '../../../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import MyEmpty from '../../../../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';
import Icon from '../../../../../../../components/Icon';
import LinkButton from '../../../../../../../components/LinkButton';
import ShopNumber from '../ShopNumber';
import { useRequest } from '../../../../../../../../util/Request';
import { shopCartAddList, shopCartApplyList, shopCartDelete, shopCartEdit } from '../../../../../Url';
import MyCheck from '../../../../../../../components/MyCheck';
import { MyLoading } from '../../../../../../../components/MyLoading';
import { ERPEnums } from '../../../../../../Stock/ERPEnums';
import { judgeLoginUser } from '../../../../Submit/components/InstockSkus';
import MyRemoveButton from '../../../../../../../components/MyRemoveButton';
import AddSku from '../AddSku';

const SkuShop = (
  {
    checked,
    checkSkus = [],
    batch,
    skus = [],
    onClear = () => {
    },
    emptyHidden,
    setSkus = () => {
    },
    taskTypeChange = () => {
    },
    type,
    switchType,
    noClose,
    className,
    selectAll = () => {
    },
    onCancel = () => {
    },
    onDelete = () => {
    },
    judge,
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

  const { loading: shopLoading, run: showShop, refresh: shopRefresh } = useRequest(shopCartApplyList, {
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
      onDelete();
    },
  });

  const { loading: addListLoading, run: addList } = useRequest(shopCartAddList, {
    manual: true,
    onSuccess: () => {
      onCancel();
      shopRefresh();
    },
  });

  const { run: shopEdit } = useRequest(shopCartEdit, { manual: true });

  const [tasks, setTasks] = useState([
    { title: '出库申请', key: ERPEnums.outStock },
    { title: '盘点申请', key: ERPEnums.stocktaking },
    { title: '调拨申请', key: ERPEnums.allocation },
    { title: '入库申请', key: ERPEnums.inStock },
    // { title: '养护任务', key: ERPEnums.curing },
  ]);


  const { loading, data: judgeData, run: judgeRun } = useRequest(judgeLoginUser, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        setTasks([...tasks, { title: '直接入库', key: ERPEnums.directInStock }]);
      }
    },
  });

  const addRef = useRef();

  useEffect(() => {
    if (switchType) {
      judgeRun();
    }
  }, []);

  useEffect(() => {
    if (type) {
      if (type === ERPEnums.directInStock && !judgeData) {
        judgeRun();
      }
      showShop({
        data: {
          type,
        },
      });
    }
  }, [type]);

  const taskData = (item = {}) => {
    switch (type) {
      case ERPEnums.allocation:
        return {
          title: '调拨任务明细',
          type: '调拨申请',
        };
      case ERPEnums.curing:
        return {
          title: '养护任务明细',
          type: '养护申请',
        };
      case ERPEnums.stocktaking:
        return {
          title: '盘点任务明细',
          type: '盘点申请',
          numberHidden: true,
        };
      case ERPEnums.outStock:
        return {
          title: '出库任务明细',
          otherData: [ item.brandName || '任意品牌'],
          type: '出库申请',
        };
      case ERPEnums.inStock:
        return {
          title: '入库任务明细',
          type: '入库申请',
          otherData: [item.customerName, item.brandName || '无品牌'],
        };
      case ERPEnums.directInStock:
        let number = 0;
        const positions = ToolUtil.isArray(item.positions).map(item => {
          number += item.number;
          return `${item.name}(${item.number})`;
        });
        return {
          title: '入库任务明细',
          type: '入库申请',
          judge: true,
          otherData: [item.customerName, item.brandName],
          more: positions.join('、'),
          number,
        };
      default:
        return {
          title: '选择明细',
        };
    }
  };

  if (emptyHidden && skus.length === 0) {
    return <></>;
  }

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
          物料明细
        </div>
        <div className={style.empty} />
        <MyRemoveButton onRemove={() => {
          onClear();
          shopDelete({ data: { ids: skus.map(item => item.cartId) } });
        }}>
          全部清除
        </MyRemoveButton>
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
                  gap={8}
                  extraWidth={taskData().judge ? '50px' : '130px'}
                  otherData={taskData(item).otherData}
                  more={taskData(item).more}
                  moreClick={() => {
                    if (type === ERPEnums.directInStock) {
                      addRef.current.openSkuAdd(skuResult, type, item);
                    }
                  }}
                />
              </div>
              <div className={style.action}>
                <div className={style.removeButton}>
                  <MyRemoveButton onRemove={() => {
                    shopDelete({ data: { ids: [item.cartId] } });
                  }} />
                </div>

                <div hidden={taskData().numberHidden}>
                  <ShopNumber
                    show={taskData().judge}
                    id={`stepper${index}`}
                    value={taskData().judge ? taskData(item).number : item.number}
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
    <div hidden={!batch} className={style.batch}>
      <div className={style.all}>
        <MyCheck checked={checked} className={style.checkButton} fontSize={14} onChange={() => {
          selectAll();
        }}>全选</MyCheck>
        <div className={style.checkNumber}>已选中 <span>{checkSkus.length}</span> 类</div>
      </div>
      <Button
        disabled={checkSkus.length === 0}
        color='primary'
        fill='outline'
        onClick={() => {
          addList({
            data: {
              shopCartParams: checkSkus.map(item => {
                return {
                  type,
                  skuId: item.skuId,
                };
              }),
            },
          });
        }}
      >添加</Button>
    </div>
    <div className={style.bottom} id='shop'>

      <div className={style.bottomMenu}>
        <div className={style.shop} onClick={() => {
          showShop({
            data: {
              type,
            },
          });
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
              case ERPEnums.allocation:
              case ERPEnums.curing:
                break;
              case ERPEnums.stocktaking:
              case ERPEnums.outStock:
              case ERPEnums.inStock:
              case ERPEnums.directInStock:
                history.push({
                  pathname: '/Work/Instock/InstockAsk/Submit',
                  query: {
                    createType: type,
                  },
                  state: {
                    skus,
                    judge: taskData().judge,
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

    <AddSku ref={addRef} defaultAction='edit' onClose={() => {
      shopRefresh();
    }} />

    {(shopLoading || addListLoading || loading) && <MyLoading />}
  </>;
};

export default SkuShop;
