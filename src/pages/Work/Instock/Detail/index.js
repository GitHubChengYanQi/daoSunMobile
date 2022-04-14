import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../util/Request';
import { checkNumberTrue, instockOrderDetail } from '../../ProcurementOrder/Url';
import MyNavBar from '../../../components/MyNavBar';
import MyFloatingPanel from '../../../components/MyFloatingPanel';
import { getHeader } from '../../../components/GetHeader';
import { Button, Card, Dialog, Divider, Space, Tabs, Toast } from 'antd-mobile';
import { MyLoading } from '../../../components/MyLoading';
import Label from '../../../components/Label';
import styles from '../../Production/index.css';
import MyBottom from '../../../components/MyBottom';
import MyEmpty from '../../../components/MyEmpty';
import InstockDetails from './components/InstockDetails';
import { history } from 'umi';
import InstockActions from './components/InstockActions';
import { batchBind } from '../../../Scan/InStock/components/Url';
import ListByInstockOrder from './components/ListByInstockOrder';

const Detail = (props) => {

  const params = props.location.query;

  const [skus, setSkus] = useState([]);

  // 0：新建 49：审批中 50：拒绝 98：入库中 99：入库完成
  const [status, setStatus] = useState(0);

  const [details, setDetails] = useState([]);

  const [positions, setPositions] = useState({});

  const orderStatus = () => {
    switch (status) {
      case 0:
        return {
          buttonText: '提交核实',
          buttonDisabled: false,
          text: '待入库',
        };
      case 49:
        return {
          buttonText: '异常审核中',
          buttonDisabled: true,
          text: '异常审批中',
        };
      case 50:
        return {
          buttonText: '已拒绝',
          buttonDisabled: true,
          text: '异常审批拒绝',
        };
      case 98:
        return {
          buttonText: '批量入库',
          buttonDisabled: false,
          text: '进行中',
        };
      case 99:
        return {
          buttonText: '入库完成',
          buttonDisabled: true,
          text: '入库完成',
        };
      default:
        return {};
    }
  };

  const getPosition = (data, skuId, position = {}) => {
    if (!Array.isArray(data)) {
      return position;
    }

    data.map((item) => {
      const skus = item.skuResults.filter(item => item.skuId === skuId);
      if (skus.length > 0) {
        return position = getPosition(item.storehousePositionsResults, skuId, {
          positionId: item.storehousePositionsId,
          positionName: item.name,
          skockNumber: skus[0].skockNumber,
        });
      }
      return null;
    });

    return position;
  };

  const getChildren = (data, details = [], top, positionId = []) => {

    if (!Array.isArray(data)) {
      return null;
    }

    const skuResults = [];
    const option = [];

    data.map((item) => {
      if (positionId.includes(item.storehousePositionsId)) {
        return null;
      }
      positionId.push(item.storehousePositionsId);
      let detailSkus = [];
      item.skuIds && item.skuIds.map((skuId) => {
        const array = details.filter(item => skuId === item.skuId);
        return array.map((skuItem) => {
          const sku = {
            skuId: skuItem.skuId,
            instockListId: skuItem.instockListId,
            number: skuItem.realNumber,
            skuResult: skuItem.skuResult,
            spuResult: skuItem.spuResult,
            ...getPosition(data, skuItem.skuId),
          };
          if (!skuResults.map(item => item.instockListId).includes(skuItem.instockListId)) {
            skuResults.push(sku);
            detailSkus.push(sku);
          }
          return null;
        });
      });
      return option.push({
        title: `${item.name} (${detailSkus.length})`,
        key: item.storehousePositionsId,
        skus: detailSkus,
        children: !top && getChildren(item.storehousePositionsResults, details),
      });
    });

    if (top) {

      details.map((item) => {
        if (!skuResults.map(item => item.instockListId).includes(item.instockListId)) {
          const sku = {
            skuId: item.skuId,
            instockListId: item.instockListId,
            number: item.realNumber,
            skuResult: item.skuResult,
            spuResult: item.spuResult,
          };
          return skuResults.push(sku);
        }
        return null;
      });

      return [{
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
      setSkus(extend.skus);
    }
  };

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

  let number = 0;
  let newNumber = 0;

  const { loading, data, run, refresh } = useRequest(instockOrderDetail, {
    manual: true,
    onSuccess: (res) => {
      setStatus(res.state);
      if (Array.isArray(res && res.instockListResults)) {
        setDetails(res.instockListResults.map((item) => {
            const positions = getPosition(res && res.bindTreeView, item.skuId);
            const detail = details.filter(skuItem => skuItem.instockListId === item.instockListId);
            const number = res.state === 0 ? item.number : item.realNumber;
            return detail[0] || {
              skuId: item.skuId,
              skuResult: { ...item.skuResult, spuResult: item.spuResult },
              number: number,
              newNumber: number,
              instockListId: item.instockListId,
              positions: [{
                ...positions,
                instockNumber: number,
                stockNumber: item.stockDetails && item.stockDetails.number,
              }],
            };
          }),
        );
      }
      const allSku = getChildren(res && res.bindTreeView, res && res.instockListResults, true) || [];
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

  const { loading: CodeLoading, run: CodeRun } = useRequest(
    batchBind,
    {
      manual: true,
    },
  );

  details.map((item) => {
    number += (item.number || 0);
    newNumber += (item.newNumber || 0);
    return null;
  });

  const [key, setKey] = useState('detail');

  useEffect(() => {
    if (params.id) {
      run({ data: { instockOrderId: params.id } });
    }
  }, []);


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const options = getChildren(data.bindTreeView, data.instockListResults, true) || [];

  const backgroundDom = () => {

    return <Card
      title={<div>
        <div>
          入库单 / {data.coding}
        </div>
        <Space>
          {data.urgent ?
            <Button color='danger' style={{ '--border-radius': '50px', padding: '4px 24px' }}>加急</Button> : null}
          <Button
            color='default'
            fill='outline'
            style={{
              '--border-radius': '50px',
              padding: '4px 12px',
              '--background-color': '#fff7e6',
              '--text-color': '#fca916',
              '--border-width': '0px',
            }}>{orderStatus().text}</Button>
        </Space>
      </div>}
      bodyStyle={{ padding: 0 }}
      className={styles.mainDiv}
      style={{ backgroundColor: '#fff' }}>
      <Card title='基本信息' bodyStyle={{ padding: '0 16px' }} headerStyle={{ border: 'none' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <div>
            <Label>入库主题：</Label>{data.theme}
          </div>
          <div>
            <Label>入库类型：</Label>{data.type}
          </div>
          <div>
            <Label>送料人员：</Label>{data.userResult && data.userResult.name}
          </div>
          <div>
            <Label>送料时间：</Label>{data.registerTime}
          </div>
          <div>
            <Label>库管人员：</Label>{}
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
      <Card title='入库信息' bodyStyle={{ padding: '0 16px' }} headerStyle={{ border: 'none' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <div>
            <Label>库管人员：</Label>
          </div>
          <div>
            <Label>入库时间：</Label>
          </div>
          <div>
            <Label>库管意见：</Label>
          </div>
        </Space>
      </Card>
    </Card>;
  };

  const type = () => {
    switch (key) {
      case 'detail':
        return <InstockDetails
          CodeRun={CodeRun}
          status={status}
          details={details}
          setDetails={setDetails}
          getSkus={getSkus}
          positions={positions}
          setPositions={setPositions}
          skus={skus}
          setSkus={setSkus}
          options={options}
          refresh={refresh}
        />;
      case 'record':
        return <ListByInstockOrder id={params.id} />;
      case 'log':
        return <MyEmpty />;
      default:
        return <MyEmpty />;
    }
  };

  return <>
    <MyBottom
      leftActuions={status === 0 && <div>
        <div>计划 / 实际</div>
        <div>{number} / <span style={{ color: number === newNumber ? 'blue' : 'red' }}>{newNumber}</span></div>
      </div>}
      buttons={<Space>
        <Button
          color='primary'
          fill='outline'
          onClick={() => {
            history.goBack();
          }}
        >暂停入库</Button>
        <InstockActions
          refresh={refresh}
          setDetails={setDetails}
          status={status}
          details={details}
          orderStatus={orderStatus}
          id={params.id}
          CodeRun={CodeRun}
        />
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
      </div>
    </MyBottom>

    {CodeLoading && <MyLoading />}

  </>;
};

export default Detail;
