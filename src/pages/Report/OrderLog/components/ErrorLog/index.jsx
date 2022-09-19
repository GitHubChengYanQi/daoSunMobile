import React, { useState } from 'react';
import MyCard from '../../../../components/MyCard';
import { UserName } from '../../../../components/User';
import { MyLoading } from '../../../../components/MyLoading';
import { useRequest } from '../../../../../util/Request';
import styles from '../../index.less';
import SkuItem from '../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../components/ToolUtil';
import ShopNumber from '../../../../Work/AddShop/components/ShopNumber';
import { Popup } from 'antd-mobile';
import SkuError
  from '../../../../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockError/components/SkuError';

export const orderDetail = { url: '/anomalyOrder/detail', method: 'POST' };

const ErrorLog = ({ orderId }) => {

    const { loading, data = {} } = useRequest({ ...orderDetail, data: { orderId } });

    const [visible, setVisible] = useState();

    if (loading) {
      return <MyLoading skeleton />;
    }

    const anomalyResults = data.anomalyResults || [];

    let errorType = '';

    switch (data.type) {
      case 'instock':
        errorType = '入库任务';
        break;
      case 'Stocktaking':
        errorType = '盘点任务';
        break;
      case 'timelyInventory':
        errorType = '即时盘点';
        break;
      default:
        break;
    }

    return <>
      <MyCard title='异常明细' bodyStyle={{ padding: '8px 0' }}>
        {
          anomalyResults.map((item, index) => {
            const positionsResult = item.positionsResult || [];
            return <div key={index} className={styles.sku} onClick={() => setVisible(item.anomalyId)}>
              <SkuItem
                noView
                skuResult={item.skuResult}
                className={styles.skuItem}
                extraWidth='90px'
                otherData={[
                  ToolUtil.isObject(item.customer).customerName,
                  ToolUtil.isObject(item.brand).brandName || '无品牌',
                  positionsResult.name + ' / ' + ToolUtil.isObject(positionsResult.storehouseResult).name,
                ]}
              />
              <ShopNumber show value={item.realNumber} />
            </div>;
          })
        }
      </MyCard>

      <MyCard title='类型' extra={errorType} />

      <MyCard title='提交人' extra={<UserName />} />

      <MyCard title='来源' extra='无' />

      <MyCard title='提报时间' extra='无' />

      <MyCard title='审批人'>

      </MyCard>

      <Popup onMaskClick={() => setVisible(false)} destroyOnClose visible={visible}>
        <SkuError
          height='90vh'
          orderComplete
          anomalyId={visible}
          onClose={() => setVisible(false)}
        />
      </Popup>
    </>;
  }
;

export default ErrorLog;
