import React from 'react';
import MyEmpty from '../../../../../components/MyEmpty';
import { Card, Space } from 'antd-mobile';
import Label from '../../../../../components/Label';
import styles from './index.less';
import { isArray } from '../../../../../components/ToolUtil';

const Pays = ({ pays, payment }) => {

  if (isArray(pays).length === 0 || !payment) {
    return <MyEmpty />;
  }

  const dateWay = (value) => {
    switch (value) {
      case 0:
        return '天';
      case 1:
        return '月';
      case 2:
        return '年';
      default:
        return '';
    }
  };

  const payType = (value) => {
    switch (value) {
      case 0:
        return '订单创建后';
      case 1:
        return '合同签订后';
      case 2:
        return '订单发货前';
      case 3:
        return '订单发货后';
      case 4:
        return '入库后';
      default:
        return '';
    }
  };

  return <>
    {
      pays.map((item, index) => {
        return <Card
          key={index}
          title={<div>第{index+1}批</div>}
          style={{ margin: 8 }}>
          <Space direction='vertical'>
            {
              payment.payPlan === 2
                ?
                <Space direction='vertical'>
                  <div>
                    <Label className={styles.label}>日期</Label>：{item.payTime}
                  </div>
                </Space>
                :
                <Space direction='vertical'>
                  <div>
                    <Label className={styles.label}>付款类型</Label>：{payType(item.payType)}
                  </div>
                  <div>
                    <Label className={styles.label}>日期</Label>：{item.dateNumber}{dateWay(item.dateWay)}
                  </div>
                </Space>
            }
            <div>
              <Label className={styles.label}>百分比</Label>：{item.percentum}%
            </div>
            <div>
              <Label className={styles.label}>付款金额</Label>：{item.money}
            </div>
          </Space>
        </Card>;
      })
    }
  </>;
};

export default Pays;
