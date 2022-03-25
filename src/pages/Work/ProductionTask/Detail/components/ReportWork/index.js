import React, { useState } from 'react';
import { Dialog, List, Space, Toast } from 'antd-mobile';
import MyEllipsis from '../../../../../components/MyEllipsis';
import SkuResult_skuJsons from '../../../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../../../components/Label';
import Number from '../../../../../components/Number';
import { useRequest } from '../../../../../../util/Request';
import { productionJobBookingAdd } from '../../../../Production/components/Url';
import { MyLoading } from '../../../../../components/MyLoading';

const ReportWork = (
  {
    productionTaskId,
    visible,
    setVisible = (() => {
    }),
    skuData,
    onSuccess = () => {
    },
  }) => {

  const { loading, run } = useRequest(productionJobBookingAdd, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '报工成功！',
        position: 'bottom',
      });
      onSuccess();
    },
    onError: (err) => {
      Toast.show({
        content: '报工失败！',
        position: 'bottom',
      });
    },
  });

  const [outSkus, setOutSkus] = useState(skuData || []);

  if (loading) {
    return <><MyLoading /></>;
  }

  return <>
    <Dialog
      visible={visible}
      title='产出物料'
      onAction={(action) => {
        if (action.key === 'ok') {
          const out = outSkus.filter((item) => {
            return item.outNumber;
          })
          run({
            data: {
              productionTaskId,
              detailParams: out.map((item) => {
                if (item.outNumber) {
                  return {
                    skuId: item.skuId,
                    number: item.outNumber,
                  };
                }
                return null;
              }),
            },
          });
        } else {
          setVisible(false);
        }
      }}
      actions={[[{
        text: '取消',
        key: 'close',
      }, {
        text: '报工',
        key: 'ok',
      }]]}
      content={<List
        style={{
          '--border-inner': 'solid var(--adm-color-primary) 1px',
          '--border-bottom': 'none',
        }}
      >
        {
          outSkus.map((item, index) => {
            const skuResult = item.skuResult || {};
            return <List.Item key={index}>
              <MyEllipsis><SkuResult_skuJsons skuResult={skuResult} /></MyEllipsis>
              <div>
                <Label>描述：</Label>
                <MyEllipsis width='74%'><SkuResult_skuJsons skuResult={skuResult} describe /></MyEllipsis>
              </div>
              <Space>
                <Label>产出数量：</Label>
                <Number value={item.outNumber} max={item.maxNumber} noBorder onChange={(value) => {
                  const array = outSkus.filter(() => true);
                  array[index] = { ...array[index], outNumber: value };
                  setOutSkus(array);
                }} />
              </Space>
            </List.Item>;
          })
        }
      </List>}
    />
  </>;
};

export default ReportWork;
