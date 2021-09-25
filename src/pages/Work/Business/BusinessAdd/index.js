import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker, DialogPop,
  Form,
  FormItem,
  Input,
  List,
  ListItem,
  Picker, PickerPanel,
  SubmitButton,
} from 'weui-react-v2';
import { router } from 'umi';
import { Card } from 'antd';
import './index.css';
import { Steps } from 'antd-mobile';

const Step = Steps.Step;

const BusinessAdd = () => {

  const [visiable, setVisiable] = useState();
  const [value, setValue] = useState();


  useEffect(() => {
    DialogPop({
      title: '对话框标题',
      children:
        <PickerPanel
          title='请选择'
          data={[{ label: '项目流程1', value: 1 }, { label: '项目流程2', value: 2 }]}
          onChange={(value) => {
            setValue(value[0]);
          }}>
          <ListItem arrow={true} style={{ padding: 0 }} />
        </PickerPanel>,
      onConfirm: () => {
        return new Promise((resolve) => {
          setVisiable(true);
          resolve(true);
        });
      },
      onCancel: () => {
        router.goBack();
      },
    });
  }, []);


  return (
    <>
      {visiable &&
      <>
        <Card title='项目流程'>
          <Steps size='64' current={2}>
            <Step title='第一步' />
            <Step title='第二步' />
            <Step title='第三步' />
          </Steps>
        </Card>
        <Form
          labelWidth='22vw'
          onSubmit={(value) => {
            DialogPop({
              title: '提示：如有异议请联系创建人或领导协调',
              children: '您输入的商机已经被创建 创建人：张三',
              onConfirm: () => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    router.goBack();
                    resolve(true);
                  }, 2000);
                });
              },
            });
          }}
        >
          <List title='添加项目'>
            <FormItem prop='customerName' label='项目名称'>
              <Input placeholder='请输入项目名称' autoFocus={true} />
            </FormItem>
            <FormItem prop='customerName' label='客户名称'>
              <Picker title='请选择' placeholder='请选择' data={[
                {
                  label: '客户1',
                  value: 0,
                }, {
                  label: '客户2',
                  value: 1,
                },
              ]}>
                <ListItem arrow={true} style={{ padding: 0 }} />
              </Picker>
            </FormItem>
            <FormItem prop='customerName' label='负责人'>
              <Picker title='请选择' placeholder='请选择' data={[
                {
                  label: '100',
                  value: 0,
                }, {
                  label: '101',
                  value: 1,
                },
              ]}>
                <ListItem arrow={true} style={{ padding: 0 }} />
              </Picker>
            </FormItem>
            <FormItem prop='customerName' label='机会来源'>
              <Picker title='请选择' placeholder='请选择' data={[
                {
                  label: '1',
                  value: 0,
                }, {
                  label: '2',
                  value: 1,
                }, {
                  label: '3',
                  value: 2,
                },
              ]}>
                <ListItem arrow={true} style={{ padding: 0 }} />
              </Picker>
            </FormItem>
          </List>
          <div style={{ textAlign: 'center', margin: 8 }}>
            <SubmitButton style={{ margin: 8 }}>保存</SubmitButton>
            <Button type='default' style={{ margin: 8 }} onClick={() => {
              router.goBack();
            }}>返回</Button>
          </div>
        </Form>
      </>
      }
    </>
  );
};

export default BusinessAdd;
