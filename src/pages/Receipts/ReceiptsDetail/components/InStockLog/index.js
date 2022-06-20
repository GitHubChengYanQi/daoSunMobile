import React, { useEffect } from 'react';
import SkuItem from '../../../../Work/Sku/SkuItem';
import style from './index.less';
import MyEmpty from '../../../../components/MyEmpty';
import { ToolUtil } from '../../../../components/ToolUtil';
import { MyDate } from '../../../../components/MyDate';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';

export const logList = { url: '/instockLogDetail/history', method: 'POST' };

const InStockLog = (
  {
    instockOrderId,
  },
) => {

  const { loading, data, run } = useRequest(logList, { manual: true });

  useEffect(() => {
    if (instockOrderId) {
      run({ data: { instockOrderId } });
    }
  }, []);

  if (loading) {
    return <MyLoading skeleton />;
  }

  if (!instockOrderId) {
    return <MyEmpty />;
  }

  return <>
    {ToolUtil.isArray(data).length === 0 && <MyEmpty />}
    {
      ToolUtil.isArray(data).map((item, index) => {
        return <div key={index}>
          <div className={style.skuItem}>
            <SkuItem
              skuResult={item.skuResult}
              extraWidth='24px'
              otherData={ToolUtil.isObject(item.customer).customerName}
            />
            <div className={style.log}>
              <div className={style.data}>
                <div className={style.left}>{MyDate.Show(item.createTime)}</div>
                <div>{ToolUtil.isObject(item.user).name}</div>
              </div>
              <div className={style.data}>
                <div className={style.left}>{ToolUtil.isObject(item.storehousePositionsResult).name}</div>
                <div>{item.number}个</div>
              </div>
            </div>
          </div>
        </div>;
      })
    }

  </>;
};

export default InStockLog;
