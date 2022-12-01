import React, { useRef, useState } from 'react';
import MyNavBar from '../../components/MyNavBar';
import MyList from '../../components/MyList';
import MyCard from '../../components/MyCard';
import styles from '../Production/index.less';
import { MyDate } from '../../components/MyDate';
import Label from '../../components/Label';
import { paymentList, paymentObsolete } from './url';
import { AddOutline } from 'antd-mobile-icons';
import MyFloatingBubble from '../../components/FloatingBubble';
import { useHistory } from 'react-router-dom';
import { ToolUtil } from '../../components/ToolUtil';
import { SwipeAction } from 'antd-mobile';
import { Message } from '../../components/Message';
import { MyLoading } from '../../components/MyLoading';
import { useRequest } from '../../../util/Request';

const Payment = () => {

  const [data, setData] = useState([]);

  const history = useHistory();

  const ref = useRef();

  const { loading, run } = useRequest(paymentObsolete, {
    manual: true,
    onSuccess: () => {
      Message.successToast('作废成功');
      ref.current?.submit();
    },
    onError: () => {

    },
  });


  return <>
    <MyNavBar title='付款管理' />
    <MyList
      ref={ref}
      api={paymentList}
      data={data}
      getData={(value) => {
        setData(value.filter(item => item));
      }}>
      {
        data.map((item, index) => {
          return <SwipeAction
            key={index}
            style={{
              '--background': 'transparent',
            }}
            rightActions={item.status === 50 ? [] : [{ key: 'delete', text: '作废', color: 'danger' }]}
            onAction={() => {
              Message.warningDialog({
                content: '是否确认作废？',
                onConfirm: () => {
                  return run({ data: { recordId: item.recordId } });
                },
                only: false,
              });
            }}
          >
            <MyCard
              key={index}
              titleBom={'关联订单：' + item.coding}
              className={styles.item}
              headerClassName={styles.headerClassName}
              bodyClassName={styles.bodyClassName}
              extraClassName={styles.extra}
              extra={MyDate.Show(item.createTime)}
              onClick={()=>{
                history.push({ pathname: '/Work/Payment/PaymentDetail', search: `recordId=${item.recordId}` });
              }}
            >
              <div>
                <Label className={styles.label}>金额</Label>：{item.paymentAmount} 人民币
              </div>
              <div>
                <Label className={styles.label}>备注</Label>：{item.remark}
              </div>

              {item.status === 50 && <div className={ToolUtil.classNames(styles.logo, styles.errLogo)}>
                <span>已作废</span>
              </div>}
            </MyCard>
          </SwipeAction>;
        })
      }
    </MyList>

    <MyFloatingBubble>
      <AddOutline style={{ color: 'var(--adm-color-primary)' }} onClick={() => {
        history.push('/Work/Payment/CreatePayment');
      }} />
    </MyFloatingBubble>

    {loading && <MyLoading />}
  </>;
};

export default Payment;
