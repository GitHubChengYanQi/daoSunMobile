import { useHistory, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { MyLoading } from '../../components/MyLoading';
import { useRequest } from '../../../util/Request';
import MyNavBar from '../../components/MyNavBar';
import Header from './components/Header';
import topStyle from '../../global.less';
import { ToolUtil } from '../../components/ToolUtil';
import { Tabs } from 'antd-mobile';
import MyEmpty from '../../components/MyEmpty';
import Bottom from './components/Bottom';
import style from './index.less';
import ReceiptData from './components/ReceiptData';
import { ReceiptsEnums } from '../index';
import InStockLog from './components/Log/InStockLog';
import OutStockLog from './components/Log/OutStockLog';
import SkuError from './components/ReceiptData/components/InstockError/components/SkuError';
import Dynamic from './components/Dynamic';
import MyError from '../../components/MyError';
import LinkButton from '../../components/LinkButton';
import Relation from './components/Relation';
import { useBoolean } from 'ahooks';

const getTaskIdApi = { url: '/activitiProcessTask/getTaskIdByFromId', method: 'GET' };

const ReceiptsDetail = () => {

  const location = useLocation();

  const history = useHistory();

  const query = location.query;

  const [detail, setDetail] = useState();

  const [hidden, setHidden] = useState(false);

  const [success, { setTrue, setFalse }] = useBoolean();

  const [currentNode, setCurrentNode] = useState([]);

  const [key, setKey] = useState('data');

  const [type, setType] = useState();

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
          setTrue();
        } else {

        }
      },
      onError: () => {
        setFalse();
      },
    },
  );

  const { loading: getTaskIdLoading, run: getTaskIdRun } = useRequest(getTaskIdApi, {
    manual: true,
    onError: () => {

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
      setFalse();
      run({
        params: {
          taskId: taskId,
        },
      });
    } else {

    }
  };

  const loading = getTaskIdLoading || detailLoading;

  useEffect(() => {
    getTaskId();
    setDetail();
    setKey('data');
    setHidden(false);
  }, [query.id, query.formId, query.type]);

  const content = () => {
    switch (key) {
      case 'data':
        return <ReceiptData
          success={success}
          permissions={detail.permissions}
          data={detail}
          currentNode={currentNode}
          refresh={() => {
            refresh();
            setFalse();
          }}
          loading={loading}
          addComments={setHidden}
        />;
      case 'dynamic':
        return <Dynamic taskId={detail.processTaskId} />;
      case 'inStockLog':
        return <InStockLog instockOrderId={ToolUtil.isObject(detail.receipts).instockOrderId} />;
      case 'outStockLog':
        return <OutStockLog outstockOrderId={ToolUtil.isObject(detail.receipts).pickListsId} />;
      case 'relation':
        return <Relation type={type} receipts={detail.receipts} />;
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
    if (loading) {
      return <MyLoading skeleton />;
    }
    return <MyError title='获取审批信息失败' description={
      <LinkButton onClick={() => {
        history.push('/');
      }}>返回主页</LinkButton>
    } />;
  }

  switch (detail.type) {
    case ReceiptsEnums.errorForWard:
      return <>
        <MyNavBar title='异常处理' />
        <SkuError anomalyId={detail.formId} forward permissions />
      </>;
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

        {
          !hidden
          &&
          !loading
          &&
          <Bottom loading={loading} currentNode={currentNode} detail={detail} refresh={() => {
            setFalse();
            refresh();
          }} />
        }

      </div>;
  }
};

export default ReceiptsDetail;
