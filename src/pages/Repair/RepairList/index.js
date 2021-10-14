import React, {useState } from 'react';
import { useRequest } from '../../../util/Request';
import {
  CheckCircleFill,
  ClockCircleFill,
} from 'antd-mobile-icons';
import { Steps } from 'antd-mobile';
import EngineerRepair from '../EngineerRepair';
import { Skeleton } from 'weui-react-v2';
import { Affix } from 'antd';
import Engineer from '../Engineer';
import { useDebounceEffect } from 'ahooks';
import EngineerImp from '../EngineerImp';
import CompletePage from '../CompletePage';
import EvaluationPage from '../EvaluationPage';

const { Step } = Steps;


const RepairList = (props) => {

  const repairId = props.location.query.id;
  const select = props.location.query.select;

  const [state, setState] = useState();

  const { loading, data: user } = useRequest({ url: '/rest/system/currentUserInfo', method: 'POST' });

  const [repairList, setRepairList] = useState(null);

  const { run: runGetRepairById } = useRequest({
    url: '/api/getRepairById',
    method: 'POST',
  }, {
    manual: true,
  });

  useDebounceEffect(() => {
    runGetRepairById({
      data: {
        repairId: repairId,
      },
    }).then((res) => {
      setRepairList(res);
      setState(res.progress);
    });
  }, [props], {
    wait: 0,
  });


  const view = () => {
    switch (state) {
      case 0:
        return (<EngineerRepair repairId={repairId} user={user} repairList={repairList} />);
      case 1:
        return (<Engineer repairId={repairId} select={select} repairList={repairList} />);
      case 2:
        return (<EngineerImp repairId={repairId} select={select} repairList={repairList} />);
      case 3:
      return (<CompletePage repairId={repairId} select={select} repairList={repairList} />);
      case 4:
      return (<EvaluationPage repairId={repairId} repairList={repairList} />);
      case 5:
      return (<EvaluationPage repairId={repairId} repairList={repairList} state />);
      default:
        break;
    }
  };


  return (
    <div style={{ backgroundColor: '#fff' }}>
      <Affix offsetTop={0}>
        <div style={{ backgroundColor: '#fff' }}>
          <Steps current={state}>
            <Step
              title='新报修'
              icon={state === 0 ? <ClockCircleFill /> : <CheckCircleFill />}
            />
            <Step
              title='已派单'
              icon={state === 1 ? <ClockCircleFill /> : <CheckCircleFill />}
            />
            <Step
              title='实施中'
              icon={state === 2 ? <ClockCircleFill /> : <CheckCircleFill />}
            />
            <Step
              title='完成'
              icon={state === 3 ? <ClockCircleFill /> : <CheckCircleFill />}
            />
            <Step
              title='待评价'
              icon={state === 4 ? <ClockCircleFill /> : <CheckCircleFill />}
            />
          </Steps>
        </div>
      </Affix>
      {loading ? <Skeleton loading /> : view()}
    </div>
  );
};

export default RepairList;
