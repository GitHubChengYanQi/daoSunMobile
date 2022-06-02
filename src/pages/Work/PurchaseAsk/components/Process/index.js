import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { Space, Steps } from 'antd-mobile';
import { Avatar } from 'antd';
import Icon from '../../../../components/Icon';
import { AuditOutlined, CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { Skeleton } from 'weui-react-v2';
import style from './index.less';
import { ToolUtil } from '../../../../components/ToolUtil';

const Process = (
  {
    type,
    createName,
    auditData,
  }) => {

  const { loading, data, run } = useRequest({
    url: '/activitiSteps/getStepResultByType',
    method: 'GET',
  }, {
    manual: true,
  });

  const [hiddenStep, setHiddenStep] = useState([]);

  useEffect(() => {
    if (!auditData && type) {
      run({
        params: {
          type,
        },
      });
    }
  }, [type]);

  // 节点icon
  const status = (step, stepStatus) => {
    switch (step.auditType) {
      case 'start':
        return <Avatar><Icon type='icon-caigou_faqiren' /></Avatar>;
      case 'send':
        return <Avatar><Icon type='icon-caigou_chaosong' /></Avatar>;
      case 'route':
        return <AuditOutlined />;
      case 'process':
        switch (step.auditRule.type) {
          case 'audit':
            return <Avatar>审</Avatar>;
          // switch (step.logResult.status) {
          //   case -1:
          //     return <Avatar>审</Avatar>;
          //     switch (stepStatus) {
          //       case 'process':
          //         return <Icon type='icon-shenhe' />
          //       case 'wait':
          //         return <Avatar><Icon type='icon-caigou_weishenpi1' /></Avatar>;
          //       default:
          //         return;
          //     }
          //   case 0:
          //     return <Avatar><Icon type='icon-caigou_shenpibutongguo1' /></Avatar>;
          //   case 1:
          //     return <Avatar><Icon type='icon-caigou_shenpitongguo1' /></Avatar>;
          //   default:
          //     return <Avatar><Icon type='icon-caigou_weishenpi1' /></Avatar>;
          // }
          default:
            return <Icon type='icon-caigou_dongzuo' />;
        }
      default:
        break;
    }
  };

  // 节点名称 + 状态
  const nodeStatusName = (auditType, stepStatus) => {
    // 节点类型
    switch (auditType) {
      case 'start':
        // 发起节点状态
        switch (stepStatus) {
          case 'error':
          case 'success':
            return '已发起';
          case 'wait':
            return '未发起';
          default:
            return '';
        }
      case 'route':
        // 路由节点状态
        switch (stepStatus) {
          case 'error':
            return '已拒绝';
          case 'success':
            return '已审批';
          case 'wait':
            return '未审批';
          default:
            return '';
        }
      case 'send':
        // 抄送节点状态
        switch (stepStatus) {
          case 'error':
            return '抄送异常';
          case 'success':
            return '已抄送';
          case 'wait':
            return '未抄送';
          default:
            return '';
        }
      case 'process':
        // 审批节点状态
        switch (stepStatus) {
          case 'error':
            return '已拒绝';
          case 'success':
            return '已审批';
          case 'wait':
            return '未审批';
          default:
            return '';
        }
      default:
        return '';
    }
  };

  // 审批人
  const auditUsers = (users, step, stepsStatus) => {

    const auditType = step.auditType;
    const logResult = step.logResult || {};
    return users.map((items, index) => {
      return <div className={style.user} key={index}>
        <div className={style.nameAvatar}>
          <Avatar
            size={26}
            shape='square'
            key={index}
          >{items.substring(0, 1)}</Avatar>
          {items}
        </div>
        <div hidden={logResult.status === -1}>
          {nodeStatusName(auditType, stepsStatus)} · {logResult.updateTime}
        </div>
      </div>;
    });
  };

  // 审批人列表
  const rules = (step, stepsStatus) => {
    const users = [];
    const rules = ToolUtil.isObject(step.auditRule).rules || [];

    if (rules.length > 0) {
      rules.map((items) => {
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
      return <div className={style.users}>
        {auditUsers(users, step, stepsStatus)}
      </div>;
    }
  };


  // 单据动作
  const processType = (value) => {
    const style = { paddingLeft: 8 };
    switch (value) {
      case 'quality_dispatch':
        return <div style={style}>指派任务</div>;
      case 'quality_perform':
        return <div style={style}>执行任务</div>;
      case 'quality_complete':
        return <div style={style}>完成任务</div>;
      case 'purchase_complete':
        return <div style={style}>采购完成</div>;
      default:
        break;
    }
  };

  const visiable = (hidden, index) => {
    return hidden ? <CaretDownFilled
      onClick={() => {
        setHiddenStep(hiddenStep.filter(item => item !== index));
      }}
    /> : <CaretUpFilled
      onClick={() => {
        setHiddenStep([...hiddenStep, index]);
      }}
    />;
  };

  // 渲染单据节点
  const steps = (step, next, index = 0) => {
    const minHeight = 60;

    let stepStatus = 'wait';

    let iconColor = '';

    const hidden = hiddenStep.includes(index);

    switch (step.logResult && step.logResult.status) {
      case -1:
        stepStatus = 'wait';
        iconColor = style.wait;
        break;
      case 0:
        stepStatus = 'error';
        iconColor = style.error;
        break;
      case 1:
        stepStatus = 'success';
        iconColor = style.success;
        break;
      default:
        break;
    }

    switch (step.auditType) {
      case 'start':
        return <div>
          <Steps.Step
            style={{ minHeight, fontSize: '5vw' }}
            status={stepStatus}
            title={<div className={style.title}>
              <span>发起人 · {nodeStatusName(step.auditType, stepStatus)}</span>
              {visiable(hidden, index)}
            </div>}
            description={!hidden && (createName ? auditUsers([createName], step, stepStatus) : rules(step, stepStatus))}
            icon={<div className={ToolUtil.classNames(
              style.stepIcon,
              iconColor,
            )}>{status(step, stepStatus)}</div>}
          />
          {steps(step.childNode, step.logResult && step.logResult.status === 1, index + 1)}
        </div>;
      case 'route':
        return <div>
          <Steps.Step
            title={<div className={style.title}>
              <span>审批人 · {nodeStatusName(step.auditType, stepStatus)}</span>
              {visiable(hidden, index)}
            </div>}
            style={{ minHeight }}
            status={stepStatus}
            description={!hidden &&
            <div style={{ maxWidth: '100vw', overflowX: 'auto' }}>
              <Space>
                {step.conditionNodeList.map((items, index) => {
                  return allStep(items.childNode, next, index);
                })}
              </Space>
            </div>
            }
            icon={<div className={ToolUtil.classNames(
              style.stepIcon,
              iconColor,
            )}>{status(step, stepStatus)}</div>}
          />
          {steps(step.childNode, step.logResult && step.logResult.status === 1, index + 1)}
        </div>;
      case 'send':
      case 'process':
        return <div>
          <Steps.Step
            style={{ minHeight }}
            status={stepStatus}
            title={<div className={style.title}>
              <span>审批人 · {nodeStatusName(step.auditType, stepStatus)}</span>
              {visiable(hidden, index)}
            </div>}
            description={!hidden && rules(step, stepStatus)}
            icon={<div className={ToolUtil.classNames(
              style.stepIcon,
              iconColor,
            )}>{status(step, stepStatus)}</div>}
          />
          {steps(step.childNode, step.logResult && step.logResult.status === 1, index + 1)}
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
    return <></>;
  }


  return <>
    <div className={style.process}>
      <div className={style.title}>审批流程</div>
      {allStep(auditData || data, true, 0)}
    </div>
  </>;

};

export default Process;
