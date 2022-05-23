import { Button, Card, Dialog, List, Space, Stepper, Toast } from 'antd-mobile';
import { ScanOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { storehousePositionsTreeView } from '../Url';
import { request, useRequest } from '../../../util/Request';
import TreeSelectSee from '../../components/TreeSelectSee';
import { WhiteSpace } from 'weui-react-v2';
import { useBoolean, useDebounceEffect } from 'ahooks';
import MyEmpty from '../../components/MyEmpty';
import { MyLoading } from '../../components/MyLoading';
import { connect } from 'dva';
import { history } from 'umi';
import IsDev from '../../../components/IsDev';
import style from './index.css';
import MyNavBar from '../../components/MyNavBar';
import BackSkus from '../Sku/components/BackSkus';
import { ToolUtil } from '../../components/ToolUtil';

const OutStock = (props) => {

  const id = props.location.query.id;

  const qrCode = props.qrCode;

  const outstockAction = qrCode.outstockAction;

  // 控制全局状态
  const scanCodeState = (payload) => {
    props.dispatch({
      type: 'qrCode/scanCodeState',
      payload,
    });
  };

  const [data, setData] = useState();

  const { loading, run, refresh } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      setData(res.result);
    },
  });

  const [number, setNumber] = useState(1);

  const [itemNumber, setItemNumber] = useState(1);

  const [items, setItems] = useState();

  const [positionShow, { toggle }] = useBoolean();


  const next = (items) => {
    Dialog.show({
      content: `出库成功！是否继续出库 [ ${items.spuResult && items.spuResult.spuClassificationResult && items.spuResult.spuClassificationResult.name} / ${items.spuResult && items.spuResult.name} ]？`,
      closeOnMaskClick: true,
      closeOnAction: true,
      onAction: async (action) => {
        if (action.key === 'ok') {
          await props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              items: {
                Id: items.skuId,
                type: 'item',
                ...items,
              },
              action: 'scanOutstock',
              data,
            },
          });
        }
      },
      actions: [
        [
          {
            key: 'ok',
            text: '是',
          },
          {
            key: 'no',
            text: '否',
          },
        ],
      ],
    });
  };

  useDebounceEffect(() => {
    if (id) {
      run({
        params: {
          id,
        },
      });
    }
  }, [id], {
    wait: 0,
  });

  const getSkuResult = (items, br) => {
    if (!items)
      return null;
    return <BackSkus record={items} />;
  };

  const outstockContent = (items) => {

    const stockNumber = outstockAction && outstockAction.stockDetails && outstockAction.stockDetails.number;
    const maxNumber = stockNumber < itemNumber ? stockNumber : itemNumber;

    return <>
      {getSkuResult(items)}
      <WhiteSpace size='sm' />
      {items && items.brandResult && items.brandResult.brandName}
      <WhiteSpace size='sm' />
      库位：{data && data.storehouseResult && data.storehouseResult.name} - {outstockAction && outstockAction.positions && outstockAction.positions.name}
      <WhiteSpace size='sm' />
      库存数量:&nbsp;&nbsp;×{stockNumber}
      <WhiteSpace size='sm' />
      {stockNumber > 1 && <Space>
        <div>
          出库数量：
        </div>
        <Stepper
          min={1}
          max={maxNumber}
          value={number}
          onChange={value => {
            setNumber(value);
          }}
        />
      </Space>}
    </>;
  };

  const positionResult = (data) => {

    if (!data.supper) {
      return data.name;
    }

    return positionResult(data.supper) + '-' + data.name;
  };

  if (loading)
    return <MyLoading loading={loading} />;

  if (!data)
    return <MyEmpty height='100vh' />;

  return (
    <>
      {!ToolUtil.isQiyeWeixin() && <MyNavBar title='出库' />}
      <div style={{ padding: 16 }} className={style.outstock}>
        <Card
          style={{ backgroundColor: '#f4f4f4', borderRadius: 10 }}
          headerStyle={{ border: 'none', padding: 8, backgroundColor: '#fff' }}
          bodyStyle={{ backgroundColor: '#fff' }}
          title={<strong
            style={{
              borderBottom: 'solid 1px #1845b5',
              padding: 8,
              margin: 8,
              color: '#1E1E1E',
            }}>
            出库信息
          </strong>}
        >

          <List
            className={style.outstockOrderList}
            style={{
              '--border-inner': 'none',
              '--border-top': 'none',
              '--border-bottom': 'none',
            }}
          >
            <List.Item>出库单号：{data.coding}</List.Item>
            <List.Item>仓库名称：{data.storehouseResult && data.storehouseResult.name}</List.Item>
            <List.Item>负责人：{data.userResult && data.userResult.name}</List.Item>
            <List.Item>备注：{data.note || '无'}</List.Item>
            <List.Item>创建时间：{data.createTime}</List.Item>
          </List>
        </Card>
        <Card
          headerStyle={{ border: 'none', padding: 8 }}
          title={<strong
            style={{
              borderBottom: 'solid 1px #1845b5',
              padding: 8,
              margin: 8,
              color: '#666666',
            }}>出库清单</strong>}
          style={{ backgroundColor: '#f4f4f4' }}
        >
          <List
            className={style.outstocklistingList}
            style={{
              padding: 0,
              backgroundColor: '#f4f4f4',
              '--border-top': 'none',
              '--border-bottom': 'none',
              '--border-inner': 'none',
            }}
          >
            {data.outstockListing && data.outstockListing.length > 0 ?
              data.outstockListing.map((items, index) => {
                if (items.number > 0) {
                  return <List.Item
                    key={index}
                    style={{
                      padding: 0,
                      marginBottom: 16,
                      backgroundColor: '#fff',
                      boxShadow: 'rgba(24,69,181,0.1) 0px 3px 6px',
                      borderRadius: 10,
                    }}
                    description={<Button
                      style={{
                        width: '100%',
                        marginTop: 8,
                        border: 'none',
                        color: '#fff',
                        '--border-radius': 0,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        backgroundColor: '#1845B5',
                      }}
                      onClick={async () => {
                        if (IsDev() || ToolUtil.isQiyeWeixin()) {
                          setItems(items);
                          setItemNumber(items.number);
                          //调用扫码
                          // scan(items);
                          await props.dispatch({
                            type: 'qrCode/wxCpScan',
                            payload: {
                              items: {
                                Id: items.skuId,
                                type: 'item',
                                ...items,
                              },
                              action: 'scanOutstock',
                              data,
                            },
                          });
                        } else {
                          history.push({
                            pathname: '/Scan/OutStock/AppOutstock',
                            state: {
                              items,
                              data,
                            },
                          });
                        }
                      }}
                    >
                      <Space>
                        <ScanOutlined />
                        扫码出库
                        <>
                          {items.number} / {items.delivery}
                        </>
                      </Space>
                    </Button>}
                  >
                    <Space direction='vertical' style={{ padding: 8,width:'100%' }}>
                      {getSkuResult(items)}
                      {items.brandResult && items.brandResult.brandName}

                      {positionShow && items.positionsResults.map((item, index) => {
                        return <div key={index}>
                          {positionResult(item)}  <div style={{float:'right'}}>×{item.number}</div>
                        </div>;
                      })}

                      <Button
                        color='primary'
                        fill='none'
                        style={{ padding: 0 }}
                        onClick={() => {
                          toggle();
                        }}
                      >{positionShow ? '收起库位' : '查看库位'}</Button>
                    </Space>
                  </List.Item>;
                } else {
                  return null;
                }

              })
              :
              <MyEmpty description='已全部出库' />}
          </List>
        </Card>
        <Card
          headerStyle={{ border: 'none', padding: 8 }}
          title={<strong
            style={{
              borderBottom: 'solid 1px #1845b5',
              padding: 8,
              margin: 8,
              color: '#666666',
            }}>出库明细</strong>}
          style={{ backgroundColor: '#f4f4f4' }}
        >
          <List
            className={style.outstockDetailsList}
            style={{
              '--border-top': 'none',
              '--border-bottom': 'none',
              '--border-inner': 'none',
              backgroundColor: '#f4f4f4',
            }}
          >
            {data.outstockResults && data.outstockResults.length > 0 ?
              data.outstockResults.map((items, index) => {
                  return <List.Item
                    key={index}
                    style={{
                      padding: 8,
                      marginBottom: 16,
                      backgroundColor: '#fff',
                      boxShadow: 'rgba(24,69,181,0.1) 0px 3px 6px',
                      borderRadius: 5,
                    }}
                    extra={<Button style={{ '--border-radius': '10px', color: '#1845b5' }}>×
                      {items.number}</Button>}
                  >
                    <Space direction='vertical'>
                      <><strong>编号:</strong>{items.stockItemId}</>
                      {getSkuResult(items)}
                      {items.brandResult && items.brandResult.brandName}
                    </Space>

                  </List.Item>;
                },
              )
              :
              <MyEmpty />
            }
          </List>
        </Card>

        {/*------------------------------出库弹窗-------------------------*/
        }
        {
          outstockAction && items && <Dialog
            visible={outstockAction}
            content={outstockContent(items)}
            onAction={async (action) => {
              setNumber(1);
              if (action.key === 'out') {
                await request({
                  url: '/orCode/outStockByCode',
                  method: 'POST',
                  data: {
                    number,
                    outstockOrderId: data && data.outstockOrderId,
                    storehouse: data && data.storehouseId,
                    codeId: qrCode.codeId,
                    outstockListingId: items.outstockListingId,
                  },
                }).then((res) => {
                  if (res > 0) {
                    setItemNumber(res);
                    next(items);
                    scanCodeState({
                      outstockAction: null,
                    });
                  } else if (res === 0) {
                    Toast.show({
                      content: '全部出库成功！',
                      position: 'bottom',
                    });
                    scanCodeState({
                      outstockAction: null,
                    });
                  }
                  refresh();
                });
              } else {
                scanCodeState({
                  outstockAction: null,
                });
              }
            }}
            actions={[
              [{
                key: 'out',
                text: '出库',
              },
                {
                  key: 'close',
                  text: '取消',
                }],
            ]}
          />
        }
      </div>
    </>
  );
};
export default connect(({ qrCode }) => ({ qrCode }))(OutStock);

