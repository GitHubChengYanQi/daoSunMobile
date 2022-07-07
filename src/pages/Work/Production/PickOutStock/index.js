import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import {
  productionPickListCartGroupByUserList,
  productionPickListsCartDelete,
  productionPickListsSend,
} from '../components/Url';
import MyNavBar from '../../../components/MyNavBar';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Card, Checkbox, Collapse, List, SwipeAction, Toast } from 'antd-mobile';
import MyEllipsis from '../../../components/MyEllipsis';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../components/Label';
import BottomButton from '../../../components/BottomButton';
import Icon from '../../../components/Icon';

const PickOutStock = (props) => {

  const params = props.location.query;

  const [carts, setCarts] = useState([]);

  const { loading, data, run, refresh } = useRequest(productionPickListCartGroupByUserList,
    {
      manual: true,
    });

  const { loading: pickLoading, run: pickRun } = useRequest(productionPickListsSend, {
    manual: true,
    onSuccess: () => {
      setCarts([]);
      Toast.show({
        content: '提醒领取成功！',
        position: 'bottom',
      });
    },
  });

  const { loading: deleteLoading, run: deleteRun } = useRequest(productionPickListsCartDelete, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '移出成功！',
        position: 'bottom',
      });
      refresh();
    },
  });

  useEffect(() => {
    if (params.ids) {
      run({
        data: {
          pickListsIds: params.ids.split(','),
        },
      }).then((res)=>{
        const cartsParams = [];
        const userIds = [];
        res.map((item) => {
          userIds.push(item.userId);
          return item.cartResults && item.cartResults.map((cartItem) => {
            return cartsParams.push({
              key: cartItem.pickListsCart,
              skuId: cartItem.skuId,
              number: cartItem.number,
              pickListsCart: cartItem.pickListsCart,
              pickListsId: cartItem.pickListsId,
              storehouseId: cartItem.storehouseId,
              storehousePositionsId: cartItem.storehousePositionsId,
            });
          });
        });
        if (userIds.length > 0 && cartsParams.length > 0) {
          pickRun({
            data: {
              userIds,
              cartsParams,
            },
          });
        }
      });
    }
  }, []);

  if (loading) {
    return <MyLoading />;
  }

  if (!data || data.filter((item) => item.cartResults && item.cartResults.length === 0).length === data.length) {
    return <div>
      <MyNavBar title='备料详情' />
      <MyEmpty />
    </div>;
  }

  const getKey = (key) => {
    return carts.map(item => item.key).includes(key);
  };

  return <div style={{ paddingBottom: 16 }}>
    <div style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 99 }}>
      <MyNavBar title='备料详情' />
    </div>
    <div style={{ marginBottom: 60 }}>
      {
        data.map((item, index) => {
          const userId = item.userId;
          const userKey = `userId${item.userId}`;
          const cartResults = item.cartResults || [];
          if (cartResults.length === 0) {
            return null;
          }
          const productionPickListsResults = [];
          cartResults.map(item => {
            if (!productionPickListsResults.map(item => item.pickListsId).includes(item.pickListsId)) {
              productionPickListsResults.push(item.productionPickListsResult);
            }
            return null;
          });
          return <Card
            style={{ margin: 8 }}
            bodyStyle={{ padding: 0 }}
            title={<Checkbox
              checked={getKey(userKey)}
              icon={checked =>
                checked ? <Icon type='icon-duoxuanxuanzhong1' /> : <Icon type='icon-a-44-110' />
              }
              onChange={(checked) => {
                const key = userKey;
                if (checked) {
                  const skus = cartResults.filter(item => !getKey(item.pickListsCart)).map((cartItem) => {
                    return {
                      key: cartItem.pickListsCart,
                      skuId: cartItem.skuId,
                      userId,
                      number: cartItem.number,
                      pickListsCart: cartItem.pickListsCart,
                      pickListsId: cartItem.pickListsId,
                      storehouseId: cartItem.storehouseId,
                      storehousePositionsId: cartItem.storehousePositionsId,
                    };
                  });
                  setCarts([...carts, { key, userId }, ...skus]);
                } else {
                  const array = carts.filter((item) => {
                    return item.key !== key && !cartResults.map(item => item.pickListsCart).includes(item.key);
                  });
                  setCarts(array);
                }
              }}
            >
              <div>{item.name}</div>
            </Checkbox>}
            key={index}>
            <List
              style={{
                '--border-top': 'none',
                '--border-bottom': 'none',
              }}
            >
              {
                cartResults.length === 0 ?
                  <MyEmpty />
                  :
                  cartResults.map((cartItem, index) => {
                    const skuResult = cartItem.skuResult || {};
                    return <List.Item
                      style={{ padding: 0 }}
                      key={index}
                      arrow={false}
                    >
                      <SwipeAction
                        rightActions={[
                          {
                            key: 'delete',
                            text: '移出',
                            color: 'danger',
                            onClick: () => {
                              deleteRun({
                                data: {
                                  pickListsCart: cartItem.pickListsCart,
                                },
                              });
                            },
                          },
                        ]}
                      >
                        <div style={{ display: 'flex', padding: '0 8px' }}>
                          <div style={{ flexGrow: 1 }}>
                            <MyEllipsis>{SkuResultSkuJsons({ skuResult })}</MyEllipsis>
                            <div style={{ display: 'flex', fontSize: '4vw' }}>
                              <Label>描述：</Label>
                              <MyEllipsis width='60%'>
                                {SkuResultSkuJsons({ skuResult ,describe:true})}</MyEllipsis>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            × {cartItem.number}
                          </div>
                        </div>
                      </SwipeAction>
                    </List.Item>;
                  })
              }
            </List>
            <Collapse>
              <Collapse.Panel key='1' title='查看关联领料单'>
                {productionPickListsResults.map((item, index) => {
                  return <div key={index}>
                    <Label>领料单编码：</Label>{item.coding}
                  </div>;
                })}
              </Collapse.Panel>
            </Collapse>

          </Card>;
        })
      }
    </div>

    <BottomButton
      only
      disabled={carts.filter((item) => {
        return item.skuId;
      }).length === 0}
      text='再次提醒领取'
      onClick={() => {
        const array = carts.filter((item) => {
          return item.skuId;
        });
        pickRun({
          data: {
            userIds: array.map(item => item.userId),
            cartsParams: array,
          },
        });
      }}
    />

    {(pickLoading || deleteLoading) && <MyLoading />}

  </div>;
};

export default PickOutStock;
