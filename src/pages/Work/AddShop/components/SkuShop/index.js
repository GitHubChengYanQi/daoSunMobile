import React, { useEffect, useRef, useState } from 'react';
import style from './index.less';
import { Button, Popup, Tabs } from 'antd-mobile';
import SkuItem from '../../../Sku/SkuItem';
import { ToolUtil } from '../../../../components/ToolUtil';
import MyEmpty from '../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';
import ShopNumber from '../ShopNumber';
import { useRequest } from '../../../../../util/Request';
import { shopCartApplyList, shopCartDelete, shopCartEdit } from '../../../Instock/Url';
import { MyLoading } from '../../../../components/MyLoading';
import { ERPEnums } from '../../../Stock/ERPEnums';
import { judgeLoginUser } from '../../../CreateTask';
import MyRemoveButton from '../../../../components/MyRemoveButton';
import AddSku from '../AddSku';
import LinkButton from '../../../../components/LinkButton';
import MyAntPopup from '../../../../components/MyAntPopup';
import AllocationAdd from '../AddSku/components/AllocationAdd';
import Bouncing from '../../../../components/Bouncing';
import shop from '../../../../../assets/shop.png';
import shopEmpty from '../../../../../assets/shopEmpty.png';

const SkuShop = (
  {
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
    className,
    onDelete = () => {
    },
    shopRef,
  },
) => {

  const [visible, setVisible] = useState();

  const [allocationView, setAllocationView] = useState();

  const history = useHistory();

  const query = history.location.query;

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

        let allocationJson = {};
        try {
          allocationJson = JSON.parse(item.allocationJson || '');
        } catch (e) {

        }

        return {
          cartId: item.cartId,
          skuId: item.skuId,
          skuResult: item.skuResult,
          customerId: item.customerId,
          customerName: ToolUtil.isObject(item.customer).customerName,
          brandName: ToolUtil.isObject(item.brandResult).brandName,
          brandId: item.brandId,
          number: item.number,
          positionNums: item.positionNums,
          positions: ToolUtil.isArray(item.storehousePositions).map(item => {
            return {
              id: item.storehousePositionsId,
              name: item.name,
              number: item.number,
            };
          }),
          allocationJson,
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

  const { loading: editLoading, run: shopEdit } = useRequest(shopCartEdit, {
    manual: true,
    onSuccess: () => {
      if (type === ERPEnums.allocation) {
        setAllocationView(false);
        shopRefresh();
      }
    },
  });

  const [tasks, setTasks] = useState([
    { title: '出库申请', key: ERPEnums.outStock },
    { title: '入库申请', key: ERPEnums.inStock },
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
  }, [type, history.location.query.createType]);

  const taskData = (item = {}) => {
    const skuClassName = item?.skuResult?.spuResult?.spuClassificationResult?.name;
    switch (type) {
      case ERPEnums.allocation:
        const allocationJson = item.allocationJson || {};
        const brands = ToolUtil.isObject(allocationJson.start).brands || [];
        return {
          title: '调拨任务明细',
          type: query.storeHouse + (query.askType === 'moveLibrary' ? '移库' : (query.allocationType === 'out' ? '调出' : '调入')),
          otherData: [
            brands.length > 0 ? brands.filter(item => item.show).map(item => item.brandName).join(' / ') : '任意品牌',
            <LinkButton onClick={() => setAllocationView({
              cartId: item.cartId,
              ...item.skuResult,
              number: item.number,
              allocationJson: item.allocationJson,
            })}>查看详情</LinkButton>,
          ],
          min: 1,
          show: true,
        };
      case ERPEnums.outStock:
        return {
          title: '出库任务明细',
          otherData: [
            item.brandName || '任意品牌',
            skuClassName,
          ],
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
          show: true,
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
      getContainer={null}
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
        <MyRemoveButton disabled={skus.length === 0} onRemove={() => {
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
                  noView
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
                    show={taskData().show}
                    id={`stepper${index}`}
                    min={taskData().min}
                    value={taskData().judge ? taskData(item).number : item.number}
                    onChange={async (number) => {
                      let newNumber = 0;
                      if (taskData().max) {
                        newNumber = number > skuResult.stockNumber ? skuResult.stockNumber : number;
                      } else {
                        newNumber = number;
                      }
                      const res = await shopEdit({ data: { cartId: item.cartId, number: newNumber } });
                      skuChange(res, newNumber);
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
          showShop({
            data: {
              type,
            },
          });
          setVisible(!visible);
        }}>
          <div className={style.info}>
            <Bouncing
              color='#FA8F2B'
              ref={shopRef}
              size={24}
              img={skus.length > 0 ? shop : shopEmpty}
              number={skus.length}
            />
            <div className={style.data}>
              <div className={style.type}>{taskData().type}</div>
              <div className={style.shopNumber}>已选<span className={style.number}>{skus.length}</span>类</div>
            </div>
          </div>
          {ERPEnums.outStock === type && <LinkButton onClick={() => {
            history.push('/Work/OutStock/BomAdd');
          }}>按BOM添加</LinkButton>}
        </div>
        <Button
          disabled={skus.length === 0}
          color='primary'
          className={style.submit}
          onClick={() => {
            switch (type) {
              case ERPEnums.allocation:
                history.push({
                  pathname: '/Work/CreateTask',
                  query: {
                    createType: type,
                    ...history.location.query,
                  },
                });
                break;
              case ERPEnums.outStock:
              case ERPEnums.inStock:
              case ERPEnums.directInStock:
                history.push({
                  pathname: '/Work/CreateTask',
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

    <MyAntPopup
      title={taskData().type}
      onClose={() => {
        setAllocationView(false);
      }}
      destroyOnClose
      className={style.addSkuPopup}
      visible={allocationView}
    >
      <AllocationAdd
        open
        query={query}
        sku={allocationView}
        onClose={() => {
          setAllocationView(false);
        }}
        shopEdit={(data) => {
          shopEdit({ data });
        }}
      />
    </MyAntPopup>

    {(shopLoading || loading || editLoading) && <MyLoading />}
  </>;
};

export default SkuShop;
