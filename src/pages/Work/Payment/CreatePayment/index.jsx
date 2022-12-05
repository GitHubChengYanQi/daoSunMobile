import React, { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import FormLayout from '../../../components/FormLayout';
import { Message } from '../../../components/Message';
import { ReceiptsEnums } from '../../../Receipts';
import { Input, Space, TextArea } from 'antd-mobile';
import styles from '../../Order/CreateOrder/index.less';
import MyCard from '../../../components/MyCard';
import Title from '../../../components/Title';
import { useRequest } from '../../../../util/Request';
import { paymentAdd } from '../url';
import LinkButton from '../../../components/LinkButton';
import ShopNumber from '../../AddShop/components/ShopNumber';
import { useHistory } from 'react-router-dom';
import MyCheckList from '../../../components/MyCheckList';
import { orderList } from '../../Invoice/url';

const CreatePayment = () => {

  const [data, setData] = useState({});

  const [open, setOpen] = useState();

  const { loading, run } = useRequest(paymentAdd, { manual: true });

  const file = useRef();

  const history = useHistory();

  return <>
    <MyNavBar title='创建付款信息' />
    <FormLayout
      data={data}
      loading={loading}
      onSave={async (complete) => {
        let success;
        await run({ data }).then(() => {
          success = true;
          if (complete) {
            Message.successDialog({
              content: '创建付款信息成功！',
              only: true,
              onConfirm: () => history.goBack(),
            });
          }
        }).catch(() => {
          Message.errorToast('保存失败！');
          success = false;
        });
        return success;
      }}
      formType={ReceiptsEnums.payment}
      fieldRender={(item) => {
        const required = item.required;
        let extra;
        let content;
        switch (item.key) {
          case 'paymentAmount':
            extra = <Space align='center'>
              <ShopNumber
                number
                decimal={2}
                min={0}
                value={data[item.key]}
                getContainer={document.body}
                onChange={(value) => setData({
                  ...data,
                  [item.key]: value,
                })}
              />人民币
            </Space>;
            break;
          case 'remark':
            content = <TextArea placeholder={`请输入${item.filedName}`} onChange={(value) => setData({
              ...data,
              [item.key]: value,
            })} />;
            break;
          case 'orderId':
            extra = <div onClick={() => setOpen(true)}>
              {data[item.key] ? data.orderName : <LinkButton title={`请选择${item.filedName || ''}`} />}
            </div>;
            break;
          default:
            extra = <Input
              value={data[item.key]}
              className={styles.input}
              placeholder={`请输入${item.filedName}`}
              onChange={(value) => setData({ ...data, [item.key]: value })}
            />;
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

    <MyCheckList
      searchPlaceholder='请输入订单信息'
      api={orderList}
      searchLabel='coding'
      label='coding'
      listKey='orderId'
      onClose={() => setOpen(false)}
      onChange={(order = {}) => {
        setData({ ...data, orderId: order.orderId, orderName: order.coding });
      }}
      value={[{ orderId: data.orderId, coding: data.orderName }]}
      visible={open}
      title='选择订单'
    />
  </>;
};

export default CreatePayment;
