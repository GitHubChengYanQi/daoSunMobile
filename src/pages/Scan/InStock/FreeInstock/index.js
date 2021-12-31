import React, { useRef, useState } from 'react';
import { Button, Card, List, Space, Stepper, Toast } from 'antd-mobile';
import { Typography } from 'antd';
import Search from './components/Search';
import MyTreeSelect from '../../../components/MyTreeSelect';
import { storehousePositionsTreeView } from '../../Url';
import { request, useRequest } from '../../../../util/Request';
import { connect } from 'dva';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';
import { AddOutline, DeleteOutline } from 'antd-mobile-icons';
import { useDebounceEffect, useSetState } from 'ahooks';
import Html2Canvas from '../../../Html2Canvas';
import { ScanOutlined } from '@ant-design/icons';
import { getHeader } from '../../../components/GetHeader';
import BottomButton from '../../../components/BottomButton';
import pares from 'html-react-parser';
import { Input } from 'weui-react-v2';

const FreeInstock = (props) => {


  const ref = useRef();
  const html2ref = useRef();
  const treeRef = useRef();

  const [canvas, setCanvas] = useState([]);

  const codeId = props.qrCode && props.qrCode.codeId;

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  const { loading, run: codeRun } = useRequest({
    url: '/orCode/backObject',
    method: 'GET',
  }, {
    manual: true,
    onSuccess: (res) => {
      switch (res.type) {
        case 'storehousePositions':
          if (res.result && res.result.storehouseResult) {
            setData({
              ...data,
              storehouse: {
                label: res.result.storehouseResult.name,
                value: res.result.storehouseResult.storehouseId,
              },
              storehousepostionId: res.result.storehousePositionsId,
            });
          }
          clearCode();
          break;
        default:
          Toast.show({
            content: '请扫库位码！',
            position: 'bottom',
          });
          clearCode();
          break;
      }
    },
  });

  useDebounceEffect(() => {
    if (codeId) {
      codeRun({
        params: {
          id: codeId,
        },
      });
    }
  }, [codeId], {
    wait: 0,
  });

  const [count, setCount] = useState(1);

  const [items, setItmes] = useSetState({
    data: [],
  });
  console.log(items.data,items.data.filter((value) => {
    console.log(value,value.number <= 0);
    return value.number <= 0;
  }).length === 0);

  const listItems = () => {
    const arrays = new Array(count);
    for (let i = 0; i < count; i++) {
      const item = items.data[i] || { codeId: null, number: 1 };
      arrays.push(<List.Item key={i} extra={
        <LinkButton disabled={item.codeId} title={item.codeId ? '已生成二维码' : '生成二维码'} onClick={async () => {
          const brandId = data.brand.value;
          const id = data.sku.value;
          if (brandId && id) {
            if (item.number > 0){
              const res = await request({
                url: '/orCode/automaticBinding',
                method: 'POST',
                data: {
                  source: 'item',
                  brandId,
                  id,
                  number: item.number,
                  inkindType: '自由入库',
                },
              });
              if (!getHeader()) {
                const templete = await request({
                  url: '/inkind/detail',
                  method: 'POST',
                  data: {
                    inkindId: res.inkindId,
                  },
                });
                setCanvas([...canvas, {
                  templete: templete.printTemplateResult && templete.printTemplateResult.templete,
                  codeId: res.codeId,
                }]);
                await html2ref.current.setTemplete(templete.printTemplateResult && templete.printTemplateResult.templete);
                await html2ref.current.setCodeId(res.codeId);
              }
              const arr = items.data;
              arr[i] = { ...arr[i], codeId: res.codeId };
              setItmes({ data: arr });
            }else {
              Toast.show({
                content: '数量不能小于0!',
                position: 'bottom',
              });
            }

          } else {
            Toast.show({
              content: '请先将物料和供应商信息填写完整!',
              position: 'bottom',
            });
          }

        }} />
      }>
        <Space align='center'>
          <LinkButton
            onClick={() => {
              items.data.splice(i, 1);
              setCount(count - 1);
            }}
            disabled={item.codeId || count === 1}
            title={
              <DeleteOutline />
            } />
          第{i + 1}
          {
            data.sku.batch ? '批' : '个'
          }
          {
            data.sku.batch && <Input
              prefix={<span style={{color:'#000'}}>入库数量：</span>}
              disabled={item.codeId}
              style={{ width: 200 ,color:'#1677ff' }}
              type='number'
              value={item.number}
              onChange={(value) => {
                const arr = items.data;
                arr[i] = { ...arr[i], number: parseInt(value) };
                setItmes({ data: arr });
              }} />
          }
        </Space>
      </List.Item>);
    }
    return arrays;
  };

  const [data, setData] = useState({
    sku: {},
    brand: {},
    storehouse: {},
    storehousepostionId: null,
  });

  const { loading: instockLoading, run: instockRun } = useRequest({
    url: '/instockOrder/freeInstock',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      setItmes({ data: [] });
      setData({
        sku: {},
        brand: {},
        storehouse: {},
        storehousepostionId: null,
      });
      setCount(1);
      Toast.show({
        content: '入库成功！',
        position: 'bottom',
      });
    },
    onError: () => {
      setItmes({ data: [] });
      setCount(1);
      setData({
        sku: {},
        brand: {},
        storehouse: {},
        storehousepostionId: null,
      });
      Toast.show({
        content: '入库失败！',
        position: 'bottom',
      });
    },
  });

  return <>
    <Card title='物料信息'>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        <List.Item title='物料'>
          <Typography.Link underline onClick={() => {
            ref.current.search({ type: 'sku' });
          }}>
            {
              data.sku.label || '请选择物料'
            }
          </Typography.Link>
        </List.Item>
        <List.Item title='供应商(品牌)'>
          <Typography.Link underline onClick={() => {
            ref.current.search({ type: 'brand' });
          }}>
            {
              data.brand.label || '请选择供应商(品牌)'
            }
          </Typography.Link>
        </List.Item>
        <List.Item title='仓库'>
          <Typography.Link underline onClick={() => {
            ref.current.search({ type: 'storehouse' });
          }}>
            {
              data.storehouse.label || '请选择仓库'
            }
          </Typography.Link>
        </List.Item>
        <List.Item title='库位' extra={getHeader() && <LinkButton
          title={<ScanOutlined />} onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
            payload: {
              action: 'freeInstock',
            },
          });
        }} />}>
          <MyTreeSelect
            arrow={false}
            ref={treeRef}
            branch={!data.storehouse.value}
            poputTitle='选择库位'
            branchText='请选择仓库或直接扫码选择库位'
            textType='link'
            resh={data.storehouse.value}
            title={<Typography.Link underline>选择库位</Typography.Link>}
            value={data.storehousepostionId}
            api={storehousePositionsTreeView}
            onChange={(value) => {
              setData({ ...data, storehousepostionId: value });
            }}
          />
        </List.Item>
      </List>
    </Card>

    <div style={{ margin: '16px 0' }}>
      <Card title='分批入库'>
        <List
          style={{
            '--border-top': 'none',
            '--border-inner': 'none',
          }}
        >
          {listItems()}
          <Button color='default' style={{ width: '100%' }} onClick={() => {
            setCount(count + 1);
          }}><AddOutline /></Button>
        </List>
      </Card>
    </div>

    {canvas.length > 0 && <Card title='已绑定的二维码'>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
        }}
      >
        {
          canvas.map((items, index) => {
            return <List.Item
              key={index}
              extra={<LinkButton title='打印' onClick={async () => {
                await html2ref.current.setTemplete(items.templete);
                await html2ref.current.setCodeId(items.codeId);
              }} />}
            >
              {
                pares(items.templete, {
                  replace: domNode => {
                    if (domNode.name === 'p') {
                      domNode.attribs = {
                        style: 'padding:0;margin:0',
                      };
                      return domNode;
                    }
                  },
                })
              }
            </List.Item>;
          })
        }
      </List>
    </Card>}

    <Search ref={ref} onChange={(value) => {
      switch (value.type) {
        case 'sku':
          setItmes({ data: [] });
          setCount(1);
          setData({ ...data, sku: value });
          break;
        case 'brand':
          setData({ ...data, brand: value });
          break;
        case 'storehouse':
          treeRef.current.run({
            params: {
              ids: value.value,
            },
          });
          setData({ ...data, storehouse: value, storehousepostionId: null });
          break;
        default:
          break;
      }
    }} />

    <Html2Canvas ref={html2ref} />

    <MyLoading
      loading={instockLoading || loading}
      title={instockLoading ? '入库中...' : '扫描中...'} />

    <BottomButton
      only
      disabled={
        !data.storehousepostionId
        ||
        !data.storehouse.value
        ||
        items.data.filter((value) => {
          return value.codeId;
        }).length !== count
      }
      onClick={() => {
        if (items.data.filter((value) => {
          return value.number <= 0;
        }).length === 0) {
          instockRun({
            data: {
              positionsId: data.storehousepostionId,
              codeIds: items.data.map((items) => {
                return items.codeId;
              }),
              storeHouseId: data.storehouse.value,
            },
          });
        } else {
          Toast.show({
            content: '数量不能小于0个!',
            position: 'bottom',
          });
        }

      }}
      text='入库'
    />
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(FreeInstock);
