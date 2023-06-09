import React, { useEffect, useState } from 'react';
import { Divider, Selector, Toast } from 'antd-mobile';
import { useRequest } from '../../../../../../../../util/Request';
import { skuStockDetail } from '../../../../../../Url';
import MyEmpty from '../../../../../../../components/MyEmpty';
import { MyLoading } from '../../../../../../../components/MyLoading';
import BottomButton from '../../../../../../../components/BottomButton';
import { Space } from 'antd';
import Number from '../../../../../../../components/Number';
import Label from '../../../../../../../components/Label';

const SkuStockDetail = (
  {
    value = {},
    onSuccess = () => {
    },
    onClose = () => {
    },
  },
) => {
  const [outStock, setOutStock] = useState({});

  const brandResult = (data) => {
    const brands = [];
    if (Array.isArray(data)) {
      data.map((item) => {
        const brandIds = brands.map((item) => {
          return item.value;
        });
        if (!brandIds.includes(item.brandId) && item.brandId) {
          brands.push({
            value: item.brandId,
            label: item.brandResult && item.brandResult.brandName,
          });
        }
        return null;
      });
    }
    return brands;
  };

  const positionSupper = (data) => {

    if (!data.supper) {
      return data.name;
    }

    return positionSupper(data.supper) + '-' + data.name;
  };

  const positionsResult = (data) => {
    const positions = [];
    if (Array.isArray(data)) {
      data.map((item) => {
        const positionIds = positions.map((item) => {
          return item.value;
        });
        if (!positionIds.includes(item.storehousePositionsId)) {
          positions.push({
            value: item.storehousePositionsId,
            label: (item.storehouseResult && item.storehouseResult.name) + '-' + positionSupper(item.positionsResult),
          });
        }
        return null;
      });
    }
    return positions;
  };


  const { loading, data, run } = useRequest(skuStockDetail, {
    manual: true,
    onSuccess: (res) => {
      if (!Array.isArray(res)) {
        return;
      }
      let stockNumber = 0;
      res.map((item) => {
        return stockNumber += item.number;
      });

      let outstock = { stockNumber };
      if (positionsResult(res).length === 1) {
        outstock = { ...outstock, positionsId: positionsResult(res)[0].value };
      }

      if (brandResult(res).length === 1) {
        outstock = { ...outstock, brandId: brandResult(res)[0].value };
      }
      setOutStock(outstock);
    },
  });

  useEffect(() => {
    if (value.skuId) {
      run({
        data: { skuId: value.skuId },
      });
    }
  }, [value.skuId]);

  const { loading: outstockLoading, run: outstockRun } = useRequest({
    url: '/outstockOrder/outBound',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      onSuccess();
      Toast.show({
        content: '出库成功！',
        position: 'bottom',
      });
    },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (!data || data.length === 0) {
    return <MyEmpty description={<div>该物料没有库存！</div>} />;
  }

  const out = () => {
    if (!outStock.positionsId) {
      return Toast.show({
        content: '请选择库位！',
        position: 'bottom',
      });
    }
    if (!outStock.number) {
      return Toast.show({
        content: '数量不符！',
        position: 'bottom',
      });
    }
    outstockRun({
      data: { listingParams: [{ ...outStock, skuId: value.skuId }] },
    });
  };

  const getStockNumber = (outStock) => {
    let num = 0;
    data.map((item) => {
      if (
        (outStock.positionsId ? (item.storehousePositionsId === outStock.positionsId) : true)
        &&
        (outStock.brandId ? (item.brandId === outStock.brandId) : true)
      ) {
        num += item.number;
      }
      return null;
    });
    return num;
  };

  return <div style={{ padding: 16, marginBottom: 100 }}>
    <Divider>物料信息</Divider>
    <Space direction='vertical' style={{ width: '100%' }}>
      {value.content}
    </Space>
    {brandResult(data).length > 0 && <Divider>品牌信息</Divider>}
    {
      <Selector
        columns={1}
        value={[outStock.brandId]}
        options={brandResult(data)}
        onChange={(arr, extend) => {
          const data = { ...outStock, brandId: arr[0] };
          setOutStock({ ...data, stockNumber: getStockNumber(data) });
        }} />
    }
    <Divider>库位信息</Divider>
    {
      <Selector
        columns={1}
        value={[outStock.positionsId]}
        options={positionsResult(data)}
        onChange={(arr, extend) => {
          const data = { ...outStock, positionsId: arr[0] };
          setOutStock({ ...data, stockNumber: getStockNumber(data) });
        }}
      />
    }
    <Divider>库位信息</Divider>
    <Space align='center' direction='vertical'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Label style={{ minWidth: 100 }}>出库数量：</Label>
        <Number
          value={outStock.number}
          center
          onChange={(value) => {
            setOutStock({ ...outStock, number: value });
          }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Label style={{ minWidth: 100 }}>库存数：</Label>
        <Number
          center
          value={outStock.stockNumber}
          onChange={(value) => {
            setOutStock({ ...outStock, stockNumber: value });
          }} />
      </div>
    </Space>

    <BottomButton
      leftText='取消'
      rightText='出库'
      leftOnClick={() => {
        onClose();
      }}
      rightOnClick={() => {
        out();
      }}
    />


    {
      outstockLoading && <MyLoading />
    }
  </div>;
};

export default SkuStockDetail;
