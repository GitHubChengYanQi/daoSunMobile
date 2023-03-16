import React, { useState } from 'react';
import { orderDetail } from '../Url';
import { useRequest } from '../../../../util/Request';
import { ProgressBar, Space, Tabs } from 'antd-mobile';
import MyEmpty from '../../../components/MyEmpty';
import BottomButton from '../../../components/BottomButton';
import { MyLoading } from '../../../components/MyLoading';
import MyNavBar from '../../../components/MyNavBar';
import Label from '../../../components/Label';
import styles from '../index.less';
import Skus from './components/Skus';
import Pays from './components/Pays';
import MyCard from '../../../components/MyCard';
import MyEllipsis from '../../../components/MyEllipsis';
import { useHistory } from 'react-router-dom';
import { isArray } from '../../../../util/ToolUtil';
import MySpace from '../../../components/MySpace';

const Detail = (props) => {

  const { id } = props.location.query;

  const history = useHistory();

  const [key, setKey] = useState('skus');

  const { loading, data } = useRequest(orderDetail, {
    defaultParams: {
      data: {
        orderId: id,
      },
    },
  });

  if (loading) {
    return <MyLoading />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  let inStock = 0;
  let totalPrice = 0;

  isArray(data.detailResults).forEach(item => {
    totalPrice += item.purchaseNumber;
    inStock += item.inStockNumber;
  });

  const module = () => {
    switch (key) {
      case 'skus':
        return <Skus skus={data.detailResults} data={data} />;
      case 'pay':
        return <Pays pays={data.paymentResult && data.paymentResult.detailResults} payment={data.paymentResult} />;
      default:
        return <MyEmpty />;
    }
  };

  let infoData = {};

  switch (data.type) {
    case 1:
      infoData = {
        title: '采购单详情',
        buttonText: '确认到货',
        disabled: isArray(data.detailResults).length === 0,
      };
      break;
    case 2:
      infoData = {
        title: '销售单详情',
        buttonText: '创建出库计划',
        disabled: isArray(data.detailResults).length === 0 || !data.contractId,
      };
      break;
  }

  return <>
    <MyNavBar title={infoData.title} />

    <MyCard title='基本信息'>
      <Space direction='vertical' style={{width:'100%'}}>
        <div>
          <Label className={styles.label}>采购单号</Label>：{data.coding}
        </div>
        <div>
          <Label className={styles.label}>采购主题</Label>：{data.theme}
        </div>
        <div className={styles.ProgressBar}>
          <Label className={styles.label}>入库进度</Label>：
          <div className={styles.percent}>
            <ProgressBar percent={Math.round((inStock / totalPrice) * 100) || 0} text />
          </div>
        </div>
        <div>
          <Label className={styles.label}>币种</Label>：{data.currency}
        </div>
        <div>
          <Label className={styles.label}>采购时间</Label>：{data.createTime}
        </div>
        <div>
          <Label className={styles.label}>创建时间</Label>：{data.createTime}
        </div>
      </Space>
    </MyCard>
    <MyCard title='甲方信息'>
      <Space direction='vertical'>
        <div>
          <Label className={styles.label}>公司</Label>：{data.acustomer?.customerName || '无'}
        </div>
        <MySpace>
          <div><Label className={styles.label}>地址</Label>：</div>
          <MyEllipsis
            width='calc(100vw - 135px)'>{data.aadress?.detailLocation || data.aadress?.location || '无'}</MyEllipsis>
        </MySpace>
        <div>
          <Label className={styles.label}>联系人</Label>：{data.acontacts?.contactsName || '无'}
        </div>
        <div>
          <Label className={styles.label}>电话</Label>：{data.aphone?.phoneNumber || '无'}
        </div>
      </Space>
    </MyCard>
    <MyCard title='乙方信息'>
      <Space direction='vertical'>
        <div>
          <Label className={styles.label}>公司</Label>：{data.bcustomer?.customerName || '无'}
        </div>
        <MySpace>
          <div><Label className={styles.label}>地址</Label>：</div>
          <MyEllipsis
            width='calc(100vw - 135px)'>{data.badress?.detailLocation || data.badress?.location || '无'}</MyEllipsis>
        </MySpace>
        <div>
          <Label className={styles.label}>联系人</Label>：{data.bcontacts?.contactsName || '无'}
        </div>
        <div>
          <Label className={styles.label}>电话</Label>：{data.bphone?.phoneNumber || '无'}
        </div>
      </Space>
    </MyCard>

    <Tabs
      activeKey={key}
      style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}
      onChange={(key) => {
        setKey(key);
      }}
    >
      <Tabs.Tab title='物料信息' key='skus' />
      <Tabs.Tab title='付款信息' key='pay' />
    </Tabs>

    {module()}

    <div style={{ height: 62 }} />

    <BottomButton
      only
      text={infoData.buttonText}
      disabled={infoData.disabled}
      onClick={() => {
        switch (data.type) {
          case 1:
            history.replace({
              pathname: '/Work/Order/ConfirmArrival',
              search: `id=${id}`,
              state: {
                customerId: data.bcustomer?.customerId,
                customerName: data.bcustomer?.customerName,
                skus: data.detailResults,
              },
            });
            break;
          case 2:
            history.push({
              pathname: '/Work/Production/CreatePlan',
              search: 'detail',
              state: {
                contracts: [
                  {
                    coding: data.contract?.coding,
                    details: isArray(data.detailResults).map(item => ({
                      ...(item.skuResult || {}),
                      purchaseNumber: item.purchaseNumber,
                    })),
                  },
                  {},
                ],
              },
            });
            break;
        }
      }}
    />
  </>;
};

export default Detail;
