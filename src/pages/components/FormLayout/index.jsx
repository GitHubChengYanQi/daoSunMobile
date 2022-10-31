import React, { useState } from 'react';
import { Steps } from 'antd-mobile';
import { Step } from 'antd-mobile/es/components/steps/step';
import { MyLoading } from '../MyLoading';
import { useRequest } from '../../../util/Request';
import styles from './index.less';

export const formList = {
  url: '/formStyle/list',
  method: 'POST',
};


const FormLayout = (
  {
    value,
    onChange = () => {
    },
    formType,
    fieldRender = () => {
      return <></>;
    },
  },
) => {

  const [layout, setLayout] = useState({});
  const [steps, setSteps] = useState([]);

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
        setLayout({ width: mobile.width, gutter: mobile.gutter, widthUnit: mobile.widthUnit });
        onChange({ step: 0, type: newSteps[0].type, steps: newSteps });
      }
    },
  });

  if (detailLoaidng) {
    return <MyLoading skeleton />;
  }

  return <>
    <div hidden={steps.length === 1} className={styles.formSteps}>
      <Steps current={value} className={styles.steps}>
        {
          steps.map((item, index) => {
            return <Step
              key={index}
              title={item.title || `步骤${index + 1}`}
            />;
          })
        }
      </Steps>
    </div>
    {
      steps.map((setpItem, setpIndex) => {
        const data = setpItem.data || [];
        const hidden = value !== setpIndex;
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
  </>;
};

export default FormLayout;
