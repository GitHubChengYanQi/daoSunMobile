import React from 'react';
import MyCard from '../../../../components/MyCard';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import { UserName } from '../../../../components/User';
import { Divider } from 'antd-mobile';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import styles from '../../index.less';
import { ToolUtil } from '../../../../components/ToolUtil';

export const instockLog = { url: '/instockReceipt/detail', method: 'POST' };

const InstockLog = ({ receiptId }) => {

  const { loading, data = {} } = useRequest({ ...instockLog, data: { receiptId } });

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const customerMap = data.customerMap || [];

  return <>
    <MyCard title='入库明细' bodyStyle={{padding:0}}>
      {
        Object.keys(customerMap).map((key, index) => {
          const skus = customerMap[key] || [];
          return <div key={index} className={styles.customer}>
            <Divider className={styles.divider} contentPosition='left'>{key}</Divider>
            {skus.map((item, index) => {
              const position = ToolUtil.isObject(item.storehousePositionsResult);
              return <div key={index} className={styles.sku}>
                <SkuItem
                  skuResult={item.skuResult}
                  className={styles.skuItem}
                  extraWidth='90px'
                  otherData={[
                    ToolUtil.isObject(item.brandResult).brandName,
                    position.name + ' / ' + ToolUtil.isObject(position.storehouseResult).name,
                  ]}
                />
                <ShopNumber show value={item.number} />
              </div>;
            })}
          </div>;
        })
      }
    </MyCard>

    <MyCard title='执行人' extra={<UserName user={data.user} />} />

    <MyCard title='来源' extra={data.source} />

    <MyCard title='审批人'>

    </MyCard>
  </>;
};

export default InstockLog;
