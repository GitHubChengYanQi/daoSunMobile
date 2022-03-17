import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CascaderView, Dropdown, FloatingPanel, List, SearchBar } from 'antd-mobile';
import MyNavBar from '../../../components/MyNavBar';
import { outstockGetOrder, outstockListingList } from '../../../Scan/Url';
import BottomButton from '../../../components/BottomButton';
import { Col, Row } from 'antd';
import Number from '../../../components/Number';
import { useRequest } from '../../../../util/Request';
import { MyLoading } from '../../../components/MyLoading';
import MyEmpty from '../../../components/MyEmpty';

const OutStockOrder = (props) => {

  const FloatingPanelRef = useRef();

  const [position,setPosition] = useState([]);

  const anchors = [window.innerHeight * 0.5, window.innerHeight, window.innerHeight];

  const params = props.location.query;

  const { loading, data, run } = useRequest(outstockGetOrder, {
    manual: true,
    onSuccess: (res) => {
      // console.log(res);
    },
  });

  const { loading: outstockLoading, data: outstockData, run: outstockRun } = useRequest(outstockListingList, {
    manual: true,
  });


  useEffect(() => {
    if (params.id) {
      run({
        data: {
          outstockOrderId: params.id,
        },
      });

      outstockRun({
        data: {
          outstockOrderId: params.id,
        },
      });
    }
  }, []);

  const [searchValue, setSearchValue] = useState();

  if (loading || outstockLoading) {
    return <MyLoading />;
  }

  if (!data || !outstockData) {
    return <MyEmpty />;
  }

  const status = (value) => {
    switch (value) {
      case 0:
        return '待出库';
      case 1:
        return '未完成';
      case 2:
        return '已完成';
      default:
        return null;
    }
  };

  return <>
    <MyNavBar title='出库单' />
    <Card title='基本信息'>
      <List
        style={{
          '--border-top': 'none',
          '--border-bottom': 'none',
          '--border-inner': 'none',
        }}>
        <List.Item>
          出库单号:
        </List.Item>
        <List.Item>
          状态:{status(data.state)}
        </List.Item>
        <List.Item>
          负责人:{data.userResult && data.userResult.name}
        </List.Item>
        <List.Item>
          仓库:{data.storehouseResult && data.storehouseResult.name}
        </List.Item>
        <List.Item>
          创建时间:{data.createTime}
        </List.Item>
        <List.Item>
          创建人:
        </List.Item>
        <List.Item>
          备注:{data.note}
        </List.Item>
      </List>
    </Card>
    <FloatingPanel
      anchors={anchors}
      ref={FloatingPanelRef}
      handleDraggingOfContent={false}>
      <div style={{ backgroundColor: '#fff', padding: 8, height: '10%' }}>
        <SearchBar
          placeholder='搜索物料'
          value={searchValue}
          showCancelButton={() => true}
          onCancel={() => {

          }}
          onChange={(value) => {
            setSearchValue(value);
          }}
        />
        <Dropdown>
          <Dropdown.Item key='postions' title='库位'>
            <div style={{ padding: 12 }}>
              <CascaderView
                options={[{label:1,value:1,children:[{label:2,value:2}]}]}
                value={position}
                onChange={(val) => {
                  setPosition(val);
                }}
              />
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div style={{ maxHeight: '90%', overflow: 'auto', backgroundColor: '#eee' }}>
        {
          outstockData.map((item, index) => {
            return <Card
              key={index}
              style={{ margin: 8 }}
            >
              <List
                style={{
                  '--border-top': 'none',
                  '--border-bottom': 'none',
                  '--border-inner': 'none',
                }}>
                <List.Item>
                  物料: {`${item.spuResult.name} / ${item.skuResult.skuName}`}
                </List.Item>
                <List.Item>
                  品牌/厂家: {item.brandResult && item.brandResult.brandName}
                </List.Item>
                <List.Item>
                  <Row gutter={24}>
                    <Col span={12}>
                      库存数量:
                    </Col>
                    <Col span={12}>
                      出库数量:{item.number}
                    </Col>
                  </Row>
                </List.Item>
                <List.Item>
                  <div>
                    库位:
                    A-1-1
                  </div>
                  <Row gutter={24}>
                    <Col span={12}>
                      出库：<Number width={100} />
                    </Col>
                    <Col span={12}>
                      剩余：<Number width={100} />
                    </Col>
                  </Row>
                  <div>A-1-2</div>
                  <Row gutter={24}>
                    <Col span={12}>
                      出库：<Number width={100} />
                    </Col>
                    <Col span={12}>
                      剩余：<Number width={100} />
                    </Col>
                  </Row>
                </List.Item>
                <List.Item>
                  <Button style={{ width: '100%' }}>出库</Button>
                </List.Item>
              </List>
            </Card>;
          })
        }
        <BottomButton only text='一键出库' />
      </div>
    </FloatingPanel>
  </>;
};

export default OutStockOrder;
