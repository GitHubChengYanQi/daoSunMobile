import React, { useEffect, useState } from 'react';
import MyEmpty from '../../../components/MyEmpty';
import MyNavBar from '../../../components/MyNavBar';
import { Button, Card, Space, TextArea, Toast } from 'antd-mobile';
import SkuResultSkuJsons from '../../../Scan/Sku/components/SkuResult_skuJsons';
import Label from '../../../components/Label';
import MyBottom from '../../../components/MyBottom';
import { useRequest } from '../../../../util/Request';
import { history } from 'umi';
import { MyLoading } from '../../../components/MyLoading';
import LinkButton from '../../../components/LinkButton';
import UpLoadImg from '../../../components/Upload';
import MyEllipsis from '../../../components/MyEllipsis';
import { ReceiptsEnums } from '../../../Receipts';

const Errors = ({ state = {}, setType }) => {

  const details = state.details;

  const id = state.id;

  const [remark, setRemark] = useState('');

  const [enclosure, setEnclosure] = useState([]);

  const { loading, run } = useRequest({
    url: '/anomaly/add',
    method: 'POST',
  }, {
    manual: true,
    onSuccess: () => {
      Toast.show({
        content: '提交成功！',
      });
      history.goBack();
    },
  });

  useEffect(() => {
    setType(ReceiptsEnums.verifyError);
  }, []);

  if (!details || !Array.isArray(details) || !id) {
    return <MyEmpty />;
  }

  const errorDetails = details.filter(item => item.number !== item.newNumber);
  const successDetails = details.filter(item => item.number === item.newNumber);

  return <>
    <MyBottom
      leftActuions={<div><Label>异常：</Label>{errorDetails.length}</div>}
      buttons={<Space>
        <Button color='primary' onClick={() => {
          run({
            data: {
              anomalyType: 'InstockError',
              formId: id,
              remark,
              enclosure: enclosure.map(item => item.id).join(','),
              detailParams: errorDetails.map((item) => {
                return {
                  skuId: item.skuId,
                  type: '数量不符',
                  planNumber: item.number,
                  realNumber: item.newNumber,
                  instockListId: item.instockListId,
                };
              }),
            },
          });
        }}>提交并暂停入库</Button>
      </Space>}
    >
      <MyNavBar title='提报入库异常' />
      <Card style={{ boxShadow: 'rgb(109 110 112 / 49%) 0px 0px 5px', margin: '8px 0' }} title={<div>数量异常明细</div>}>
        {errorDetails.map((item, index) => {
          return <Space
            direction='vertical'
            key={index}
            style={{ backgroundColor: '#f9f9f9', padding: 16, maxWidth: '100%', borderRadius: 10, marginBottom: 8 }}
          >
            <MyEllipsis><SkuResultSkuJsons skuResult={item.skuResult} /></MyEllipsis>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }}>
                <Label>计划待入库：</Label>{item.number}
              </div>
              <div style={{ flexGrow: 1 }}>
                <Label>实际待入库：</Label>{item.newNumber}
              </div>
            </div>
          </Space>;
        })}
      </Card>
      <Card title={<div>异常描述</div>}>
        <TextArea placeholder='请输入描述信息。。。' value={remark} onChange={setRemark} />
      </Card>
      <Card title={<div>
        <UpLoadImg
          maxCount={5}
          showUploadList
          type='text'
          button={
            <div style={{ display: 'flex', width: '90vw' }}>
              <div style={{ flexGrow: 1 }}>
                附件 {enclosure.length || 0} / 5 格式：JPG.PDF
              </div>
              <div>
                <LinkButton>上传附件</LinkButton>
              </div>
            </div>
          }
          onChange={(url, id, name) => {
            setEnclosure([...enclosure, { url, id, name }]);
          }}
          onRemove={(name) => {
            const array = enclosure.filter((item) => {
              return item.name !== name;
            });
            setEnclosure(array);
          }}
        />
      </div>}>
      </Card>
      {successDetails.length > 0 &&
      <Card style={{ boxShadow: 'rgb(109 110 112 / 49%) 0px 0px 5px', margin: '8px 0' }} title={<div>数量正常明细</div>}>
        {successDetails.map((item, index) => {
          return <Space
            direction='vertical'
            key={index}
            style={{ backgroundColor: '#f9f9f9', padding: 16, width: '100%', borderRadius: 10, marginBottom: 8 }}
          >
            <MyEllipsis><SkuResultSkuJsons skuResult={item.skuResult} /></MyEllipsis>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }}>
                <Label>计划待入库：</Label>{item.number}
              </div>
              <div style={{ flexGrow: 1 }}>
                <Label>实际待入库：</Label>{item.newNumber}
              </div>
            </div>
          </Space>;
        })}
      </Card>}
    </MyBottom>

    {loading && <MyLoading />}
  </>;
};

export default Errors;
