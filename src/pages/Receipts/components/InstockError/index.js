import React, { useEffect } from 'react';
import { Card, Divider, Space } from 'antd-mobile';
import { useRequest } from '../../../../util/Request';
import Label from '../../../components/Label';
import MyEllipsis from '../../../components/MyEllipsis';
import { SkuResultSkuJsons } from '../../../Scan/Sku/components/SkuResult_skuJsons';
import UpLoadImg from '../../../components/Upload';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';

const InstockError = ({ id }) => {

  const { loading, data, run } = useRequest({ url: '/anomaly/detail', method: 'POST' }, { manual: true });

  let number = 0;
  let newNumber = 0;

  useEffect(() => {
    if (id) {
      run({
        data: {
          formId: id,
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

  const source = (value) => {
    switch (value) {
      case 'procurementOrder':
        return '采购单';
      default:
        return '请选择';
    }
  };

  data.results.map((item) => {
    number += item.planNumber;
    newNumber += item.realNumber;
    return null;
  });

  const orderResult = data.orderResult || {};

  return <div>
    <Card
      style={{
        boxShadow: 'rgb(109 110 112 / 49%) 0px 0px 5px',
        margin: '8px 0',
      }}
      title={<div>基本信息</div>}>
      <Space direction='vertical'>
        <div>
          <Label>库管人员：</Label>{orderResult.stockUserResult && orderResult.stockUserResult.name}
        </div>
        <div>
          <Label>提报时间：</Label>{orderResult.createTime}
        </div>
        <div>
          <Label>处理人员：</Label>{orderResult.userResult && orderResult.userResult.name}
        </div>
        <div>
          <Label>处理时间：</Label>{orderResult.updateTime}
        </div>
        <div>
          <Label>关联任务：</Label>{source(orderResult.source)}
        </div>
      </Space>
    </Card>
    <Card
      style={{
        boxShadow: 'rgb(109 110 112 / 49%) 0px 0px 5px',
        margin: '8px 0',
      }}
      title={<div>异常明细</div>}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>
          <Label>计划总数：</Label>{number}
        </div>
        <div style={{ flexGrow: 1 }}>
          <Label>实际总数：</Label>{newNumber}
        </div>
      </div>
      <Divider />
      {data.results.map((item, index) => {
        return <Space
          direction='vertical'
          key={index}
          style={{ backgroundColor: '#f9f9f9', padding: 16, width: '100%', borderRadius: 10, marginBottom: 8 }}
        >
          <MyEllipsis>{SkuResultSkuJsons({skuResult:item.simpleResult})}</MyEllipsis>
          <div style={{ display: 'flex' }}>
            <div style={{ flexGrow: 1 }}>
              <Label>计划待入库：</Label>{item.planNumber}
            </div>
            <div style={{ flexGrow: 1 }}>
              <Label>实际待入库：</Label>{item.realNumber}
            </div>
          </div>
          <div>
            <Label>异常原因：</Label>{item.type}
          </div>
        </Space>;
      })}
    </Card>
    <Card
      style={{
        boxShadow: 'rgb(109 110 112 / 49%) 0px 0px 5px',
        margin: '8px 0',
      }}
      title={<div>备注说明</div>
      }>
      {data.remark || '无'}
    </Card>
    {data.filedUrls && data.filedUrls.length > 0 && <Card title={<div>附件</div>}>
      <UpLoadImg
        fileList={data.filedUrls.map((item) => {
          return { url: item };
        })}
        maxCount={5}
        showUploadList
        type='text'
        button
      />
    </Card>}
  </div>;
};

export default InstockError;
