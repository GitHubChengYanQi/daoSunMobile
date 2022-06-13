import React, { useEffect } from 'react';
import { Card, Space } from 'antd-mobile';
import { CloseCircleOutline } from 'antd-mobile-icons';
import LinkButton from '../../../../../components/LinkButton';
import Number from '../../../../../components/Number';
import {SkuResultSkuJsons} from '../../../../../Scan/Sku/components/SkuResult_skuJsons';
import MyEmpty from '../../../../../components/MyEmpty';
import Label from '../../../../../components/Label';
import { Col, Row } from 'antd';

const Skus = ({ data, value = [], onChange }) => {

  useEffect(() => {
    if (data) {
      onChange(data.map((item) => {
        return {
          skuId: item.skuId,
          skuResult: item.skuResult,
          maxNumber: item.num,
        };
      }));
    }
  }, []);


  if (!Array.isArray(data) || data.length === 0) {
    return <MyEmpty />;
  }

  return <div style={{ backgroundColor: '#eee', padding: 8 }}>
    {
      value.map((item, index) => {
        const skuResult = item.skuResult || {};
        return <Card
          key={index}
          title={skuResult.standard}
          extra={<LinkButton onClick={() => {
            onChange(value.filter(((skuItem) => {
              return item.skuId !== skuItem.skuId;
            })));
          }}><CloseCircleOutline /></LinkButton>}>
          <Row gutter={24}>
            <Col span={16}>
              <Space direction='vertical'>
                {SkuResultSkuJsons({skuResult})}
                <div>
                  <Label>描述：</Label>
                  {SkuResultSkuJsons({skuResult,describe:true})}
                </div>
              </Space>
            </Col>
            <Col span={8}>
              <Number
                color={item.number > item.maxNumber ? 'red' : 'blue'}
                max={item.maxNumber}
                value={item.number}
                onChange={(number) => {
                  const array = value.filter(() => true);
                  array[index] = { ...item, number };
                  onChange(array);
                }} />
            </Col>
          </Row>
        </Card>;
      })
    }
  </div>;
};

export default Skus;
