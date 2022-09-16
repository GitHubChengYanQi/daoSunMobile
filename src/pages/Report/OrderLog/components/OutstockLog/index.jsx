import React from 'react';
import MyCard from '../../../../components/MyCard';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import { UserName } from '../../../../components/User';
import SkuItem from '../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import styles from '../../index.less';
import { ToolUtil } from '../../../../components/ToolUtil';

export const outstockLog = { url: '/outstockOrder/detail', method: 'GET' };

const OutstockLog = ({ outstockOrderId }) => {

  const { loading, data = {} } = useRequest({ ...outstockLog, params: { outStockOrderId: outstockOrderId } });

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!data) {
    return <MyEmpty />;
  }

  const listing = data.listing || [];

  return <>
    <MyCard title='出库明细' bodyStyle={{padding:0}}>
      {
        listing.map((item, index) => {
          const sku = item.listingResult || {};
          const skuResult = sku.skuResult || {};
          const positionsResults = item.positionsResults || [];
          return <div key={index} className={styles.sku}>
            <SkuItem
              skuResult={{ ...skuResult, spuResult: sku.spuResult }}
              className={styles.skuItem}
              extraWidth='90px'
              otherData={[
                positionsResults.map(item => ToolUtil.isObject(item.brandResult).brandName).filter(item => item).join('、'),
                positionsResults.map(item => item.name).join('、'),
              ]}
            />
            <ShopNumber show value={sku.number} />
          </div>;
        })
      }
    </MyCard>

    <MyCard title='执行人' extra={<UserName user={data.createUserResult} />} />

    <MyCard title='领料人' extra={<UserName user={data.userResult} />} />

    <MyCard title='仓库' extra={ToolUtil.isObject(data.storehouseResult).name} />

    <MyCard title='来源' extra='无' />

    <MyCard title='审批人'>

    </MyCard>
  </>;
};

export default OutstockLog;
