import React, { useEffect } from 'react';
import SkuItem from '../../../../Work/Sku/SkuItem';
import style from './index.less';
import MyEmpty from '../../../../components/MyEmpty';
import { ToolUtil } from '../../../../components/ToolUtil';
import { MyDate } from '../../../../components/MyDate';
import { useRequest } from '../../../../../util/Request';
import { MyLoading } from '../../../../components/MyLoading';
import ShopNumber from '../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';

export const logList = { url: '/instockLogDetail/history', method: 'POST' };

const InStockLog = (
  {
    instockOrderId,
  },
) => {

  const { loading, data, run } = useRequest(logList, { manual: true });
  console.log(data);

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
        const error = item.type === 'error';

        const positionsResults = item.positionsResults || [];

        return <div key={index}>
          <div className={style.skuItem}>
            <div className={style.sku}>
              <div className={style.item}>
                <SkuItem
                  skuResult={item.skuResult}
                  extraWidth={error ? '90px' : '24px'}
                  otherData={`${ToolUtil.isObject(item.customer).customerName || '-'} / ${ToolUtil.isObject(item.brandResult).brandName || '-'} `}
                />
              </div>
              <div hidden={!error} className={style.errorData}>
                <span className={style.error}>异常未入库</span>
                <ShopNumber show value={item.number} />
              </div>
            </div>

            {
              !error && positionsResults.map((item, index) => {
                return <div className={style.log} key={index}>
                  <div className={style.data}>
                    <div className={style.left}>{MyDate.Show(item.createTime)}</div>
                    <div>{ToolUtil.isObject(item.user).name}</div>
                  </div>
                  <div className={style.data}>
                    <div className={style.left}>{item.name}</div>
                    <div>{item.num}个</div>
                  </div>
                </div>;
              })
            }
          </div>
        </div>;
      })
    }

  </>;
};

export default InStockLog;
