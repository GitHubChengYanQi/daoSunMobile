import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Space } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import QualityTask from './components/QualityTask';
import PurchaseAsk from './components/PurchaseAsk';
import Process from '../PurchaseAsk/components/Process';
import InstockError from './components/InstockError';
import Audit from './components/Audit';
import MyEmpty from '../../components/MyEmpty';
import { MyLoading } from '../../components/MyLoading';
import CreateInStock from '../Instock/CreateInStock';
import AskAdd from '../PurchaseAsk/AskAdd';
import Detail from '../Instock/Detail';
import MyBottom from '../../components/MyBottom';

const Workflow = (props) => {

  const query = props.location.query;

  const [detail, setDetail] = useState({});

  const [audit, setAudit] = useState([]);

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
          // 所有配置
          setAudit(res.stepsResult);
          // 详细数据
          setDetail(res);
        }

      },
    },
  );

  useEffect(() => {
    setDetail(null);
    if (query.id) {
      run({
        params: {
          taskId: query.id,
        },
      });
    }
  }, []);

  if (detailLoading) {
    return <MyLoading />;
  }

  const createModule = (value) => {
    switch (value) {
      case 'createInstock':
        return <>
          <CreateInStock
            source={query.source}
            sourceId={query.sourceId}
            paramsSkus={query.skus}
            ref={createRef}
          />
        </>;
      case 'purchaseAsk':
        return <>
          <AskAdd />
        </>;
      default:
        break;
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
        return <Detail id={detail.formId} process={
          <div>
            <Process auditData={audit} createName={detail.createName} />
            <Audit detail={detail} id={query.id} refresh={refresh} />
          </div>
        } />;
      default:
        break;
    }
  };

  const createModuleButtom = (left) => {
    switch (query.type) {
      case 'createInstock':
        const skus = moduleObject.skus;
        if (left) {
          return <div>合计：{skus.length}</div>;
        }
        return <Space>
          <Button>扫码添加物料</Button>
          <Button
            disabled={skus.length === 0 || skus.filter(item => item.number > 0).length !== skus.length}
            color='primary'
            onClick={() => {
              createRef.current.submit();
            }}>提交申请</Button>
        </Space>;
      case 'purchaseAsk':
        return <></>;
      default:
        break;
    }
  };


  if (query.type) {
    return <>
      {/*<MyBottom*/}
      {/*  leftActuions={createModuleLeftActions()}*/}
      {/*  buttons={<Space>*/}
      {/*    <Button>扫码添加物料</Button>*/}
      {/*    <Button*/}
      {/*      disabled={skus.length === 0 || skus.filter(item => item.number > 0).length !== skus.length}*/}
      {/*      color='primary'*/}
      {/*      onClick={() => {*/}
      {/*        createRef.current.submit();*/}
      {/*      }}>提交申请</Button>*/}
      {/*  </Space>}*/}
      {/*>*/}
      {/*  {createModule(query.type)}*/}
      {/*  <Process type='createInstock' card />*/}
      {/*</MyBottom>*/}
    </>;
  }

  if (detail) {
    return <div style={{
      backgroundColor: '#fff',
    }}>
      <Card
        title={<div>{detail.taskName}</div>}
        bodyStyle={{ padding: 0 }}
      >
        {module(detail && detail.type)}
      </Card>
    </div>;
  } else {
    return <MyEmpty />;
  }


};

export default Workflow;
