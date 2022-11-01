import React, { useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import FormLayout from '../../components/FormLayout';
import { ReceiptsEnums } from '../../Receipts';
import MyCard from '../../components/MyCard';
import { Input } from 'antd-mobile';
import BottomButton from '../../components/BottomButton';
import { isArray } from '../../components/ToolUtil';
import styles from './index.less';
import Title from '../../components/Title';

const PurchaseAsk = () => {

  const [currentStep, setCurrentStep] = useState({});

  const [requiredFiled, setRequiredFiled] = useState([]);

  const [data, setData] = useState({});

  const getRequireFiled = (data = []) => {
    const requiredFiled = [];
    isArray(data).map((item) => {
      item.map(item => {
        const data = item.data || [];
        data.forEach(item => {
          if (item.required) {
            requiredFiled.push(item.key);
          }
        });
      });
    });
    setRequiredFiled(requiredFiled);
  };

  const disabled = () => {
    const requireds = requiredFiled.filter(item => !data[item]);
    return requireds.length !== 0;
  };

  return <>
    <MyNavBar title='采购申请' />
    <FormLayout
      value={currentStep.step}
      onChange={(currentStep) => {
        getRequireFiled(currentStep.steps && currentStep.steps[currentStep.step]?.data);
        setCurrentStep(currentStep);
      }}
      formType={ReceiptsEnums.purchaseOrder}
      fieldRender={(item) => {
        const required = item.required;
        return <MyCard
          titleBom={required && <Title className={styles.title}>{item.filedName}<span>*</span></Title>}
          title={item.filedName}
          extra={<Input
            className={styles.input}
            placeholder='请输入'
            onChange={(value) => {
              setData({ ...data, [item.key]: value });
            }}
          />}
        />;
      }}
    />

    <BottomButton
      only
      disabled={disabled()}
      text={currentStep.step < isArray(currentStep.steps).length - 1 ? '下一步' : '保存'}
      onClick={() => {
        getRequireFiled(currentStep.steps && currentStep.steps[currentStep.step]?.data);
        setCurrentStep({ ...currentStep, step: currentStep.step + 1 });
      }}
    />
  </>;
};

export default PurchaseAsk;
