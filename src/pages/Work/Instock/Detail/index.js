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
import { history } from 'umi';
import InstockActions from './components/InstockActions';
import { batchBind } from '../../../Scan/InStock/components/Url';
import ListByInstockOrder from './components/ListByInstockOrder';
import MyEllipsis from '../../../components/MyEllipsis';
import { Avatar } from 'antd';
import { DownFill } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';

const Detail = ({ process, id, ...props }) => {

  const params = props.location ? props.location.query : {};

  const instockId = id || params.id;

  const [skus, setSkus] = useState([]);

  // 0：新建 49：审批中 50：拒绝 98：入库中 99：入库完成
  const [status, setStatus] = useState(0);

  const [details, setDetails] = useState([]);

  const [positions, setPositions] = useState({});

  const orderStatus = () => {
    switch (status) {
      case -1:
        return {
          buttonText: '已拒绝',
          buttonDisabled: true,
          text: '已拒绝',
        };
      case 0:
        return {
          buttonText: '审批中',
          buttonDisabled: true,
          text: '审批中',
        };
      case 1:
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

  const module = (value) => {
    switch (value) {
      case 'procurementOrder':
        return '采购单';
      default:
        return '请选择';
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
          stockNumber: skus[0].stockNumber,
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
            ...skuItem,
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
            ...item,
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
            const number = item.realNumber;
            return detail[0] || {
              skuId: item.skuId,
              skuResult: { ...item.skuResult, spuResult: item.spuResult },
              number,
              newNumber: number,
              instockListId: item.instockListId,
              positions: [{
                ...positions,
                instockNumber: number,
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

  const logResult = data
    &&
    data.logResults
    &&
    data.logResults[data.logResults.length - 1] || {};

  const logUser = logResult.createUserResult || {};

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

  const [state, { toggle }] = useBoolean();

  useEffect(() => {
    if (instockId) {
      run({ data: { instockOrderId: instockId } });
    }
  }, []);


  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const options = getChildren(data.bindTreeView, data.instockListResults, true) || [];

  const source = (value) => {
    switch (value) {
      case 'procurementOrder':
        return '采购单';
      default:
        return '请选择';
    }
  };

  const backgroundDom = () => {

    return <div style={{ backgroundColor: '#f9f9f9', paddingBottom: 100 }}>
      <Card
        title={<div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar shape='square' size={56}>入</Avatar>
          <div style={{ marginLeft: 16 }}>
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
          </div>
        </div>}
        bodyStyle={{ padding: 0 }}
        className={styles.mainDiv}
        style={{ backgroundColor: '#f9f9f9', border: 'solid 1px rgb(206 200 200)', paddingBottom: 8 }}
        extra={<div style={{ paddingRight: 16 }} onClick={() => {
          toggle();
        }}><DownFill /></div>}
      >
        {!state && <Card
          style={{ backgroundColor: '#f9f9f9' }}
          title={<div>基本信息</div>}
          bodyStyle={{ padding: '0 16px' }}
          headerStyle={{ border: 'none' }}
        >
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
              <Label>库管人员：</Label>{data.stockUserResult && data.stockUserResult.name}
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1 }}>
                <Space direction='vertical'>
                  <Label>入库物料</Label>{data.enoughNumber}
                </Space>
              </div>
              <div style={{ flexGrow: 1, color: 'green' }}>
                <Space direction='vertical'>
                  已入库{data.notNumber}
                </Space>
              </div>
              <div style={{ flexGrow: 1, color: 'red' }}>
                <Space direction='vertical'>
                  未入库{data.realNumber}
                </Space>
              </div>
            </div>
            <Divider style={{ margin: 0 }} />
            <div>
              <Label>申请人：</Label>{data.createUserResult && data.createUserResult.name}
            </div>
            <div>
              <Label>申请时间：</Label>{data.createTime}
            </div>
            <div>
              <Label>更新人员：</Label>{data.updateUserResult && data.updateUserResult.name}
            </div>
            <div>
              <Label>更新时间：</Label>{data.updateTime}
            </div>
            <div>
              <Label>关联任务：</Label>{source(data.source)}
            </div>
            <div>
              <Label>备注说明：</Label>{data.remake}
            </div>
          </Space>
        </Card>}
      </Card>
      <Card
        title={<div>入库信息</div>}
        style={{ backgroundColor: '#f9f9f9' }}
        bodyStyle={{ padding: 8, backgroundColor: '#fff', border: 'solid 1px rgb(206 200 200)', borderRadius: 10 }}
        headerStyle={{ border: 'none' }}
      >
        {logUser.name ? <Space style={{ width: '100%' }} direction='vertical'>
            <div style={{ display: 'flex' }}>
              <Label>库管人员：</Label>
              <MyEllipsis width='60%'>{logUser.name} / {logUser.roleName} / {logUser.deptName}</MyEllipsis>
            </div>
            <div>
              <Label>入库时间：</Label>{logResult.instockTime}
            </div>
            <div>
              <Label>库管意见：</Label>{logResult.remark}
            </div>
          </Space>
          :
          <div>暂无</div>
        }
      </Card>
      {process}
    </div>;
  };

  const type = () => {
    switch (key) {
      case 'detail':
        return <InstockDetails
          CodeLoading={CodeLoading}
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
        return <ListByInstockOrder id={instockId} />;
      case 'log':
        return <MyEmpty />;
      default:
        return <MyEmpty />;
    }
  };

  return <>
    <MyBottom
      leftActuions={status === 1 && <div>
        <div>计划 / 实际</div>
        <div>{number} / <span style={{ color: number === newNumber ? 'blue' : 'red' }}>{newNumber}</span></div>
      </div>}
      noBottom={status === 0}
      buttons={<Space>
        {status !== 99 && <Button
          color='primary'
          fill='outline'
          onClick={() => {
            history.goBack();
          }}
        >暂停入库</Button>}
        <InstockActions
          refresh={refresh}
          setDetails={setDetails}
          status={status}
          details={details}
          orderStatus={orderStatus}
          id={instockId}
          CodeRun={CodeRun}
          CodeLoading={CodeLoading}
        />
      </Space>}
    >
      <div>
        {!id && <MyNavBar title='入库单详情' />}
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
              <Tabs.Tab title={<div>入库明细</div>} key='detail' />
              <Tabs.Tab title={<div>入库记录</div>} key='record' />
              <Tabs.Tab title={<div>动态日志</div>} key='log' />
            </Tabs>
            <div style={{ backgroundColor: '#eee' }}>
              {type()}
            </div>
          </MyFloatingPanel>
        </div>
      </div>
    </MyBottom>

  </>;
};

export default Detail;
