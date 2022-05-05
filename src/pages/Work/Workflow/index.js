import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../../util/Request';
import QualityTask from './components/QualityTask';
import PurchaseAsk from './components/PurchaseAsk';
import Process from '../PurchaseAsk/components/Process';
import InstockError from './components/InstockError';
import MyEmpty from '../../components/MyEmpty';
import { MyLoading } from '../../components/MyLoading';
import AskAdd from '../PurchaseAsk/AskAdd';
import Detail from '../Instock/Detail';
import MyBottom from '../../components/MyBottom';
import { CreateInstock, CreateInstockBottom } from './components/Instock';
import Comments from './components/Comments';

const getTaskIdApi = { url: '/activitiProcessTask/getTaskIdByFromId', method: 'GET' };

const Workflow = (props) => {

  const query = props.location.query;

  const isCreate = !query.formId && !query.id && query.type;

  const [detail, setDetail] = useState({});

  const [moduleObject, setModuleObject] = useState({});

  const createRef = useRef();

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
        }
      },
    },
  );

  const { run: getTaskIdRun } = useRequest(getTaskIdApi, { manual: true });

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
  }, []);

  const createModule = (value) => {
    switch (value) {
      case 'createInstock':
        return <CreateInstock
          setModuleObject={setModuleObject}
          query={query}
          createRef={createRef}
        />;
      case 'purchaseAsk':
        return <>
          <AskAdd />
        </>;
      default:
        return <MyEmpty />;
    }
  };

  const module = (value) => {
    switch (value) {
      case 'quality_task':
        return <QualityTask detail={detail.object} />;
      case 'purchase':
      case 'purchaseAsk':
        return <PurchaseAsk detail={detail.object} />;
      case 'instockError':
        return <InstockError id={detail.formId} />;
      case 'createInstock':
        return <Detail id={detail.formId} />;
      default:
        break;
    }
  };

  const createModuleButtom = (left) => {
    switch (query.type) {
      case 'createInstock':
        return <CreateInstockBottom
          createRef={createRef}
          left={left}
          moduleObject={moduleObject}
          isCreate={isCreate}
          id={detail.processTaskId}
          detail={detail}
          refresh={refresh}
        />;
      case 'purchaseAsk':
        return <></>;
      default:
        break;
    }
  };

  return <>
    <MyBottom
      leftActuions={createModuleButtom(true)}
      buttons={createModuleButtom()}
    >
      {isCreate ? createModule(query.type) : module(query.type)}
      <Process type={query.type} auditData={detail.stepsResult} createName={detail.createName} card />
      {!isCreate && <Comments detail={detail} id={detail.processTaskId} refresh={refresh} />}
    </MyBottom>

    {detailLoading && <MyLoading />}
  </>;


};

export default Workflow;
