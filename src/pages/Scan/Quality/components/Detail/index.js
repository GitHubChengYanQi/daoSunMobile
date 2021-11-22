import { useRequest } from '../../../../../util/Request';
import React, { useEffect, useState } from 'react';
import { Button, Collapse, Ellipsis, Empty } from 'antd-mobile';
import { Badge, Col, Row } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Gallery } from 'weui-react-v2';


const Detail = ({ qualityTaskId }) => {

  const [visible,setVisible] = useState();

  const { data, run } = useRequest({
    url: '/qualityTask/formDetail',
    method: 'POST',
  }, { manual: true });

  useEffect(() => {
    if (qualityTaskId) {
      run({
        data: {
          qualityTaskId,
        },
      });
    }
  }, [qualityTaskId, run]);


  const operator = (value) => {
    switch (value) {
      case 1:
        return <>=</>;
      case 2:
        return <>{'>='}</>;
      case 3:
        return <>{'<='}</>;
      case 4:
        return <>{'>'}</>;
      case 5:
        return <>{'<'}</>;
      case 6:
        return <>{'<>'}</>;
      default:
        break;
    }
  };

  const Type = (items) => {
    switch (items.type) {
      case 1:
        return <>{operator(items.field.operator)}  {items.field.standardValue}</>;
      case 2:
        return <>文本</>;
      case 3:
        return <>是否</>;
      case 4:
        return <>图片</>;
      case 5:
        return <>{operator(items.field.operator)}  {items.field.standardValue} % </>;
      case 6:
        return <>视频</>;
      case 7:
        return <>附件</>;
      default:
        return null;
    }
  };

  const valueType = (items) => {
    switch (items.type) {
      case 1:
        return <>{items.value}</>;
      case 2:
        return <>{items.value}</>;
      case 3:
        return <>{items.value === '1' ? '合格' : '不合格'}</>;
      case 4:
        return  <Button style={{padding:0}} color='primary' fill='none' onClick={() => setVisible(items.value)}>查看</Button>
      case 5:
        return <>{items.value} % </>;
      case 6:
        return <Button style={{padding:0}} color='primary' fill='none' onClick={() => setVisible(items.value)}>查看</Button>;
      case 7:
        return <Button style={{padding:0}} color='primary' fill='none' onClick={() => setVisible(items.value)}>查看</Button>;
      default:
        return null;
    }
  };

  return <>
    {data && data.length > 0 ? <Collapse accordion>
        {
          data.map((items, index) => {
            const standar = items.valueResults && items.valueResults.filter((value) => {
              return value.standar === false;
            });
            return <Collapse.Panel key={index} title={
              <>
                {items.sku && items.sku.skuName}
                &nbsp;/&nbsp;
                {items.sku && items.sku.spuResult && items.sku.spuResult.name}
                &nbsp;&nbsp;
                <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                  (
                  {
                    items.sku
                    &&
                    items.sku.skuJsons
                    &&
                    items.sku.skuJsons.map((items, index) => {
                      return (
                        <span key={index}>{items.attribute.attribute}：{items.values.attributeValues}</span>
                      );
                    })
                  }
                  )
                </em>
                &nbsp;&nbsp;
                {items.brand && items.brand.brandName}
                &nbsp;&nbsp;
                ×
                {items.inkind && items.inkind.number}
                <div style={{ float: 'right' }}>
                  {(standar && standar.length > 0)
                    ?
                    <Badge text='不合格' color='red' />
                    :
                    <Badge text='合格' color='green' />}
                </div>
              </>
            }>
              <Row key={index} gutter={24}>
                <Col span={5}>
                  <strong>质检项</strong>
                </Col>
                <Col span={7}>
                  <strong>合格标准</strong>
                </Col>
                <Col span={7}>
                  <strong>检测结果</strong>
                </Col>
                <Col span={3}>
                  <strong>结果</strong>
                </Col>
              </Row>
              {items.valueResults && items.valueResults.map((items, index) => {
                return <Row key={index} gutter={24}>
                  <Col span={5}>
                    <Ellipsis direction='end' content={items.name} />
                  </Col>
                  <Col span={7}>
                  {Type(items)}
                  </Col>
                  <Col span={7}>
                  {valueType(items)}
                  </Col>
                  <Col span={3}>
                  {items.standar ?
                    <CheckCircleOutlined style={{ color: 'green' }} />
                    :
                    <CloseCircleOutlined style={{ color: 'red' }} />}
                  </Col>
                </Row>;
              })}
            </Collapse.Panel>;
          })
        }

      </Collapse>
      :
      <Empty
        style={{ padding: '64px 0' }}
        imageStyle={{ width: 128 }}
        description='暂无数据'
      />
    }
    <Gallery className="image-view-demo" data={[{ src:visible }]} visible={visible} onVisibleChange={setVisible} />;
  </>;

};

export default Detail;
