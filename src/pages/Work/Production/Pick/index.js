import React, { useEffect } from 'react';
import { useRequest } from '../../../../util/Request';
import { productionPickListsGetByTask, productionTaskGetPickCode } from '../components/Url';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';
import { Button, Card, Dialog, Space } from 'antd-mobile';
import Label from '../../../components/Label';
import MyNavBar from '../../../components/MyNavBar';
import MyEllipsis from '../../../components/MyEllipsis';
import SkuResult_skuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import BottomButton from '../../../components/BottomButton';

const Pick = ({ module, id, ...props }) => {

  const params = props.location && props.location.query;

  const { loading, data, run } = useRequest(productionPickListsGetByTask, { manual: true });

  const { loading: codeLoading, run: getCode } = useRequest(productionTaskGetPickCode, {
    manual: true,
    onSuccess: (res) => {
      Dialog.alert({
        title: '领料码',
        content: <div style={{ textAlign: 'center' }}>{res}</div>,
        confirmText: '确定',
      });
    },
  });

  useEffect(() => {
    if (params && params.id || id) {
      run({ data: { sourceId: id || params.id } });
    }
  }, []);


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  return <div>
    {!id && <div>
      <MyNavBar title='工单详情' />
      <Card
        title={<div><Label>领料编码：</Label>{data.productionTaskResult && data.productionTaskResult.coding}</div>}
        style={{ backgroundColor: '#fff', margin: 8, marginBottom: 16 }}>
        <Space direction='vertical'>
          <div>
            <Label>领料人：</Label>{data.userResult && data.userResult.name}
          </div>
          <div>
            <Label>创建时间：</Label>{data.createTime}
          </div>
        </Space>
      </Card>
    </div>
    }
    <Card title={!id && <div>领取物料</div>}>
      {
        (!data.detailResults || data.detailResults.length === 0)
          ?
          <MyEmpty />
          :
          data.detailResults.map((item, index) => {
            const skuResult = item.skuResult || {};
            return <div key={index} style={{ margin: 8, border: 'solid #eee 1px' }}>
              <Card style={{ borderRadius: 0 }}>
                <MyEllipsis><SkuResult_skuJsons skuResult={skuResult} /></MyEllipsis>
                <div>
                  <Label>描述：</Label>
                  <MyEllipsis width='80%'><SkuResult_skuJsons skuResult={skuResult} describe /></MyEllipsis>
                </div>
              </Card>
              <div>
                <Button
                  style={{
                    width: '50%',
                    color: 'var(--adm-color-primary)',
                    '--border-radius': '0px',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottomLeftRadius: 10,
                  }}
                >
                  已完成：{item.status === 99 ? item.number : 0}
                </Button>
                <Button
                  style={{
                    width: '50%',
                    color: 'var(--adm-color-primary)',
                    '--border-radius': '0px',
                    borderBottomRightRadius: 10,
                    borderRight: 'none',
                    borderLeft: 'none',
                  }}
                >
                  领料数：{item.number}
                </Button>
              </div>
            </div>;
          })
      }
    </Card>

    {module !== 'task' && <BottomButton only text='获取领料码' onClick={() => {
      getCode({
        data: {
          productionTaskId: params.id,
        },
      });
    }} />}
    {codeLoading && <MyLoading />}
  </div>;
};

export default Pick;
