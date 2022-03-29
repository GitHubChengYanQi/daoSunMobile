import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionPickListCartGroupByUserList, productionPickListsCreateOutOrder } from '../components/Url';
import MyNavBar from '../../../components/MyNavBar';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Card, Checkbox, Collapse, Dialog, List, Space, Toast } from 'antd-mobile';
import MyEllipsis from '../../../components/MyEllipsis';
import SkuResult_skuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../components/Label';
import BottomButton from '../../../components/BottomButton';
import Icon from '../../../components/Icon';
import Number from '../../../components/Number';

const PickOutStock = (props) => {

  const params = props.location.query;

  const [visible, setVisible] = useState();

  const [code, setCode] = useState();

  const [carts, setCarts] = useState([]);

  const { loading, data, run, refresh } = useRequest(productionPickListCartGroupByUserList, { manual: true });

  const { loading: outLoading, run: outstock } = useRequest(productionPickListsCreateOutOrder, {
    manual: true,
    onSuccess: () => {
      refresh();
      setCarts([]);
      setCode(null);
      setVisible(false);
      Toast.show({
        content: '出库成功！',
        position: 'bottom',
      });
    },
    onError: () => {
      Toast.show({
        content: '出库失败！',
        position: 'bottom',
      });
    },
  });

  useEffect(() => {
    if (params.ids) {
      run({
        data: {
          pickListsIds: params.ids.split(','),
        },
      });
    }
  }, []);

  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const getKey = (key) => {
    return carts.map(item => item.key).includes(key);
  };

  const skuChecked = (checked, cartItem, cartResults, userKey, userId) => {
    const object = {
      key: cartItem.pickListsCart,
      skuId: cartItem.skuId,
      number: cartItem.number,
      userId,
      pickListsId: cartItem.pickListsId,
      storehouseId: cartItem.storehouseId,
      storehousePositionsId: cartItem.storehousePositionsId,
    };
    if (checked) {
      const array = carts.filter((item) => {
        return item.userId === userId;
      });
      if ((cartResults.filter(item => getKey(item.pickListsCart)).length + 1) === cartResults.length) {
        setCarts([...array, object, { key: userKey }]);
      } else {
        setCarts([...array, object]);
      }

    } else {
      const array = carts.filter((item) => {
        return item.key !== userKey && item.key !== cartItem.pickListsCart;
      });
      setCarts(array);
    }
  };

  return <div style={{ paddingBottom: 16 }}>
    <div style={{ position: 'sticky', top: 0,backgroundColor:'#fff',zIndex:99 }}>
      <MyNavBar title='出库详情' />
    </div>
    <div style={{ marginBottom: 60 }}>
      {
        data.map((item, index) => {
          const userId = item.userId;
          const userKey = `userId${item.userId}`;
          const cartResults = item.cartResults || [];
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
                      pickListsId: cartItem.pickListsId,
                      storehouseId: cartItem.storehouseId,
                      storehousePositionsId: cartItem.storehousePositionsId,
                    };
                  });
                  const array = carts.filter((item) => {
                    return item.userId === userId;
                  });
                  setCarts([...array, { key, userId }, ...skus]);
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
                      extra={`× ${cartItem.number}`}
                      onClick={() => {
                        skuChecked(!getKey(cartItem.pickListsCart), cartItem, cartResults, userKey, userId);
                      }}
                    >
                      <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                          <Checkbox
                            checked={getKey(cartItem.pickListsCart)}
                            icon={checked =>
                              checked ? <Icon type='icon-duoxuanxuanzhong1' /> : <Icon type='icon-a-44-110' />
                            }
                          />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <MyEllipsis><SkuResult_skuJsons skuResult={skuResult} /></MyEllipsis>
                          <div>
                            <Label style={{ fontSize: '4vw' }}>描述：</Label>
                            <MyEllipsis
                              width='60%'
                              smallFont
                            ><SkuResult_skuJsons
                              skuResult={skuResult}
                              describe /></MyEllipsis>
                          </div>
                        </div>
                      </div>

                    </List.Item>;
                  })
              }
            </List>
            <Collapse>
              <Collapse.Panel key='1' title='查看关联领料单'>
                {productionPickListsResults.map((item, index) => {
                  return <div key={index}>
                    <Label>领料单编码：</Label>{item.pickListsId}
                  </div>;
                })}
              </Collapse.Panel>
            </Collapse>

          </Card>;
        })
      }
    </div>
    <Dialog
      visible={visible}
      title='请输入领料码'
      content={<>
        <Number onChange={setCode} value={code} />
      </>}
      onAction={(action) => {
        if (action.key === 'ok') {
          if (!code) {
            return Toast.show({ content: '请输入领料码!', position: 'bottom' });
          }
          const array = carts.filter((item) => {
            return item.skuId;
          });
          outstock({
            data: {
              code,
              pickListsDetailParams: array.map((item) => {
                return {
                  ...item,
                  pickListsCartId: item.key,
                };
              }),
            },
          });
        } else {
          setCode(null);
          setVisible(false);
        }
      }}
      actions={[[{
        text: '取消',
        key: 'close',
      }, {
        text: '确定',
        key: 'ok',
      }]]}
    />

    <BottomButton
      only
      disabled={carts.filter((item) => {
        return item.skuId;
      }).length === 0}
      text='出库'
      onClick={() => {
        setVisible(true);
      }}
    />

    {outLoading && <MyLoading />}

  </div>;
};

export default PickOutStock;
