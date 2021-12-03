import { useRequest } from '../../../../../util/Request';
import React, { useEffect, useState } from 'react';
import { Button, Collapse, Ellipsis, Empty } from 'antd-mobile';
import { Badge, Col, Row } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Gallery } from 'weui-react-v2';


const Detail = ({ qualityTaskId }) => {

  const [visible, setVisible] = useState();

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


  const operator = (operator, value) => {
    switch (operator) {
      case 1:
        return <>{'=' + value}</>;
      case 2:
        return <>{'>=' + value}</>;
      case 3:
        return <>{'<=' + value}</>;
      case 4:
        return <>{'>' + value}</>;
      case 5:
        return <>{'<' + value}</>;
      case 6:
        return <>{value.split(',')[0] + '  —  ' + value.split(',')[1]}</>;
      default:
        break;
    }
  };

  const Type = (items) => {
    switch (items.type) {
      case 1:
        return <>{operator(items.field.operator, items.field.standardValue)} </>;
      case 2:
        return <>文本</>;
      case 3:
        return <>是否</>;
      case 4:
        return <>{operator(items.field.operator, items.field.standardValue)} % </>;
      case 5:
        return <>附件</>;
      default:
        return null;
    }
  };

  const valueType = (items) => {
    switch (items.type) {
      case 1:
        return <>{items.value && items.value.value}</>;
      case 2:
        return <>{items.value && items.value.value}</>;
      case 3:
        return <>{(items.value && items.value.value === '1') ? '合格' : '不合格'}</>;
      case 4:
        return <>{items.value && items.value.value} % </>;
      case 5:
        return items.value && items.value.value &&
          <Button
            style={{ padding: 0 }}
            color='primary'
            fill='none'
            onClick={() => setVisible([items.value.value])}>查看</Button>;
      default:
        return null;
    }
  };

  if (!data) {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }

  return <>
    {data.length > 0 ? <Collapse accordion>
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
                <Col span={4} style={{ padding: 0 }}>
                  <strong>质检项</strong>
                </Col>
                <Col span={7} style={{ padding: 0 }}>
                  <strong>标准值</strong>
                </Col>
                <Col span={7} style={{ padding: 0 }}>
                  <strong>验收值</strong>
                </Col>
                <Col span={2} style={{ padding: 0 }}>
                  <strong>图片</strong>
                </Col>
                <Col span={2} style={{ padding: 0 }}>
                  <strong>结果</strong>
                </Col>
              </Row>
              {items.valueResults && items.valueResults.map((items, index) => {
                return <Row key={index} gutter={24}>
                  <Col span={4} style={{ padding: 0 }}>
                    <Ellipsis direction='end' content={items.name} />
                  </Col>
                  <Col span={7} style={{ padding: 0 }}>
                    {Type(items)}
                  </Col>
                  <Col span={7} style={{ padding: 0 }}>
                    {valueType(items)}
                  </Col>
                  <Col span={2} style={{ padding: 0 }}>
                    {
                      items
                      &&
                      items.value
                      &&
                      items.value.imgValues
                      &&
                      items.value.imgValues.length > 0
                      &&
                      <Button
                        style={{ padding: 0 }}
                        color='primary'
                        fill='none'
                        onClick={() => {
                          setVisible(items.value && items.value.imgValues);
                        }}>查看</Button>}
                  </Col>
                  <Col span={2} style={{ padding: 0, textAlign: 'center' }}>
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
    <Gallery className='image-view-demo' data={visible ? visible.map((items) => {
      return {
        src: items.url,
      };
    }) : []} visible={visible} onVisibleChange={setVisible} />;
  </>;

};

export default Detail;
