import MyEmpty from '../../../components/MyEmpty';
import { connect } from 'dva';
import MyNavBar from '../../../components/MyNavBar';
import { Card, Dialog, List, Space, Stepper, Toast } from 'antd-mobile';
import React, { useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { useDebounceEffect } from 'ahooks';
import { MyLoading } from '../../../components/MyLoading';
import { Input, WhiteSpace } from 'weui-react-v2';
import { AddOutline } from 'antd-mobile-icons';

const fontSize = 24;

const AppOutstock = (props) => {

  // 全局状态
  const qrCode = props.qrCode;
  console.log(qrCode);
// 当前扫描的二维码id
  const codeId = props.qrCode && props.qrCode.codeId;
// 路由传参
  const state = props.location.state;
// 当前物料信息
  const items = state && state.items;
// 当前入库单信息
  const data = state && state.data;

  const [number, setNumber] = useState(1);

  const [stockDetail, setStockDetail] = useState({});

  const [batchOutstock, setBatchOutstock] = useState(false);

  const clearCode = () => {
    props.dispatch({
      type: 'qrCode/clearCode',
    });
  };

  // 获取二维码数据
  const { loading, run: codeRun } = useRequest({
    url: '/orCode/backInkindByCode',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: (res) => {
      console.log('stockdetails', res);
      setStockDetail(res);
      if (items.number <= 0) {
        Toast.show({
          content: '已经全部出库！，不可进行扫码操作！',
          position: 'bottom',
        });
        clearCode();
      } else {
        // 判断物料在库存中的数量
        // 只有一个直接入库
        if (res && res.stockDetails && res.stockDetails.number === 1) {
          outstockAction(1);
        } else {
          setBatchOutstock(true);
        }
      }
    },
    onError: () => {
      clearCode();
    },
  });

  useDebounceEffect(() => {
    if (codeId) {
      codeRun({
        data: {
          codeId,
          id: items && items.skuId,
          brandId: items && items.brandId,
          storehouse: data && data.storehouseId,
        },
      });
    }
  }, [codeId], {
    wait: 0,
  });

  // 出库操作
  const { loading: outstockLoading, run: outstock } = useRequest({
    url: '/orCode/outStockByCode',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      clearCode();
      setBatchOutstock(false);
      items.number = items.number - number;
      setNumber(1);
      Toast.show({
        content: '出库成功！',
        position: 'bottom',
      });
    },
    onError: () => {
      clearCode();
      setNumber(1);
    },
  });

  const outstockAction = (number) => {
    outstock({
      data: {
        number,
        outstockOrderId: data && data.outstockOrderId,
        storehouse: data && data.storehouseId,
        codeId: codeId,
        outstockListingId: items.outstockListingId,
      },
    });
  };

  const getSkuResult = () => {
    return <>
      {items.sku && items.sku.skuName}
      &nbsp;/&nbsp;
      {items.spuResult && items.spuResult.name}
      <br />
      {
        items.backSkus
        &&
        items.backSkus.length > 0
        &&
        items.backSkus[0].attributeValues
        &&
        items.backSkus[0].attributeValues.attributeValues
        &&
        <em style={{ color: '#c9c8c8', fontSize: 16 }}>
          (
          {
            items.backSkus
            &&
            items.backSkus.map((items, index) => {
              return <span key={index}>
                        {items.itemAttribute.attribute}：{items.attributeValues.attributeValues}
                      </span>;
            })
          }
          )
        </em>
      }
    </>;
  };

  const outstockContent = (items) => {
    const stockNumber = stockDetail && stockDetail.stockDetails && stockDetail.stockDetails.number;
    return <>
      {getSkuResult(items)}
      <WhiteSpace size='sm' />
      {items && items.brandResult && items.brandResult.brandName}
      <WhiteSpace size='sm' />
      库位：{data && data.storehouseResult && data.storehouseResult.name} - {stockDetail && stockDetail.positions && stockDetail.positions.name}
      <WhiteSpace size='sm' />
      库存数量:&nbsp;&nbsp;×{stockNumber}
      <WhiteSpace size='sm' />
      {stockNumber > 1 && <Space align='center'>
        出库数量：
        <Input
          style={{ width: 100, color: '#1677ff' }}
          type='number'
          value={number}
          onChange={(value) => {
            setNumber(parseInt(value));
          }} />
      </Space>}
    </>;
  };

  if (!(items || data)) {
    return <MyEmpty />;
  }

  return <>
    <MyNavBar title='扫码出库' />
    <Card title='出库信息' />
    <List>
      <List.Item title='仓库'>
        <span style={{ fontSize, fontWeight: 900 }}>{data.storehouseResult && data.storehouseResult.name}</span>
      </List.Item>
      <List.Item title='物料'>
          <span style={{ fontSize }}>
          {getSkuResult()}
          </span>
      </List.Item>
    </List>
    <Card
      title={'总数量(' + items.delivery + ')'}
    />
    <List>
      <List.Item
        title='已出库数量'
        extra={<span style={{ fontSize, color: 'green' }}>{items.delivery - items.number}</span>} />
    </List>

    <Dialog
      visible={batchOutstock}
      content={outstockContent(items)}
      onAction={async (action) => {
        if (action.key === 'out') {
          const stockNumber = stockDetail && stockDetail.stockDetails && stockDetail.stockDetails.number;
          const maxNumber = stockNumber < items.number ? stockNumber : items.number;
          if (number > 0 && number <= maxNumber) {
            outstockAction(number);
          } else {
            Toast.show({
              content: '请填入正确的数量!',
              position: 'bottom',
            });
          }
        } else {
          setBatchOutstock(false);
          clearCode();
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

    <MyLoading
      loading={loading || outstockLoading}
      title={loading ? '处理中...' : '出库中...'} />
  </>;
};
export default connect(({ qrCode }) => ({ qrCode }))(AppOutstock);
