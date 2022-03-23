import React, { useEffect, useState } from 'react';
import { Divider, Selector, Toast } from 'antd-mobile';
import { useRequest } from '../../../../../../../../util/Request';
import { skuStockDetail } from '../../../../../../Url';
import MyEmpty from '../../../../../../../components/MyEmpty';
import { MyLoading } from '../../../../../../../components/MyLoading';
import BottomButton from '../../../../../../../components/BottomButton';
import { Space } from 'antd';
import Number from '../../../../../../../components/Number';

const SkuStockDetail = (
  {
    value = {},
    onSuccess = () => {
    },
    onClose = () => {
    },
  },
) => {

  let number = 0;

  const [outStock, setOutStock] = useState({});

  const brandResult = (data) => {
    const brands = [];
    if (Array.isArray(data)) {
      data.map((item) => {
        const brandIds = brands.map((item) => {
          return item.value;
        });
        if (!brandIds.includes(item.brandId)) {
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
      let outstock = {};
      if (positionsResult(res).length === 1) {
        outstock = { positionsId: positionsResult(res)[0].value };
      }

      if (brandResult(res).length === 1) {
        outstock = { ...outstock, brandId: brandResult(res)[0].value };
      }
      setOutStock(outstock);
    },
  });

  data && data.map((item) => {
    return number += item.number;
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
        position:'bottom'
      });
    },
    onError: () => {
      Toast.show({
        content: '出库失败！',
        position:'bottom'
      });
    },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty description='该物料没有库存！' />;
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

  return <div style={{ height: '80vh',overflow:'auto' }}>
    <Divider>物料信息</Divider>
    <Space direction='vertical'>
      {value.content}
      <Space>
        <div style={{ width: 70 }}>
          库存数：
        </div>
        <strong>{number}</strong>
      </Space>
    </Space>
    <Divider>品牌信息</Divider>
    {
      <Selector
        columns={1}
        value={[outStock.brandId]}
        options={brandResult(data)}
        onChange={(arr, extend) => {
          setOutStock({ ...outStock, brandId: arr[0] });
        }} />
    }
    <Divider>库位信息</Divider>
    {
      <Selector
        columns={1}
        value={[outStock.positionsId]}
        options={positionsResult(data)}
        onChange={(arr, extend) => {
          setOutStock({ ...outStock, positionsId: arr[0] });
        }}
      />
    }
    <Divider>库位信息</Divider>
    <Space align='center'>
      出库数量：<Number
      value={outStock.number}
      onChange={(value) => {
        setOutStock({ ...outStock, number: value });
      }} />
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
