import React, { useState } from 'react';
import { Dialog, List, Space, Toast } from 'antd-mobile';
import Label from '../../../../../components/Label';
import Number from '../../../../../components/Number';
import { useRequest } from '../../../../../../util/Request';
import { productionJobBookingAdd } from '../../../../Production/components/Url';
import { MyLoading } from '../../../../../components/MyLoading';
import LinkButton from '../../../../../components/LinkButton';
import SkuItem from '../../../../Sku/SkuItem';
import { useHistory } from 'react-router-dom';

const ReportWork = (
  {
    productionTaskId,
    visible,
    setVisible = (() => {
    }),
    skuData = [],
    onSuccess = () => {
    },
  }) => {

  const history = useHistory();

  const { loading, run } = useRequest(productionJobBookingAdd, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '报工成功！',
        position: 'bottom',
      });
      onSuccess();
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
          });
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
              <SkuItem skuResult={skuResult} />
              {
                item.myQualityId
                  ?
                  <div style={{ padding: '8px 0' }}>
                    <LinkButton onClick={() => {
                      history.push({
                        pathname: '/Work/Quality/QualityTask',
                        query: {
                          productionTaskId,
                          skuId: item.skuId,
                          qualityId: item.myQualityId,
                          module: 'production',
                        },
                      });
                    }}>请点击进行自检</LinkButton>
                  </div>
                  :
                  <Space>
                    <Label>产出数量：</Label>
                    <Number width={200} value={item.outNumber} max={item.maxNumber} noBorder onChange={(value) => {
                      const array = outSkus.filter(() => true);
                      array[index] = { ...array[index], outNumber: value };
                      setOutSkus(array);
                    }} />
                  </Space>
              }
            </List.Item>;
          })
        }
      </List>}
    />
  </>;
};

export default ReportWork;
