import React, { useEffect } from 'react';
import { useRequest } from '../../../../../util/Request';
import { Space, Steps } from 'antd-mobile';
import { Avatar } from 'antd';
import Icon from '../../../../components/Icon';
import { AuditOutlined } from '@ant-design/icons';
import { Skeleton } from 'weui-react-v2';
import MyEmpty from '../../../../components/MyEmpty';
import style from './index.css';

const Process = (
  {
    type,
    createName,
    auditData,
  }) => {

  console.log(auditData);

  const { loading, data, run } = useRequest({
    url: '/activitiSteps/getStepResultByType',
    method: 'GET',
  }, {
    manual: true,
  });

  useEffect(() => {
    if (type) {
      run({
        params: {
          type,
        },
      });
    }
  }, []);

  const status = (step, stepStatus) => {
    const fontSize = 24;
    switch (step.auditType) {
      case 'start':
        return <Icon type='icon-caigou_faqiren' style={{ fontSize }} />;
      case 'send':
        return <Icon type='icon-caigou_chaosong' style={{ fontSize }} />;
      case 'route':
        return <AuditOutlined style={{ fontSize }} />;
      case 'process':
        switch (step.auditRule.type) {
          case 'audit':
            switch (step.logResult.status) {
              case -1:
                switch (stepStatus) {
                  case 'process':
                    return <Icon type='icon-shenhe' style={{ fontSize }} />;
                  case 'wait':
                    return <Icon type='icon-caigou_weishenpi1' style={{ fontSize }} />;
                  default:
                    return;
                }
              case 0:
                return <Icon type='icon-caigou_shenpibutongguo1' style={{ fontSize }} />;
              case 1:
                return <Icon type='icon-caigou_shenpitongguo1' style={{ fontSize }} />;
              default:
                return <Icon type='icon-caigou_weishenpi1' style={{ fontSize }} />;
            }
          default:
            return <Icon type='icon-caigou_dongzuo' style={{ fontSize }} />;
        }
      default:
        break;
    }
  };

  const rules = (rule) => {
    const users = [];
    if (rule && rule.rules) {
      rule.rules.map((items) => {
        switch (items.type) {
          case 'AppointUsers':
            items.appointUsers && items.appointUsers.map((itemuser) => {
              return users.push(itemuser.title);
            });
            break;
          case 'DeptPositions':
            items.deptPositions && items.deptPositions.map((itemdept) => {
              return users.push(`${itemdept.title}(${itemdept.positions && itemdept.positions.map((items) => {
                return items.label;
              })})`);
            });
            break;
          case 'AllPeople':
            users.push('所有人');
            break;
          default:
            break;
        }
        return null;
      });
      return <Space direction='vertical' wrap>
        {
          users.map((items, index) => {
            return <Space align='center' key={index}>
              <Avatar
                style={{ fontSize: 14 }}
                size={20}
                shape='square'
                key={index}
              >{items.substring(0, 1)}</Avatar>
              {items}
            </Space>;
          })
        }
      </Space>;
    } else
      return null;
  };

  const processType = (value) => {
    switch (value) {
      case 'quality_dispatch':
        return <>指派任务</>;
      case 'quality_perform':
        return <>执行任务</>;
      case 'quality_complete':
        return <>完成任务</>;
      case 'purchase_complete':
        return <>采购完成</>;
      default:
        break;
    }
  };

  const steps = (step, next) => {
    const minHeight = 60;
    let stepStatus = 'wait';
    switch (step.logResult && step.logResult.status) {
      case -1:
        if (next)
          stepStatus = 'process';
        else
          stepStatus = 'wait';
        break;
      case 0:
        stepStatus = 'error';
        break;
      case 1:
        stepStatus = 'process';
        break;
      default:
        break;
    }
    switch (step.auditType) {
      case 'start':
        return <div>
          <Steps.Step
            style={{ minHeight }}
            status={stepStatus}
            description={createName ? <Space align='center'>
              <Avatar
                size={20}
                shape='square'
              >{createName.substring(0, 1)}</Avatar>
              {createName}
            </Space> : rules(step.auditRule)}
            icon={status(step)} />
          {steps(step.childNode, step.logResult && step.logResult.status === 1)}
        </div>;
      case 'route':
        return <div>
          <Steps.Step
            style={{ minHeight }}
            status={stepStatus}
            description={
              <div style={{ maxWidth: '100vw', overflowX: 'auto' }}>
                <Space>
                  {step.conditionNodeList.map((items, index) => {
                    return allStep(items.childNode, next, index);
                  })}
                </Space>
              </div>
            }
            icon={status(step)} />
          {steps(step.childNode, step.logResult && step.logResult.status === 1)}
        </div>;
      case 'send':
      case 'process':
        return <div>
          <Steps.Step
            style={{ minHeight }}
            status={stepStatus}
            title={processType(step.auditRule.type)}
            description={rules(step.auditRule)}
            icon={status(step, stepStatus)} />
          {steps(step.childNode, step.logResult && step.logResult.status === 1)}
        </div>;
      default:
        break;
    }
  };

  const allStep = (audit, next, index) => {
    return <Steps key={index} direction='vertical' className={style.step}>
      {steps(audit, next)}
    </Steps>;
  };

  if (loading) {
    return <Skeleton loading={loading} />;
  }

  if (!(auditData || data)) {
    return <MyEmpty description='暂无审批' />;
  }


  return <>
    {allStep(auditData || data, true, 0)}
  </>;

};

export default Process;