import React, { useState } from 'react';
import { Steps } from 'antd-mobile';
import { Step } from 'antd-mobile/es/components/steps/step';
import { MyLoading } from '../MyLoading';
import { useRequest } from '../../../util/Request';
import styles from './index.less';
import BottomButton from '../BottomButton';
import { isArray } from '../ToolUtil';

export const formList = {
  url: '/formStyle/list',
  method: 'POST',
};


const FormLayout = (
  {
    loading,
    data = {},
    formType,
    fieldRender = () => {
      return <></>;
    },
    onSave = () => {
    },
    required = () => {
      return true;
    },
  },
) => {

  const [currentStep, setCurrentStep] = useState(0);

  const [steps, setSteps] = useState([]);

  const [requiredFiled, setRequiredFiled] = useState([]);

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
    const requireds = requiredFiled.filter(item => typeof data[item] !== 'number' && !data[item] && fieldRender({ key: item }) !== false);
    return requireds.length !== 0;
  };

  const { loading: detailLoaidng } = useRequest({
    ...formList,
    data: { formType },
  }, {
    onSuccess: (res) => {
      if (res[0]?.typeSetting) {
        const typeSetting = JSON.parse(res[0].typeSetting) || {};
        const mobile = typeSetting.mobile || {};
        const newSteps = mobile.steps || [];
        setSteps(newSteps);
        getRequireFiled(newSteps[0]?.data);
      }
    },
  });

  if (detailLoaidng) {
    return <MyLoading skeleton />;
  }

  return <>
    <div hidden={steps.length === 1} className={styles.formSteps}>
      <Steps current={currentStep} className={styles.steps}>
        {
          steps.map((item, index) => {
            return <Step
              key={index}
              title={<div onClick={() => {
                if (index >= currentStep) {
                  return;
                }
                getRequireFiled(steps[index]?.data);
                setCurrentStep(index);
              }}>{item.title || `步骤${index + 1}`}</div>}
            />;
          })
        }
      </Steps>
    </div>

    <div style={{ marginBottom: 68 }}>
      {
        steps.map((setpItem, setpIndex) => {
          const data = setpItem.data || [];
          const hidden = currentStep !== setpIndex;
          return <div hidden={hidden} key={setpIndex}>
            {
              data.map((rows = [], rowIndex) => {
                return rows.map((columnItem, columnIndex) => {
                  const data = columnItem.data || [];
                  return <div key={columnIndex}>
                    {data.map((item, index) => {
                      return <div key={index}>{fieldRender({
                        ...item,
                        required: hidden ? false : item.required,
                      })}</div>;
                    })}
                  </div>;
                });
              })
            }
          </div>;
        })
      }
    </div>

    <BottomButton
      leftText='上一步'
      leftDisabled={currentStep === 0}
      leftOnClick={() => {
        getRequireFiled(steps[currentStep - 1]?.data);
        setCurrentStep(currentStep - 1);
      }}
      rightLoading={loading}
      rightDisabled={disabled()}
      rightText={currentStep < steps.length - 1 ? '下一步' : '保存'}
      rightOnClick={async () => {
        const currentFiled = [];
        isArray(steps[currentStep]?.data).map((item) => {
          item.map(item => {
            const data = item.data || [];
            data.forEach(item => {
              currentFiled.push(item.key);
            });
          });
        });
        if (!required(currentFiled)) {
          return;
        }
        if (currentStep === steps.length - 1) {
          onSave(true);
        } else if (steps[currentStep].type === 'add') {
          if (await onSave(false)) {
            getRequireFiled(steps[currentStep + 1]?.data);
            setCurrentStep(currentStep + 1);
          }
        } else {
          getRequireFiled(steps[currentStep + 1]?.data);
          setCurrentStep(currentStep + 1);
        }
      }}
    />
  </>;
};

export default FormLayout;
