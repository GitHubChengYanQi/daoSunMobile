import React, { useEffect } from 'react';
import { useRequest } from '../../../../util/Request';
import { skuDetail } from '../../../Scan/Url';
import { Image, Space } from 'antd-mobile';
import Label from '../../../components/Label';
import MyEmpty from '../../../components/MyEmpty';
import { MyLoading } from '../../../components/MyLoading';
const Detail = ({ value }) => {

  const { loading, data, run } = useRequest(skuDetail, { manual: true });

  useEffect(() => {
    if (value) {
      run({ data: { skuId: value } });
    }
  }, []);

  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <div style={{ padding: 24 }}>
    <div>
      <Image height={200} alt='暂无图片' />
    </div>
    <div>
      <Space direction='vertical' style={{width:'100%'}}>
        <div>
          <Label>物料编码：</Label>{data.standard}
        </div>
        <div>
          <Label>物料分类：</Label>{data.spuResult && data.spuResult.spuClassificationResult && data.spuResult.spuClassificationResult.name}
        </div>
        <div>
          <Label>物料名称：</Label>{data.spuResult && data.spuResult.name}
        </div>
        <div>
          <Label>物料型号：</Label>{data.skuName}
        </div>
        <div>
          <Label>物料规格：</Label>{data.specifications}
        </div>
        <div>
          <Label>单位：</Label>{data.spuResult && data.spuResult.unitResult && data.spuResult.unitResult.unitName}
        </div>
        <div>
          <Label>品牌 / 厂商：</Label>{data.brandResults && data.brandResults.map((item) => item.brandNname).join(',')}
        </div>
        <div>
          <Label>物料描述</Label>
          <div>
            <Space wrap>
              {
                data.list && data.list.map((item, index) => {
                  return <div key={index}>
                    <div style={{ border: 'solid 1px #eee', padding: 8 }}>
                      {item.itemAttributeResult && item.itemAttributeResult.attribute}
                    </div>
                    <div style={{ border: 'solid 1px #eee', padding: 8 }}>
                      {item.attributeValues}
                    </div>
                  </div>;
                })
              }
            </Space>
          </div>

        </div>
        <div>
          <Label>物料明细</Label>
          <div style={{ display: 'flex' }}>
            <div style={{ border: 'solid 1px #eee', padding: 8,flexGrow:1 }}>
              批号
            </div>
            <div style={{ border: 'solid 1px #eee', padding: 8,width:100 }}>
              数量
            </div>
            <div style={{ border: 'solid 1px #eee', padding: 8,flexGrow:1 }}>
              明细
            </div>
          </div>
        </div>
      </Space>
    </div>


  </div>;
};

export default Detail;
