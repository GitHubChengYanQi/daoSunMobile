import React, { useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import { Input, TextArea } from 'antd-mobile';
import StartEndDate from './components/StartEndDate';
import { useRequest } from '../../../../util/Request';
import { Message } from '../../../components/Message';
import FormLayout from '../../../components/FormLayout';
import { ReceiptsEnums } from '../../../Receipts';
import styles from '../../PurchaseAsk/index.less';
import User from '../../CreateTask/components/User';
import ShopNumber from '../../AddShop/components/ShopNumber';
import MyCard from '../../../components/MyCard';
import Title from '../../../components/Title';

const CreateTask = (props) => {

  const params = props.location.query;

  const { loading, run } = useRequest({ url: '/productionTask/add', method: 'POST' }, { manual: true });

  const [data, setData] = useState({ shipName: params.shipName });

  return <>
    <MyNavBar title='创建生产任务' />
    <FormLayout
      data={data}
      loading={loading}
      onSave={async (complete) => {
        let success;
        await run({
          data: {
            workOrderId: params.id,
            ...data,
            productionTime: data.date && data.date[0],
            endTime: data.date && data.date[1],
            userId: data.userId,
            userIdList: data.userIdList && data.userIdList.map((item) => {
              return item.id;
            }),
          },
        }).then(() => {
          success = true;
          if (complete) {
            Message.dialogSuccess({
              title: '分派任务成功!',
              leftText: '返回工单',
              rightText: '继续分派任务',
            });
          }
        }).catch(() => {
          Message.errorToast('保存失败！');
          success = false;
        });
        return success;
      }}
      formType={ReceiptsEnums.productionTask}
      fieldRender={(item) => {
        const required = item.required;
        let extra;
        let content;
        switch (item.key) {
          case 'coding':
            extra = <Input
              value={data[item.key]}
              className={styles.input}
              placeholder='请输入编码'
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'shipName':
            extra = data[item.key];
            break;
          case 'date':
            extra = <StartEndDate
              min={new Date()}
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'userId':
            return <User
              noRequired={!required}
              value={data.userId ? [{
                id: data.userId,
                name: data.userName,
                avatar: data.avatar,
              }] : []}
              onChange={(users) => {
                const { id, name, avatar } = users[0] || {};
                setData({ ...data, userId: id, userName: name, avatar });
              }}
              title={item.filedName}
            />;
          case 'remake':
            content = <TextArea
              rows={3}
              autoSize
              style={{ '--font-size': '14px' }}
              placeholder='请输入备注'
              value={data[item.key]}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          case 'userIdList':
            return <User
              noRequired={!required}
              multiple
              title={item.filedName}
              value={data[item.key]}
              onChange={(userIdList) => {
                setData({ ...data, [item.key]: userIdList });
              }}
            />;
          case 'number':
            extra = <ShopNumber
              value={data[item.key] || 0}
              max={params.max}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
            break;
          default:
            break;
        }
        return <MyCard
          titleBom={required && <Title className={styles.title}>{item.filedName}<span>*</span></Title>}
          title={item.filedName}
          extra={extra}
        >
          {content}
        </MyCard>;
      }}
    />
  </>;
};
export default CreateTask;
