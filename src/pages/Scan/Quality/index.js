import React, {  useState } from 'react';
import { Button, Card, Empty, List, Tabs, Toast } from 'antd-mobile';
import './index.css';
import QualityNumber from './components/QualityNumber';
import { request, useRequest } from '../../../util/Request';
import { Affix } from 'antd';
import CreateInstock from './components/CreateInstock';
import Detail from './components/Detail';
import { useDebounceEffect } from 'ahooks';


const Quality = ({ data, onChange }) => {

  const [show, setShow] = useState(false);

  const [key, setKey] = useState('0');

  const [value, setValue] = useState([]);

  const [defaval, setDefaval] = useState([]);

  const [complete, setComplete] = useState(false);

  const { run: detail } = useRequest(
    {
      url: '/qualityTask/formDetail',
      method: 'POST',
    },
    {
      manual: true,
    });

  const { run: qualityEdit } = useRequest(
    {
      url: '/qualityTask/checkOver',
      method: 'POST',
    },
    {
      manual: true,
    });

  const defa = (val) => {
    const arrs = [];

    value.map((items, index) => {
      return arrs[index] = items || null;
    });

    arrs[key] = { values: val };

    setDefaval(arrs);
    setValue(arrs);
  };

  const create = async () => {
    if (data && data.qualityTaskId) {
      const values = await detail({
        data: {
          qualityTaskId: data.qualityTaskId,
        },
      });
      const inkinds = values && values.map((items) => {
        const standar = items.valueResults && items.valueResults.filter((value) => {
          return value.standar === false;
        });
        return {
          inkind: items,
          success: standar ? (standar.length === 0) : false,
        };
      });
      if (inkinds && inkinds.length > 0) {
        setShow(inkinds);
      } else {
        Toast.show({
          content: '没有质检通过的物料！',
        });
      }
    }
  };

  const onchange = (val) => {
    const arrs = [];

    value.map((items, index) => {
      return arrs[index] = items;
    });

    arrs[key] = { values: val };

    setValue(arrs);

    typeof onChange === 'function' && onChange();

    return !(arrs.length === (data && data.details.length));
  };

  const qualityTaskDetail = async (qualityTaskId) => {
    const data = await request({
      url: '/qualityTaskDetail/list',
      method: 'POST',
      data:{
        qualityTaskId,
      }
    });

    const count = data && data.filter((value) => {
      return value.status !== '完成';
    });

    if (count.length === 0) {
      qualityEdit(
        {
          data: {
            qualityTaskId,
            state: 1,
          },
        },
      );
    }
    setComplete(count.length === 0);
  };

  useDebounceEffect(() => {
    if (data && data.state === 0) {
      qualityTaskDetail(data.qualityTaskId);
    } else {
      setComplete(true);
    }
  }, [data],{
    wait:0
  });


  if (data) {
    return <div style={{ overflowX: 'hidden' }}>
      <Card title='基本信息' bodyStyle={{ padding: 0 }}>

        <List.Item>质检编码：{data.coding}</List.Item>
        <List.Item>质检类型：{data.type}</List.Item>
        <List.Item>负责人：{data.userName}</List.Item>
        <List.Item>备注：{data.remark || '无'}</List.Item>
        <List.Item>创建时间：{data.createTime}</List.Item>

      </Card>

      <Tabs style={{ backgroundColor: '#fff' }} onChange={(value) => {
        if (value === '0') {
          setValue([]);
          setDefaval([]);
          setKey('0');
          typeof onChange === 'function' && onChange();
        }

      }}>
        <Tabs.TabPane title='质检任务' key='0'>
          {/*skus*/}
          {!complete ? <Affix offsetTop={0}>
              <div style={{ backgroundColor: '#fff' }}>
                <Tabs activeKey={key} onChange={(value) => {
                  setKey(value);
                }}>
                  {
                    data.details && data.details.map((items, index) => {

                      return <Tabs.TabPane title={
                        <>
                          {items.skuResult && items.skuResult.skuName}
                          &nbsp;/&nbsp;
                          {items.skuResult && items.skuResult.spuResult && items.skuResult.spuResult.name}
                          &nbsp;&nbsp;
                          <em style={{ color: '#c9c8c8', fontSize: 10 }}>
                            (
                            {
                              items.skuResult
                              &&
                              items.skuResult.skuJsons
                              &&
                              items.skuResult.skuJsons.map((items, index) => {
                                return <span key={index}>
                        {items.attribute.attribute}：{items.values.attributeValues}
                      </span>;
                              })
                            }
                            )
                          </em>
                        </>
                      } key={index}>
                        { /* 数量 */}
                        <QualityNumber
                          number={items.number}
                          taskId={data.qualityTaskId}
                          batch={items.batch}
                          values={defaval[index] && defaval[index].values}
                          data={items}
                          create={() => {
                            create();
                          }}
                          defaultValue={(value) => {
                            defa(value);
                          }}
                          onChange={(value) => {
                            const val = onchange(value);
                            if (val === true) {
                              setKey(`${parseInt(key) + 1}`);
                            }
                          }} />
                      </Tabs.TabPane>;
                    })
                  }
                </Tabs>
              </div>
            </Affix>
            :
            <Empty
              style={{ padding: '64px 0' }}
              imageStyle={{ width: 128 }}
              description={<>质检已经完成了{data.state === 2 &&
              <Button style={{ padding: 0 }} color='primary' fill='none' onClick={() => {
                create();
              }}>点击生成入库单</Button>}</>}
            />}
        </Tabs.TabPane>
        <Tabs.TabPane title='质检详情' key='1'>
          <Detail qualityTaskId={data.qualityTaskId} />
        </Tabs.TabPane>
      </Tabs>
      <CreateInstock show={show} />
    </div>;
  } else {
    return <Empty
      style={{ padding: '64px 0' }}
      imageStyle={{ width: 128 }}
      description='暂无数据'
    />;
  }

};

export default Quality;
