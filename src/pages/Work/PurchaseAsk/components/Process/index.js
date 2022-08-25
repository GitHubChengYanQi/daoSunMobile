import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { Badge, Space, Steps } from 'antd-mobile';
import { Avatar } from 'antd';
import Icon from '../../../../components/Icon';
import { AuditOutlined, CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { Skeleton } from 'weui-react-v2';
import style from './index.less';
import { ToolUtil } from '../../../../components/ToolUtil';
import { CheckCircleFill, CloseCircleFill } from 'antd-mobile-icons';
import { MyDate } from '../../../../components/MyDate';
import MyCard from '../../../../components/MyCard';
import UploadFile from '../../../../components/Upload/UploadFile';

const Process = (
  {
    type,
    createUser = {},
    auditData,
    remarks = [],
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
  const status = (step) => {
    switch (step.auditType) {
      case 'start':
        return <Avatar><Icon type='icon-faqiren' /></Avatar>;
      case 'send':
        return <Avatar><Icon type='icon-caigou_chaosong' /></Avatar>;
      case 'route':
        return <AuditOutlined />;
      case 'process':
        if (step.auditRule.type === 'audit') {
          return <Avatar><Icon type='icon-shenpi3' /></Avatar>;
        } else {
          return <Avatar><Icon type='icon-caigou_dongzuo' /></Avatar>;
        }
      default:
        break;
    }
  };

  // 节点名称 + 状态
  const nodeStatusName = (auditType, stepStatus, actioning) => {
    // 节点类型
    switch (auditType) {
      case 'start':
        // 发起节点状态
        if (actioning) {
          return '发起中';
        }
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
        if (actioning) {
          return '审批中';
        }
        switch (stepStatus) {
          case 'error':
            return '已驳回';
          case 'success':
            return '已同意';
          case 'wait':
            return '未审批';
          default:
            return '';
        }
      case 'send':
        // 抄送节点状态
        if (actioning) {
          return '抄送中';
        }
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
        if (actioning) {
          return '审批中';
        }
        switch (stepStatus) {
          case 'error':
            return '已驳回';
          case 'success':
            return '已同意';
          case 'wait':
            return '未审批';
          default:
            return '';
        }
      case 'action':
        // 动作节点状态
        if (actioning) {
          return '执行中';
        }
        switch (stepStatus) {
          case 'success':
            return '已执行';
          case 'wait':
            return '未执行';
          default:
            return '';
        }
      default:
        return '';
    }
  };

  // 审批人
  const auditUsers = (users, step) => {

    let auditType = step.auditType;
    if (step.auditRule.type === 'status') {
      auditType = 'action';
    }
    const logResult = step.logResult || {};

    const logRemark = remarks.filter(item => item.logId === logResult.logId)[0];

    const imgs = (logRemark && logRemark.photoId) ? logRemark.photoId.split(',').map(item => {
      return { url: item };
    }) : [];

    return users.map((items, index) => {
      let stepsStatus;
      let content;
      if (items.auditStatus) {
        switch (logResult.status) {
          case 1:
            stepsStatus = 'success';
            content = <span className={style.auditSuccess}><CheckCircleFill /></span>;
            break;
          case 0:
            stepsStatus = 'error';
            content = <span className={style.auditError}><CloseCircleFill /></span>;
            break;
          default:
            break;
        }
      }


      return <div className={style.user} key={index}>
        <div className={style.nameAvatar}>
          <Badge
            color='#fff'
            content={content}
          >
            <Avatar
              size={26}
              shape='square'
              key={index}
              src={items.avatar}
            >{items.name.substring(0, 1)}</Avatar>
          </Badge>
          {items.name}
        </div>
        <div hidden={!stepsStatus}>
          {nodeStatusName(auditType, stepsStatus)} · {MyDate.Show(logResult.updateTime)}
          {logRemark && <div>
            {logRemark.content}
            <UploadFile imgSize={14} show files={imgs} />
          </div>}
        </div>
      </div>;
    });
  };

  // 审批人列表
  const rules = (step, status) => {
    const users = [];
    const rules = ToolUtil.isObject(step.auditRule).rules || [];

    if (rules.length > 0) {
      rules.map((items) => {
        switch (items.type) {
          case 'AppointUsers':
            items.appointUsers && items.appointUsers.map((itemuser) => {
              return users.push({
                name: itemuser.title,
                avatar: itemuser.avatar,
                auditStatus: status || itemuser.auditStatus,
              });
            });
            break;
          case 'DeptPositions':
            items.deptPositions && items.deptPositions.map((itemdept) => {
              return users.push({
                name: `${itemdept.title}(${itemdept.positions && itemdept.positions.map((items) => {
                  return items.label;
                })})`,
                auditStatus: status,
              });
            });
            break;
          case 'AllPeople':
            users.push({ name: '所有人', auditStatus: status || 99 });
            break;
          case 'MasterDocumentPromoter':
            users.push({ name: '主单据发起人', auditStatus: status });
            break;
          case 'Director':
            users.push({ name: '单据负责人', auditStatus: status });
            break;
          default:
            break;
        }
        return null;
      });
      return <div className={style.users}>
        {auditUsers(users, step)}
      </div>;
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

    let actioning = false;

    const hidden = hiddenStep.includes(index);

    switch (step.logResult && step.logResult.status) {
      case -1:
        if (next) {
          stepStatus = 'wait';
          iconColor = style.action;
          actioning = true;
          break;
        }
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
              <span>发起人 · {nodeStatusName(step.auditType, stepStatus, actioning)}</span>
              {visiable(hidden, index)}
            </div>}
            description={!hidden && (createUser.name ? auditUsers([{
              name: createUser.name,
              avatar: createUser.avatar,
              auditStatus: 99,
            }], step, stepStatus) : rules(step))}
            icon={<div className={ToolUtil.classNames(
              style.stepIcon,
              iconColor,
            )}>{status(step)}</div>}
          />
          {steps(step.childNode, step.logResult && step.logResult.status === 1, index + 1)}
        </div>;
      case 'route':
        return <div>
          <Steps.Step
            title={<div className={style.title}>
              <span>审批人 · {nodeStatusName(step.auditType, stepStatus, actioning)}</span>
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
            )}>{status(step)}</div>}
          />
          {steps(step.childNode, step.logResult && step.logResult.status === 1, index + 1)}
        </div>;
      case 'send':
      case 'process':
        let title;
        if (step.auditType === 'send') {
          title = <span>抄送人 · {nodeStatusName(step.auditType, stepStatus, actioning)}</span>;
        } else if (step.auditRule.type === 'audit') {
          title = <span>审批人 · {nodeStatusName(step.auditType, stepStatus, actioning)}</span>;
        } else {

          const actionStatuses = step.auditRule.actionStatuses || [];
          title = <span>
            {actionStatuses.map(item => item.actionName || '执行动作').join('、')} · {nodeStatusName('action', stepStatus, actioning)}
          </span>;
        }
        return <div>
          <Steps.Step
            style={{ minHeight }}
            status={stepStatus}
            title={<div className={style.title}>
              {title}
              {visiable(hidden, index)}
            </div>}
            description={!hidden && rules(step, step.auditType === 'send')}
            icon={<div className={ToolUtil.classNames(
              style.stepIcon,
              iconColor,
            )}>{status(step)}</div>}
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
    <MyCard title='审批流程'>
      {allStep(auditData || data, true, 0)}
    </MyCard>
  </>;

};

export default Process;
