import React, { useRef, useState } from 'react';
import { Button, Card, List, SafeArea, Space, Stepper, Toast } from 'antd-mobile';
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

const FreeInstock = (props) => {


  const ref = useRef();
  const html2ref = useRef();
  const treeRef = useRef();

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

  const listItems = () => {
    const arrays = new Array(count);
    for (let i = 0; i < count; i++) {
      const item = items.data[i] || { codeId: null, number: 1 };
      arrays.push(<List.Item key={i} extra={
        <LinkButton disabled={item.codeId} title={item.codeId ? '已生成二维码' : '生成二维码'} onClick={async () => {
          const brandId = data.brand.value;
          const id = data.sku.value;
          if (brandId && id) {
            const codeId = await request({
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
            const arr = items.data;
            arr[i] = { ...arr[i], codeId };
            setItmes({ data: arr });
            await html2ref.current.setItems(<>
              {data.sku.label}
              <br />
              {data.brand.label}
              <br />
              × {item.number}
            </>);
            await html2ref.current.setCodeId(codeId);
          } else {
            Toast.show({
              content: '请先将物料和供应商信息填写完整!',
              position: 'bottom',
            });
          }

        }} />
      }>
        <Space>
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
            data.sku.batch && <Stepper
              min={1}
              disabled={item.codeId}
              value={item.number}
              onChange={value => {
                const arr = items.data;
                arr[i] = { ...arr[i], number: value };
                setItmes({ data: arr });
              }}
            />
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
        storehousepostion: null,
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
    <Card title='物料信息' />
    <List>
      <List.Item title='物料'>
        <Typography.Link underline onClick={() => {
          ref.current.search('sku');
        }}>
          {
            data.sku.label || '请选择物料'
          }
        </Typography.Link>
      </List.Item>
      <List.Item title='供应商(品牌)'>
        <Typography.Link underline onClick={() => {
          ref.current.search('brand');
        }}>
          {
            data.brand.label || '请选择供应商(品牌)'
          }
        </Typography.Link>
      </List.Item>
      <List.Item title='仓库'>
        <Typography.Link underline onClick={() => {
          ref.current.search('storehouse');
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
          payload:{
            action:'freeInstock'
          }
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

    <Card title='分批入库' />
    <List>
      {listItems()}
      <Button color='default' style={{ width: '100%' }} onClick={() => {
        setCount(count + 1);
      }}><AddOutline /></Button>
    </List>

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
          setData({ ...data, storehouse: value, storehousepostion: null });
          break;
        default:
          break;
      }
    }} />

    <Html2Canvas ref={html2ref} />

    <MyLoading
      loading={instockLoading || loading}
      title={instockLoading ? '入库中...' : '扫描中...'} />

    <div
      style={{
        padding: 16,
        width: '100%',
        paddingBottom: 0,
        position: 'fixed',
        bottom: 0,
        backgroundColor: '#fff',
      }}
    >
      <Button
        disabled={
          !data.storehousepostionId
          ||
          !data.storehouse.value
          ||
          items.data.filter((value) => {
            return value.codeId;
          }).length !== count
        }
        style={{ '--border-radius': '50px', width: '100%' }}
        color='primary'
        onClick={() => {
          instockRun({
            data: {
              positionsId: data.storehousepostion,
              codeIds: items.data.map((items) => {
                return items.codeId;
              }),
              storeHouseId: data.storehouse.value,
            },
          });
        }}
      >入库</Button>
      <div>
        <SafeArea position='bottom' />
      </div>
    </div>
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(FreeInstock);