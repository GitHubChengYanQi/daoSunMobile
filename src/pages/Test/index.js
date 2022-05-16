import React from 'react';
import { FormItem, Input, Form } from '@formily/antd';
import { Field } from '@formily/react';
import { createForm, onFieldReact } from '@formily/core';
import { onFieldChange } from '@formily/core/esm/effects/onFieldEffects';

export const Phone = (props) => {
  return <Input placeholder='phone' {...props} style={{ marginBottom: 16 }} />;
};

export const Code = (props) => {
  console.log(props);
  return <Input placeholder='code' {...props} />;
};

const form = createForm({
  effects: (form) => {
    console.log(form);
    onFieldChange('phone', (field) => {
      form.setFieldState('code',(state)=>{
        state.setComponentProps({phone:field.value});
      });
    })
  },
});

const Test = () => {

  return <div style={{ padding: 16 }}>
    <Form
      form={form}
      layout='horizontal'
      feedbackLayout='terse'
    >
      <Field
        name='phone'
        title='Phone'
        required
        decorator={[FormItem]}
        component={[Phone]}
      />
      <Field
        name='code'
        title='Code'
        required
        decorator={[FormItem]}
        component={[Code]}
      />
    </Form>
  </div>;
};

export default Test;
