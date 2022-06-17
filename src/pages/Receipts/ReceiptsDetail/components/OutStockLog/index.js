import React, { useState } from 'react';
import SkuItem from '../../../../Work/Sku/SkuItem';
import style from '../InStockLog/index.less';
import MyList from '../../../../components/MyList';
import MyEmpty from '../../../../components/MyEmpty';
import { ToolUtil } from '../../../../components/ToolUtil';
import { MyDate } from '../../../../components/MyDate';
import { outstockList } from '../../../../Scan/Url';

export const logList = { url: '/ourS/list', method: 'POST' };

const OutStockLog = (
  {
    outstockOrderId,
  },
) => {


  const [data, setData] = useState([]);

  if (!outstockOrderId) {
    return <MyEmpty />;
  }

  return <>

    <MyList getData={setData} data={data} api={outstockList}>

      {
        data.map((item, index) => {
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
                  <div>user</div>
                </div>
                <div className={style.data}>
                  <div className={style.left}>e-1-2-3</div>
                  <div>{item.number}个</div>
                </div>
              </div>
            </div>
          </div>;
        })
      }

    </MyList>

  </>;
};

export default OutStockLog;
