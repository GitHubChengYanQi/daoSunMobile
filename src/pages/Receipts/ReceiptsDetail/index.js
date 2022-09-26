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
import SkuError from './components/ReceiptData/components/InstockError/components/SkuError';
import Dynamic from './components/Dynamic';
import MyError from '../../components/MyError';
import LinkButton from '../../components/LinkButton';
import Relation from './components/Relation';
import { useBoolean } from 'ahooks';
import Log from './components/Log';
import KeepAlive from '../../../components/KeepAlive';

const getTaskIdApi = { url: '/activitiProcessTask/getTaskIdByFromId', method: 'GET' };

export const ReceiptsDetailContent = () => {

  const location = useLocation();

  const history = useHistory();

  const query = location.query;

  const [detail, setDetail] = useState();

  const [hidden, setHidden] = useState(false);

  const [receiptsInfo, setReceiptsInfo] = useState({});

  const [success, { setTrue, setFalse }] = useBoolean();

  const [currentNode, setCurrentNode] = useState([]);

  const [key, setKey] = useState('data');

  const [type, setType] = useState();

  const [scrollTop, setScrollTop] = useState(0);

  // 获取当前节点
  const getCurrentNode = (data, version) => {
    if (!data) {
      return {};
    }
    const logResults = data.logResults || [];
    const currentNode = version ? logResults.filter(item => item.status === 3).length === logResults.length : data.logResult && data.logResult.status === -1;
    if (currentNode) {
      if (data.stepType === 'route') {
        return data.conditionNodeList.map((item) => {
          return getCurrentNode(item.childNode, version);
        });
      }
      return data;
    }
    return getCurrentNode(data.childNode, version);
  };

  // 审批详情接口
  const { loading: detailLoading, run, refresh } = useRequest(
    {
      url: '/audit/v1.1/detail',
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
          const node = getCurrentNode(res.stepsResult, res.version);
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
    if (!query.id && !query.formId) {
      return;
    }
    if (receiptsInfo.id === query.id && receiptsInfo.formId === query.formId) {
      return;
    }
    setReceiptsInfo({
      id: query.id,
      formId: query.formId,
    });
    getTaskId();
    setDetail();
    setKey('data');
    setHidden(false);
  }, [query.id, query.formId]);

  const content = () => {
    switch (key) {
      case 'data':
        return <ReceiptData
          actionButton={
            !hidden &&
            !loading &&
            detail.permissions
          }
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
      case 'log':
        return <Log type={type} detail={detail} />;
      case 'relation':
        return <Relation type={type} receipts={detail.receipts} taskId={detail.processTaskId} />;
      default:
        return <MyEmpty />;
    }
  };

  const receiptsType = () => {
    switch (type) {
      case ReceiptsEnums.instockOrder:
        return {
          logTitle: '入库记录',
        };
      case ReceiptsEnums.outstockOrder:
        return {
          logTitle: '出库记录',
        };
      case ReceiptsEnums.stocktaking:
        return {
          logTitle: '盘点记录',
        };
      case ReceiptsEnums.maintenance:
        return {
          logTitle: '养护记录',
        };
      case ReceiptsEnums.allocation:
        return {};
      case ReceiptsEnums.error:
        return {};
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
        <SkuError createUser={detail.createUser} anomalyId={detail.formId} forward />
      </>;
    default:
      return <div className={style.receipts} style={{
        scrollMarginTop: scrollTop,
      }}>
        <div
          className={style.content}
          id='content'
          onScroll={(event) => {
            setScrollTop(event.target.scrollTop);
          }}>
          <MyNavBar title='审批详情' />
          <Header data={detail} />
          <div className={topStyle.top} style={{ top: ToolUtil.isQiyeWeixin() ? 0 : 45 }}>
            <Tabs activeKey={key} onChange={(key) => {
              setKey(key);
              setHidden(key !== 'data');
            }} className={topStyle.tab}>
              <Tabs.Tab title='基本信息' key='data' />
              {receiptsType().logTitle && <Tabs.Tab title={receiptsType().logTitle} key='log' />}
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
          <Bottom version={detail.version} loading={loading} currentNode={currentNode} detail={detail} refresh={() => {
            setFalse();
            refresh();
          }} />
        }

      </div>;
  }
};

const ReceiptsDetail = () => {
  return <KeepAlive id='receiptsDetail' contentId='content'>
    <ReceiptsDetailContent />
  </KeepAlive>;
};

export default ReceiptsDetail;
