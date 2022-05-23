import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import {
  productionPickListsCartAdd,
  productionPickListsMergeDetail,
} from '../components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import {
  Badge,
  Button,
  Card,
  Collapse,
  Divider,
  List,
  Space,
  Toast,
} from 'antd-mobile';
import Label from '../../../components/Label';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import BottomButton from '../../../components/BottomButton';
import Icon from '../../../components/Icon';
import MyEllipsis from '../../../components/MyEllipsis';
import SkuResult_skuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import Carts from './components/Carts';
import MyPopup from '../../../components/MyPopup';
import { history } from 'umi';
import style from './index.css';
import MyTree from '../../../components/MyTree';
import { CollectMoneyOutline } from 'antd-mobile-icons';
import { ToolUtil } from '../../../components/ToolUtil';

const PickDetail = (props) => {

  const params = props.location.query;

  const seeCarts = useRef();

  const [skus, setSkus] = useState([]);

  const [data, setData] = useState();

  const [positions, setPositions] = useState({});

  const getSkuResults = (skuId, item, array, cart) => {
    if (array.length === 0) {
      return null;
    }
    let number = 0;
    let pickLists = [];
    array.map((item) => {
      number += item.number;
      if (pickLists.map(item => item.userId).includes(item.userResult && item.userResult.userId)) {
        return pickLists = pickLists.map((userItem) => {
          if (userItem.userId === (item.userResult && item.userResult.userId)) {
            return {
              ...userItem,
              number: item.number + userItem.number,
              lists: [...userItem.lists, item],
            };
          }
          return userItem;
        });
      }
      return pickLists.push({
        userId: item.userResult && item.userResult.userId,
        userResult: item.userResult,
        number: item.number,
        lists: [item],
      });
    });
    return {
      skuId,
      skuResult: array[0].skuResult,
      positionId: item.storehousePositionsId,
      storehouseId: item.storehouseId,
      number,
      pickLists,
      cart,
    };
  };

  const getChildren = (data, details = [], cartResults = [], top, positionId = []) => {

    if (!Array.isArray(data)) {
      return null;
    }

    const skuResults = [];
    const option = [];

    data.map((item) => {
      if (positionId.includes(item.storehousePositionsId)) {
        return null;
      }
      positionId.push(item.storehousePositionsId);
      const carts = [];
      const detailSkus = [];
      item.skuIds && item.skuIds.map((skuId) => {
        const sku = details.filter(item => skuId === item.skuId);
        const allCarts = cartResults.filter(item => skuId === item.skuId);
        const objectSku = getSkuResults(skuId, item, sku);
        const cartResult = getSkuResults(skuId, item, allCarts, true);
        if (objectSku) {
          skuResults.push(objectSku);
          detailSkus.push(objectSku);
        }
        if (cartResult) {
          carts.push(cartResult);
          skuResults.push(cartResult);
        }

        return null;
      });
      return option.push({
        icon: <CollectMoneyOutline />,
        title: `${item.name} (${item.skuIds ? item.skuIds.length : 0})`,
        key: item.storehousePositionsId,
        skus: [...detailSkus, ...carts],
        children: !top && getChildren(item.storehousePositionsResults, details, cartResults),
      });
    });

    if (top) {
      return [{
        icon: <CollectMoneyOutline />,
        title: `全部 (${skuResults.length})`,
        key: 'all',
        skus: skuResults,
        children: getChildren(data, details, cartResults),
      }];
    }
    if (data.length === 0) {
      return null;
    }
    return option;
  };

  const getSkus = (extend) => {
    if (extend && Array.isArray(extend.skus)) {
      setSkus(extend.skus);
    }
  };

  const getChecked = (data, key) => {
    if (Array.isArray(data)) {
      const array = data.filter((item) => {
        return item.key = key;
      });
      if (array.length === 1) {
        return array[0];
      } else {
        return getChecked(data.children, key);
      }
    } else {
      return null;
    }
  };

  const { loading, run, refresh } = useRequest(productionPickListsMergeDetail, {
    manual: true,
    onSuccess: (respone) => {
      const res = ToolUtil.unzip(respone);
      console.log(res);
      setData(res);
      const allSku = getChildren(res && res.storehousePositionsResults, res && res.detailResults, res && res.cartResults, true) || [];
      if (positions.key) {
        const checked = getChecked(allSku, positions.key) || {};
        setPositions(checked);
        getSkus(checked);
      } else {
        setPositions(allSku[0]);
        getSkus(allSku[allSku.length - 1]);
      }

    },
  });

  const options = getChildren(data && data.storehousePositionsResults, data && data.detailResults, data && data.cartResults, true) || [];

  const { loading: pickLoading, run: pick } = useRequest(productionPickListsCartAdd, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '备料成功！',
        position: 'bottom',
      });
      refresh();
    },
    onError(err) {
      Toast.show({
        content: '备料失败！',
        position: 'bottom',
      });
    },
  });

  useEffect(() => {
    if (params.ids && params.ids.split(',')) {
      run({ data: { pickListsIds: params.ids.split(',') } });
    }
  }, []);

  if (!data) {
    if (loading) {
      return <MyLoading />;
    }
    return <MyEmpty />;
  }


  const backgroundDom = () => {

    const list = data && data.productionTaskResults || [];

    return <Card
      style={{ backgroundColor: '#fff' }}>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        {
          list.map((item, index) => {
            return <div key={index}><Space direction='vertical' key={index}>
              <div>
                <Label>编码：</Label>{item.coding}
              </div>
              <div>
                <Label>创建时间：</Label>{item.createTime}
              </div>
            </Space>
              <Divider />
            </div>;
          })
        }
      </List>
    </Card>;
  };

  return <div>
    <MyNavBar title='领料详情' />
    <div>
      <MyFloatingPanel
        backgroundColor
        maxHeight={window.innerHeight - (ToolUtil.isQiyeWeixin() ? 0 : 45)}
        backgroundDom={backgroundDom()}
      >
        <div>
          {options.length !== 0 &&
            <div
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#fff',
                zIndex: 999,
                textAlign: 'center',
                marginBottom: 16,
              }}>
              <MyTree options={options} value={positions.key} onNode={(value) => {
                setPositions(value);
                getSkus(value);
              }}>
                {positions.title && positions.title.split('(')[0] || '请选择库位'}
              </MyTree>
            </div>}
          <div style={{ backgroundColor: '#eee', padding: '16px 0', paddingBottom: 60 }}>
            {
              skus.length === 0
                ?
                <MyEmpty description='全部领料完成' />
                :
                skus.map((item, index) => {
                  const objectList = [];
                  item.pickLists.map((pickItem) => {
                    return pickItem.lists.map((listItem) => {
                      return objectList.push({
                        skuId: item.skuId,
                        userId: pickItem.userResult && pickItem.userResult.userId,
                        number: listItem.number,
                        pickListsId: listItem.pickListsId,
                        storehouseId: item.storehouseId,
                        storehousePositionsId: item.positionId,
                        pickListsDetailId: listItem.pickListsDetailId,
                      });
                    });
                  });
                  const skuResult = item.skuResult || {};
                  return <div key={index} style={{ margin: 8 }}>
                    <Card style={{ borderRadius: 0 }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '80vw' }}>
                          <MyEllipsis><SkuResult_skuJsons skuResult={skuResult} /></MyEllipsis>
                          <div style={{ display: 'flex', fontSize: '4vw' }}>
                            <Label>描述：</Label>
                            <MyEllipsis width='60%'><SkuResult_skuJsons skuResult={skuResult} describe /></MyEllipsis>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          × {item.number}
                        </div>
                      </div>
                      <Collapse className={style.list}>
                        <Collapse.Panel style={{ border: 'none' }} key='1'
                                        title={<div style={{ fontSize: '4vw' }}>查看关联领料单</div>}>
                          <Collapse className={style.list}>
                            {
                              item.pickLists.map((item, index) => {
                                return <Collapse.Panel
                                  style={{ border: 'none' }}
                                  key={index}
                                  title={<div style={{ color: '#000', fontSize: '4vw' }}>
                                    <Label>领料人：</Label>{item.userResult && item.userResult.name}
                                    <span style={{ float: 'right' }}>数量：{item.number}</span>
                                  </div>}
                                >
                                  <div style={{ paddingLeft: 8 }}>
                                    {
                                      item.lists.map((item, index) => {
                                        return <div key={index} style={{ color: '#000', fontSize: '4vw' }}>
                                          <Label>领料单：</Label>{item.pickListsCoding}
                                          <span style={{ float: 'right' }}>
                                            <Label>数量：</Label>
                                            <span style={{ minWidth: 20, display: 'inline-block' }}>
                                              {item.number}
                                            </span>
                                          </span>
                                        </div>;
                                      })
                                    }
                                  </div>
                                </Collapse.Panel>;
                              })
                            }
                          </Collapse>
                        </Collapse.Panel>
                      </Collapse>
                    </Card>
                    <div>
                      <Button
                        disabled={item.cart}
                        onClick={() => {
                          pick({
                            data: {
                              productionPickListsCartParams: objectList,
                            },
                          });
                        }}
                        style={{
                          width: '100%',
                          color: 'var(--adm-color-primary)',
                          '--border-radius': '0px',
                          borderLeft: 'none',
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                          borderRight: 'none',
                        }}
                      >
                        {item.cart ? '已备料' : '备料'}
                      </Button>
                    </div>
                  </div>;
                })
            }
          </div>
        </div>
      </MyFloatingPanel>
    </div>


    <BottomButton
      leftText={<Badge content={data.cartResults && data.cartResults.length}><Space style={{ margin: '0 16px' }}><Icon
        type='icon-gouwuchekong' />备料明细</Space></Badge>}
      rightText={<Space><Icon type='icon-chuku' />备料完成</Space>}
      rightDisabled={!data.cartResults || data.cartResults.length === 0}
      leftDisabled={!data.cartResults || data.cartResults.length === 0}
      rightOnClick={() => {
        history.push(`/Work/Production/PickOutStock?ids=${params.ids}`);
      }}
      leftOnClick={() => {
        seeCarts.current.open(true);
      }}
    />

    <MyPopup
      ids={params.ids}
      title='备料详情'
      destroyOnClose={false}
      ref={seeCarts}
      component={Carts}
      data={data.cartResults && data.cartResults}
      position='bottom'
      onSuccess={() => {
        refresh();
      }}
    />

    {
      (loading || pickLoading) && <MyLoading />
    }

  </div>;
};
export default PickDetail;
