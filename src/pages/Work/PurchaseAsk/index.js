import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import FormLayout from '../../components/FormLayout';
import { ReceiptsEnums } from '../../Receipts';
import MyCard from '../../components/MyCard';
import { Input } from 'antd-mobile';
import BottomButton from '../../components/BottomButton';
import { isArray } from '../../components/ToolUtil';
import styles from './index.less';

const PurchaseAsk = () => {

  const [currentStep, setCurrentStep] = useState({});

  return <>
    <MyNavBar title='采购申请' />
    <FormLayout
      value={currentStep.step}
      onChange={setCurrentStep}
      formType={ReceiptsEnums.purchaseOrder}
      fieldRender={(item) => {
        return <MyCard
          title={item.filedName}
          extra={<Input className={styles.input} placeholder='请输入' />}
        />;
      }}
    />

    <BottomButton
      only
      text={currentStep.step < isArray(currentStep.steps).length - 1 ? '下一步' : '保存'}
      onClick={() => {
        setCurrentStep({ ...currentStep, step: currentStep.step + 1 });
      }}
    />
  </>;
};

export default PurchaseAsk;
