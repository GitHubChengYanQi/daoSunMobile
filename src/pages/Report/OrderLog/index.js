import React from 'react';
import { TextOutline } from 'antd-mobile-icons';
import { MyDate } from '../../components/MyDate';
import style from './index.less';
import { CloudDownloadOutlined } from '@ant-design/icons';
import MyNavBar from '../../components/MyNavBar';
import { useLocation } from 'react-router-dom';
import InstockLog from './components/InstockLog';
import { useRequest } from '../../../util/Request';
import { MyLoading } from '../../components/MyLoading';
import { message } from 'antd';

export const createWord = { url: '/instockReceipt/createWord', method: 'POST' };

const OrderLog = () => {

  const { query } = useLocation();

  const { receiptId, type, time, coding } = query;

  const { loading, run } = useRequest(createWord, {
    manual: true,
    onSuccess: () => {
      message.success('模板已发送，请注意查收');
    },
    onError: () => message.error('模板发送失败，请联系管理员'),
  });

  const typeContent = () => {
    switch (type) {
      case 'instockLog':
        return {
          title: '入库',
          content: <InstockLog receiptId={receiptId} />,
        };
      default:
        return {
          title: 'xxx',
        };
    }
  };

  return <>
    <MyNavBar title={`${typeContent().title}单`} />
    <div className={style.header}>
      <div className={style.info}>
        <TextOutline />
        <div>
          <div>{coding}</div>
          <div className={style.time}>{time}</div>
        </div>
      </div>
      <CloudDownloadOutlined onClick={() => {
        run({ data: { receiptId } });
      }} />
    </div>

    <div style={{ height: 3 }} />

    {typeContent().content}

    {loading && <MyLoading />}

    {/*<MyCard title={`${typeContent().title}明细`}>*/}

    {/*</MyCard>*/}

    {/*<MyCard title='执行人' extra={<UserName />} />*/}

    {/*<MyCard title='提交人' extra={<UserName />} />*/}

    {/*<MyCard title='领料人' extra='无' />*/}

    {/*<MyCard title='仓库' extra='无' />*/}

    {/*<MyCard title='调出仓库' extra='无' />*/}

    {/*<MyCard title='出货人' extra='无' />*/}

    {/*<MyCard title='调入仓库' extra='无' />*/}

    {/*<MyCard title='收货人' extra='无' />*/}

    {/*<MyCard title='来源' extra='无' />*/}

    {/*<MyCard title='提报时间' extra='无' />*/}

    {/*<MyCard title='审批人'>*/}

    {/*</MyCard>*/}
  </>;
};

export default OrderLog;
