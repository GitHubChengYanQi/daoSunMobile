import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, Divider, Empty, List, Loading, Space, Toast } from 'antd-mobile';
import { useRequest } from '../../../util/Request';
import { FormOutlined } from '@ant-design/icons';
import QualityTask from './components/QualityTask';
import PurchaseAsk from './components/PurchaseAsk';
import MentionsNote from '../../components/MentionsNote';
import BottomButton from '../../components/BottomButton';
import ImgUpload from '../../components/Upload/ImgUpload';
import Process from '../PurchaseAsk/components/Process';
import InstockError from './components/InstockError';
import Audit from './components/Audit';
import MyEmpty from '../../components/MyEmpty';
import { MyLoading } from '../../components/MyLoading';
import CreateInStock from '../Instock/CreateInStock';
import AskAdd from '../PurchaseAsk/AskAdd';
import Detail from '../Instock/Detail';

const Workflow = (props) => {

  const query = props.location.query;

  const [detail, setDetail] = useState({});

  const [audit, setAudit] = useState([]);

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
          <CreateInStock source={query.source} sourceId={query.sourceId} paramsSkus={query.skus} />
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

  if (query.type) {
    return <>
      {createModule(query.type)}
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
