import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { instockOrderDetail } from '../../ProcurementOrder/Url';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import { getHeader } from '../../../components/GetHeader';
import { Button, Card, Divider, Space, Tabs } from 'antd-mobile';
import { MyLoading } from '../../../components/MyLoading';
import Label from '../../../components/Label';
import styles from '../../Production/index.css';
import MyBottom from '../../../components/MyBottom';
import MyEmpty from '../../../components/MyEmpty';
import InstockDetails from './components/InstockDetails';
import { CollectMoneyOutline } from 'antd-mobile-icons';

const Detail = (props) => {

  const params = props.location.query;

  const [skus, setSkus] = useState([]);

  const [positions, setPositions] = useState({});

  let number = 0;
  let newNumber = 0;

  const getChecked = (data, key) => {
    if (Array.isArray(data)) {
      const array = data.filter((item) => {
        return item.key = key;
      });
      if (array.length === 1) {
        return array[0];
      } else {
        return getChecked(data.children, key);
      }
    } else {
      return null;
    }
  };

  const getChildren = (data, details = [], top) => {

    if (!Array.isArray(data)) {
      return null;
    }

    const skuResults = [];
    const option = data.map((item) => {
      item.skuIds && item.skuIds.map((skuId) => {
        return details.filter(item => skuId === item.skuId);
      });
      return {
        icon: <CollectMoneyOutline />,
        title: `${item.name} (${item.skuResults ? item.skuResults.length : 0})`,
        key: item.storehousePositionsId,
        // skus: sku,
        children: !top && getChildren(item.storehousePositionsResults, details),
      };
    });

    if (top) {
      return [{
        icon: <CollectMoneyOutline />,
        title: `全部 (${skuResults.length})`,
        key: 'all',
        skus: skuResults,
        children: getChildren(data, details),
      }];
    }
    if (data.length === 0) {
      return null;
    }
    return option;
  };

  const getSkus = (extend) => {
    if (extend && Array.isArray(extend.skus)) {
      setSkus(extend.skus.map((item) => {
        return {
          cart: item.cart,
          skuResult: item,
          skuId: item.skuId,
          number: item.number,
          positionId: item.positionId,
          storehouseId: item.storehouseId,
          pickLists: item.pickLists,
        };
      }));
    }
  };

  const { loading, data, run } = useRequest(instockOrderDetail, {
    manual: true,
    onSuccess: (res) => {
      if (Array.isArray(res.instockListResults)) {
        setSkus(res.instockListResults.map((item) => {
          return {
            ...item,
            newNumber: item.number,
          };
        }));
      }

      const allSku = getChildren(res && res.bindTreeView, res && res.instockListResults,  true) || [];
      if (positions.key) {
        const checked = getChecked(allSku, positions.key) || {};
        setPositions(checked);
        getSkus(checked);
      } else {
        setPositions(allSku[0]);
        getSkus(allSku[allSku.length - 1]);
      }
    },
  });

  skus.map((item) => {
    number += (item.number || 0);
    newNumber += (item.newNumber || 0);
    return null;
  });

  console.log(data);

  const [key, setKey] = useState('detail');

  useEffect(() => {
    if (params.id) {
      run({ data: { instockOrderId: params.id } });
    }
  }, []);

  if (!data) {
    return <MyEmpty />;
  }

  const backgroundDom = () => {

    return <Card
      title={<div>
        <div>
          入库单 / {data.coding}
        </div>
        <Space>
          <Button color='danger' style={{ '--border-radius': '50px', padding: '4px 24px' }}>加急</Button>
          <Button
            color='default'
            fill='outline'
            style={{
              '--border-radius': '50px',
              padding: '4px 12px',
              '--background-color': '#fff7e6',
              '--text-color': '#fca916',
              '--border-width': '0px',
            }}>待入库</Button>
        </Space>
      </div>}
      bodyStyle={{ padding: 0 }}
      className={styles.mainDiv}
      style={{ backgroundColor: '#fff' }}>
      <Card title='基本信息' bodyStyle={{ padding: '0 16px' }} headerStyle={{ border: 'none' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <div>
            <Label>入库主题：</Label>
          </div>
          <div>
            <Label>入库类型：</Label>
          </div>
          <div>
            <Label>送料人员：</Label>{data.userResult && data.userResult.name}
          </div>
          <div>
            <Label>送料时间：</Label>
          </div>
          <div>
            <Label>库管人员：</Label>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ flexGrow: 1 }}>
              <Label>入库物料：</Label>0
            </div>
            <div style={{ flexGrow: 1, color: 'green' }}>
              已入库：0
            </div>
            <div style={{ flexGrow: 1, color: 'red' }}>
              未入库：0
            </div>
          </div>
          <Divider style={{ margin: 0 }} />
          <div>
            <Label>申请人：</Label>{data.userResult && data.userResult.name}
          </div>
          <div>
            <Label>申请时间：</Label>{data.createTime}
          </div>
          <div>
            <Label>更新人员：</Label>
          </div>
          <div>
            <Label>更新时间：</Label>{data.updateTime}
          </div>
          <div>
            <Label>关联任务：</Label>
          </div>
          <div>
            <Label>备注说明：</Label>
          </div>
        </Space>
      </Card>

    </Card>;
  };

  const type = () => {
    switch (key) {
      case 'detail':
        return <InstockDetails skus={skus} setSkus={setSkus} />;
      case 'record':
        return <MyEmpty />;
      case 'log':
        return <MyEmpty />;
      default:
        return <MyEmpty />;
    }
  };

  return <>
    <MyBottom
      leftActuions={<div>
        <div>计划 / 实际</div>
        <div>{number} / <span style={{ color: number === newNumber ? 'blue' : 'red' }}>{newNumber}</span></div>
      </div>}
      buttons={<Space>
        <Button color='primary' fill='outline'>暂停入库</Button>
        <Button color='primary'>提交并继续入库</Button>
      </Space>}
    >
      <div>
        <MyNavBar title='入库单详情' />
        <div>
          <MyFloatingPanel
            backgroundColor
            maxHeight={window.innerHeight - (getHeader() ? 80 : 130)}
            backgroundDom={backgroundDom()}
          >
            <Tabs
              activeKey={key}
              style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 999 }}
              onChange={(key) => {
                setKey(key);
              }}
            >
              <Tabs.Tab title='入库明细' key='detail' />
              <Tabs.Tab title='入库记录' key='record' />
              <Tabs.Tab title='动态日志' key='log' />
            </Tabs>
            <div style={{ backgroundColor: '#eee' }}>
              {type()}
            </div>
          </MyFloatingPanel>
        </div>


        {loading && <MyLoading />}

      </div>
    </MyBottom>

  </>;
};

export default Detail;
