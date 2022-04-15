import React, { useState } from 'react';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import { Button, Card, List, Space, TextArea, Toast } from 'antd-mobile';
import MyAntList from '../../../components/MyAntList';
import SkuResultSkuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../components/Label';
import MyBottom from '../../../components/MyBottom';
import Process from '../../PurchaseAsk/components/Process';
import { useRequest } from '../../../../util/Request';
import { history } from 'umi';
import { MyLoading } from '../../../components/MyLoading';

const Errors = (props) => {

  const state = props.location.state;

  const details = state && state.details;

  const id = state && state.id;

  const [remake, setRemake] = useState('');

  const { loading, run } = useRequest({
    url: '/anomaly/add',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '提交成功！',
      });
      history.push(`/Work/Instock/Detail?id=${id}`);
    },
  });

  if (!details || !Array.isArray(details) || !id) {
    return <MyEmpty />;
  }

  const errorDetails = details.filter(item => item.number !== item.newNumber);
  const successDetails = details.filter(item => item.number === item.newNumber);
  console.log(errorDetails);

  return <>
    <MyBottom
      leftActuions={<div><Label>异常：</Label>{errorDetails.length}</div>}
      buttons={<Space>
        <Button color='primary' onClick={() => {
          run({
            data: {
              anomalyType: 'InstockError',
              formId: id,
              remake,
              detailParams: errorDetails.map((item) => {
                return {
                  skuId: item.skuId,
                  type: '数量不符',
                  number: item.number,
                  instockListId: item.instockListId,
                };
              }),
            },
          });
        }}>提交并暂停入库</Button>
      </Space>}
    >
      <MyNavBar title='提报入库异常' />
      <Card title={<div>数量异常明细</div>}>
        <MyAntList>
          {
            errorDetails.map((item, index) => {
              return <List.Item key={index}>
                <div>
                  <SkuResultSkuJsons skuResult={item.skuResult} />
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={{ flexGrow: 1 }}>
                    <Label>计划待入库：</Label>{item.number}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <Label>实际待入库：</Label>{item.newNumber}
                  </div>
                </div>
              </List.Item>;
            })
          }
        </MyAntList>
      </Card>
      <Card title={<div>异常描述</div>}>
        <TextArea placeholder='请输入异常描述。。。' value={remake} onChange={setRemake} />
      </Card>
      <Card title={<div>数量正常明细</div>}>
        <MyAntList>
          {
            successDetails.map((item, index) => {
              return <List.Item key={index}>
                <div>
                  <SkuResultSkuJsons skuResult={item.skuResult} />
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={{ flexGrow: 1 }}>
                    <Label>计划待入库：</Label>{item.number}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <Label>实际待入库：</Label>{item.newNumber}
                  </div>
                </div>
              </List.Item>;
            })
          }
        </MyAntList>
      </Card>
      <Process type='instockError' card />
    </MyBottom>

    {loading && <MyLoading />}
  </>;
};

export default Errors;
