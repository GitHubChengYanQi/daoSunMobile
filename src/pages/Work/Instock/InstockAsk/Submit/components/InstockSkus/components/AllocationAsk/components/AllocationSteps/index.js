import React from 'react';
import { Steps } from 'antd-mobile';
import { Step } from 'antd-mobile/es/components/steps/step';
import style from './index.less';
import { ToolUtil } from '../../../../../../../../../../components/ToolUtil';

const AllocationSteps = ({ current }) => {

  const steps = ['选择仓库', '添加物料', '提交申请'];

  return <div className={style.allocationSteps}>
    <Steps current={current} className={style.steps}>
      {
        steps.map((item, index) => {
          return <Step
            key={index}
            className={ToolUtil.classNames(style.step, current > index && style.steped)}
            title={item}
          />;
        })
      }
    </Steps>
  </div>;
};

export default AllocationSteps;
