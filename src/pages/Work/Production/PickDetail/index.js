import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import {
  productionPickListsCartAdd,
  productionPickListsCartList, productionPickListsCreateOutOrder,
  productionPickListsMergeDetail, productionPickListsSend,
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
import { getHeader } from '../../../components/GetHeader';
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

const PickDetail = (props) => {

  const params = props.location.query;

  const seeCarts = useRef();

  const [skus, setSkus] = useState([]);

  const [positions, setPositions] = useState({});

  const getChildren = (data, details, top) => {

    if (!Array.isArray(data)) {
      return null;
    }

    const skuResults = [];
    const option = data.map((item) => {
      return {
        icon: <CollectMoneyOutline />,
        title: `${item.name} (${item.skuResults ? item.skuResults.length : 0})`,
        key: item.storehousePositionsId,
        skus: item.skuResults && item.skuResults.map((skuItem) => {
          const sku = details.filter(item => skuItem.skuId === item.skuId);
          let number = 0;
          let pickLists = [];
          sku.map((item) => {
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
          const object = {
            ...skuItem,
            positionId: item.storehousePositionsId,
            storehouseId: item.storehouseId,
            number,
            pickLists,
          };
          skuResults.push(object);
          return object;
        }),
        children: !top && getChildren(item.storehousePositionsResults, details),
      };
    });

    if (top) {
      return [{
        icon: <CollectMoneyOutline />,
        title: `全部 (${skuResults.length})`,
        key: 'all',
        skus: skuResults,
        children: getChildren(data, details),
      }];
    }
    if (data.length === 0) {
      return null;
    }
    return option;
  };

  const getSkus = (extend) => {
    if (extend && Array.isArray(extend.skus)) {
      setSkus(extend.skus.map((item) => {
        return {
          skuResult: item,
          skuId: item.skuId,
          number: item.number,
          positionId: item.positionId,
          storehouseId: item.storehouseId,
          pickLists: item.pickLists,
        };
      }));
    }
  };

  const { loading, data, run, refresh } = useRequest(productionPickListsMergeDetail, {
    manual: true,
    onSuccess: (res) => {
      const allSku = getChildren(res && res.storehousePositionsResults, res && res.detailResults, true) || [];
      setPositions(allSku[0]);
      getSkus(allSku[allSku.length - 1]);
    },
  });

  const { loading: outLoading, run: outstock } = useRequest(productionPickListsCreateOutOrder, {
    manual: true,
    onSuccess: () => {
      refresh();
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

  const options = getChildren(data && data.storehousePositionsResults, data && data.detailResults, true) || [];

  const { loading: cartLoading, data: cartData, run: cartRun, refresh: cartRefresh } = useRequest(
    productionPickListsCartList,
    { manual: true });

  const { loading: pickLoading, run: pick } = useRequest(productionPickListsCartAdd, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '备料成功！',
        position: 'bottom',
      });
      refresh();
      cartRefresh();
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
      cartRun({ data: { pickListsIds: params.ids.split(',') } });
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
        maxHeight={window.innerHeight - (getHeader() ? 0 : 45)}
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
                      });
                    });
                  });
                  const skuResult = item.skuResult || {};
                  return <div key={index} style={{ margin: 8 }}>
                    <Card style={{ borderRadius: 0 }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ flexGrow: 1 }}>
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
                        onClick={() => {
                          pick({
                            data: {
                              productionPickListsCartParams: objectList,
                            },
                          });
                        }}
                        style={{
                          width: '50%',
                          color: 'var(--adm-color-primary)',
                          '--border-radius': '0px',
                          borderLeft: 'none',
                          borderBottomLeftRadius: 10,
                        }}
                      >
                        备料
                      </Button>
                      <Button
                        onClick={() => {
                          outstock({
                            data: {
                              pickListsDetailParams: objectList,
                            },
                          });
                        }}
                        style={{
                          width: '50%',
                          color: 'var(--adm-color-primary)',
                          '--border-radius': '0px',
                          borderBottomRightRadius: 10,
                          borderRight: 'none',
                        }}
                      >
                        出库
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
      leftText={<Badge content={cartData && cartData.length}><Space style={{ margin: '0 16px' }}><Icon
        type='icon-gouwuchekong' />备料</Space></Badge>}
      rightText={<Space><Icon type='icon-chuku' />完成备料</Space>}
      rightDisabled={!cartData || cartData.length === 0}
      rightOnClick={() => {
        history.push(`/Work/Production/PickOutStock?ids=${params.ids}`);
      }}
      leftOnClick={() => {
        if (!cartData || cartData.length === 0) {
          return Toast.show({
            content: '清先添加备料！',
            position: 'bottom',
          });
        }
        seeCarts.current.open(true);
      }}
    />

    <MyPopup
      ids={params.ids}
      title='备料详情'
      destroyOnClose={false}
      ref={seeCarts}
      component={Carts}
      data={cartData}
      position='bottom'
      onSuccess={() => {
        refresh();
        cartRefresh();
      }}
    />

    {
      (loading || pickLoading || cartLoading || outLoading) && <MyLoading />
    }

  </div>;
};
export default PickDetail;
