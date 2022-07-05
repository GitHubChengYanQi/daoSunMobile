import { useHistory, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { MyLoading } from '../../components/MyLoading';
import { useRequest } from '../../../util/Request';
import MyNavBar from '../../components/MyNavBar';
import Header from './components/Header';
import topStyle from '../../global.less';
import { ToolUtil } from '../../components/ToolUtil';
import { Dialog, Tabs } from 'antd-mobile';
import MyEmpty from '../../components/MyEmpty';
import Bottom from './components/Bottom';
import style from './index.less';
import ReceiptData from './components/ReceiptData';
import { ReceiptsEnums } from '../index';
import InStockLog from './components/Log/InStockLog';
import OutStockLog from './components/Log/OutStockLog';
import SkuError from './components/ReceiptData/components/InstockError/components/SkuError';
import Dynamic from './components/Dynamic';

const getTaskIdApi = { url: '/activitiProcessTask/getTaskIdByFromId', method: 'GET' };

const ReceiptsDetail = () => {

  const location = useLocation();

  const history = useHistory();

  const query = location.query;

  const [detail, setDetail] = useState();

  const [hidden, setHidden] = useState(false);

  const [currentNode, setCurrentNode] = useState([]);

  const [key, setKey] = useState('data');

  const [type, setType] = useState();

  const error = () => {
    Dialog.alert({
      content: '获取审批信息失败！',
      closeOnMaskClick: true,
      confirmText: '确认',
      onConfirm: () => {
        if (history.length <= 2) {
          history.push('/');
        } else {
          history.goBack();
        }
      },
    });
  };

  // 获取当前节点
  const getCurrentNode = (data) => {
    if (!data) {
      return {};
    }
    if (data.logResult && data.logResult.status === -1) {
      if (data.stepType === 'route') {
        return data.conditionNodeList.map((item) => {
          return getCurrentNode(item.childNode);
        });
      }
      return data;
    }
    return getCurrentNode(data.childNode);
  };

  // 审批详情接口
  const { loading: detailLoading, run, refresh } = useRequest(
    {
      url: '/audit/detail',
      method: 'GET',
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res) {
          // 详细数据
          setDetail(res);
          //类型
          setType(res.type);
          //当前节点
          const node = getCurrentNode(res.stepsResult);
          const currentNode = Array.isArray(node) ? node : [node];
          setCurrentNode(currentNode);
        } else {
          error();
        }
      },
      onError: () => {
        error();
      },
    },
  );

  const { loading: getTaskIdLoading, run: getTaskIdRun } = useRequest(getTaskIdApi, {
    manual: true,
    onError: () => {
      error();
    },
  });

  const getTaskId = async () => {
    let taskId;
    if (query.id) {
      taskId = query.id;
    } else if (query.formId && query.type) {
      taskId = await getTaskIdRun({ params: { formId: query.formId, type: query.type } });
    }
    if (taskId) {
      run({
        params: {
          taskId: taskId,
        },
      });
    } else {
      error();
    }
  };

  useEffect(() => {
    getTaskId();
  }, [query.id, query.formId, query.type]);

  const content = () => {
    switch (key) {
      case 'data':
        return <ReceiptData
          permissions={detail.permissions}
          data={detail}
          currentNode={currentNode}
          refresh={refresh}
          loading={detailLoading}
          addComments={setHidden}
        />;
      case 'dynamic':
        return <Dynamic data={detail} refresh={refresh} />;
      case 'inStockLog':
        return <InStockLog instockOrderId={ToolUtil.isObject(detail.receipts).instockOrderId} />;
      case 'outStockLog':
        return <OutStockLog outstockOrderId={ToolUtil.isObject(detail.receipts).pickListsId} />;
      default:
        return <MyEmpty />;
    }
  };

  const receiptsTabs = () => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        return {
          title: '入库记录',
          key: 'inStockLog',
        };
      case ReceiptsEnums.outstockOrder:
        return {
          title: '出库记录',
          key: 'outStockLog',
        };
      default:
        return {};
    }
  };

  if (!detail) {
    return <MyLoading skeleton />;
  }

  switch (detail.type) {
    case 'ErrorForWard':
      return <SkuError anomalyId={detail.formId} forward />;
    default:
      return <div className={style.receipts}>
        <div className={style.content}>
          <MyNavBar title='审批详情' />
          <Header data={detail} />
          <div className={topStyle.top} style={{ top: ToolUtil.isQiyeWeixin() ? 0 : 45 }}>
            <Tabs activeKey={key} onChange={(key) => {
              setKey(key);
              setHidden(key !== 'data');
            }} className={topStyle.tab}>
              <Tabs.Tab title='基本信息' key='data' />
              {receiptsTabs().key && <Tabs.Tab title={receiptsTabs().title} key={receiptsTabs().key} />}
              <Tabs.Tab title='动态日志' key='dynamic' />
              <Tabs.Tab title='关联单据' key='relation' />
            </Tabs>
          </div>
          {content()}
        </div>

        {!hidden && <Bottom currentNode={currentNode} detail={detail} refresh={refresh} />}

        {(getTaskIdLoading || detailLoading) && <MyLoading />}
      </div>;
  }
};

export default ReceiptsDetail;
