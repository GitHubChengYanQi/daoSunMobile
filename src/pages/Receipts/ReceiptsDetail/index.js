import { useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { MyLoading } from '../../components/MyLoading';
import MyBottom from '../../components/MyBottom';
import Process from '../../Work/PurchaseAsk/components/Process';
import { InstockDetailBottom } from '../components/Instock';
import QualityTask from '../components/QualityTask';
import PurchaseAsk from '../components/PurchaseAsk';
import InstockError from '../components/InstockError';
import Detail from '../../Work/Instock/Detail';
import Comments from '../components/Comments';
import { ReceiptsEnums } from '../index';
import { useRequest } from '../../../util/Request';

const getTaskIdApi = { url: '/activitiProcessTask/getTaskIdByFromId', method: 'GET' };

const ReceiptsDetail = () => {

  const location = useLocation();

  const query = location.query;

  const [detail, setDetail] = useState({});

  const [currentNode, setCurrentNode] = useState([]);

  const [moduleObject, setModuleObject] = useState({});

  const actionRef = useRef();

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
          //当前节点
          const node = getCurrentNode(res.stepsResult);
          const currentNode = Array.isArray(node) ? node : [node];
          setCurrentNode(currentNode);
        }
      },
    },
  );

  const { loading: getTaskIdLoading, run: getTaskIdRun } = useRequest(getTaskIdApi, { manual: true });

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
    }
  };

  useEffect(() => {
    getTaskId();
  }, [query.id, query.formId, query.type]);

  const module = (value) => {
    switch (value) {
      case 'quality_task':
        return <QualityTask detail={detail.object} />;
      case 'purchase':
      case 'purchaseAsk':
        return <PurchaseAsk detail={detail.object} />;
      case ReceiptsEnums.instockError:
        return <InstockError id={detail.formId} />;
      case ReceiptsEnums.instockOrder:
        return <Detail
          id={detail.formId}
          moduleObject={moduleObject}
          setModuleObject={setModuleObject}
          ref={actionRef}
          currentNode={currentNode}
          processRefresh={refresh}
        />;
      default:
        break;
    }
  };

  const createModuleButtom = (left) => {
    const type = detail.type;
    switch (type) {
      case ReceiptsEnums.instockOrder:
        return <InstockDetailBottom
          left={left}
          moduleObject={moduleObject}
          id={detail.processTaskId}
          detail={detail}
          refresh={refresh}
          currentNode={currentNode}
          actionRef={actionRef}
        />;
      case 'purchaseAsk':
        return <></>;
      default:
        return <>???</>;
    }
  };

  if (getTaskIdLoading || detailLoading) {
    return <MyLoading />;
  }

  return <>
    <MyBottom
      leftActuions={createModuleButtom(true)}
      buttons={createModuleButtom()}
    >
      {module(detail.type)}
      <Process auditData={detail.stepsResult} createName={detail.createName} card />
      <Comments detail={detail} id={detail.processTaskId} refresh={refresh} />
    </MyBottom>
  </>;
};

export default ReceiptsDetail;
