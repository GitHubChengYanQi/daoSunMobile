import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import {
  productionPickListsCartAdd,
  productionPickListsCartList,
  productionPickListsCreateOutOrder,
  productionPickListsMergeDetail,
} from '../components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import {
  Badge,
  Button,
  Card,
  CascaderView,
  Dialog,
  Divider,
  Dropdown,
  List,
  NoticeBar,
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
import Number from '../../../components/Number';

const PickDetail = (props) => {

  const params = props.location.query;

  const [code, setCode] = useState();

  const { loading: outLoading, run: outstock } = useRequest(productionPickListsCreateOutOrder, {
    manual: true,
    onSuccess: () => {
      refresh();
      setVisible(false);
      setCode(null);
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

  const seeCarts = useRef();

  const [visible, setVisible] = useState();

  const [message, setMessage] = useState();

  const [skus, setSkus] = useState([]);

  const [positions, setPositions] = useState([]);

  const getChildren = (data, details) => {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    return data.map((item) => {
      return {
        label: item.name,
        value: item.storehousePositionsId,
        skus: item.skuResults && item.skuResults.map((skuItem) => {
          const sku = details.filter(item => skuItem.skuId === item.skuId);
          let number = 0;
          const pickLists = sku.map((item) => {
            number += item.number;
            return {
              pickListsId: item.pickListsId,
              number: item.number,
            };
          });
          return {
            ...skuItem,
            number,
            pickLists,
          };
        }),
        storehouseId: item.storehouseId,
        children: getChildren(item.storehousePositionsResults, details),
      };
    });
  };

  const getSkus = (extend) => {
    if (extend && Array.isArray(extend.skus)) {
      setSkus(extend.skus.map((item) => {
        return {
          skuResult: item,
          skuId: item.skuId,
          number: item.number,
          positionId: extend.value,
          storehouseId: extend.storehouseId,
          pickLists: item.pickLists,
        };
      }));
    }
  };

  const getIndexChildren = (data, array) => {
    if (Array.isArray(data) && data.length !== 0) {
      data.map((item, index) => {
        if (index === 0) {
          array.push(item);
          getIndexChildren(item.children, array);
        }
        return null;
      });
    }
  };

  const { loading, data, run, refresh } = useRequest(productionPickListsMergeDetail, {
    manual: true,
    onSuccess: (res) => {
      const allSku = getChildren(res && res.storehousePositionsResults, res && res.detailResults) || [];
      const options = [];
      getIndexChildren(allSku, options);
      if (options.length === 0) {
        setSkus([]);
        setPositions([]);
        return;
      }
      setPositions(options);
      getSkus(options[options.length - 1]);
    },
  });

  const options = getChildren(data && data.storehousePositionsResults, data && data.detailResults) || [];

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
      setMessage(true);
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
              {message && <NoticeBar content='已切换到下一个库位' color='alert' closeable onClose={() => {
                setMessage(false);
              }} />}
              <Dropdown>
                <Dropdown.Item
                  key='sorter'
                  title={<div>{positions.map(item => item.label).join('-')}</div>}
                >
                  <div style={{ padding: 12 }}>
                    <CascaderView
                      options={options}
                      value={positions.map((item => item.value))}
                      onChange={(val, extend) => {
                        getSkus(extend.items[val.length - 1]);
                        setPositions(extend.items);
                      }}
                    />
                  </div>
                </Dropdown.Item>
              </Dropdown>
            </div>}
          <div style={{ backgroundColor: '#eee', padding: '16px 0' }}>
            {
              skus.length === 0
                ?
                <MyEmpty description='全部领料完成' />
                :
                skus.map((item, index) => {
                  const object = item.pickLists.map((pickItem) => {
                    return {
                      skuId: item.skuId,
                      number: pickItem.number,
                      pickListsId: pickItem.pickListsId,
                      storehouseId: item.storehouseId,
                      storehousePositionsId: item.positionId,
                    };
                  });
                  const skuResult = item.skuResult || {};
                  return <div key={index} style={{ margin: 8 }}>
                    <Card style={{ borderRadius: 0 }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ flexGrow: 1 }}>
                          <MyEllipsis><SkuResult_skuJsons skuResult={skuResult} /></MyEllipsis>
                          <div>
                            <Label>描述：</Label>
                            <MyEllipsis width='60%'><SkuResult_skuJsons skuResult={skuResult} describe /></MyEllipsis>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          × {item.number}
                        </div>
                      </div>
                    </Card>
                    <div>
                      <Button
                        onClick={() => {
                          pick({
                            data: {
                              productionPickListsCartParams: object,
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
                          setVisible(object);
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
      rightText={<Space><Icon type='icon-chuku' />出库</Space>}
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
          outstock({
            data: {
              code,
              pickListsDetailParams: [...visible],
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

    {(loading || pickLoading || cartLoading || outLoading) && <MyLoading />}

  </div>;
};
export default PickDetail;
;
