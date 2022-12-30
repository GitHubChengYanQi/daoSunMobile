import React, { useState } from 'react';
import styles from './index.less';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../../util/ToolUtil';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';
import ErrorApp from './ErrorApp';
import { outstockCountViewByMonth } from '../../../OutStockReport/components/Summary';
import { MyLoading } from '../../../../components/MyLoading';


const ErrorException=()=>{

  const [detail, setDetail] = useState();

  const { loading: outStockLoading, run: outStockRun } = useRequest(outstockCountViewByMonth, {
    onSuccess: (res) => {
      setDetail({
        stocksNumber: res.map(item => ({
          'month': item.monthOfYear,
          'number': item.orderCount,
          'name': '已出库',
        })),
      });
    },
  });

  const charData = isArray(detail?.stocksNumber);
  const title = '出库汇总';
  console.log(charData);
  if (!detail) {
    if (outStockLoading) {
      return <MyLoading skeleton />;
    }
  }

  return <>
  <div className={styles.inventory}>
    <div className={styles.errorTop}>
      <div className={styles.errorTitle}>异常分析</div>
    </div>
    <div className={styles.errorCenter}>
      <ScreenButtons
        types={[
          { text: '本月', key: 'month' },
          { text: '本年', key: 'year' },
        ]}
        onChange={(value) => {
          outStockRun({ data: { beginTime: value[0], endTime: value[1], frame: 1 } });
        }} />
      <div className={styles.quantity}><div className={styles.blueBlock}></div>数量差异</div>
      <div className={styles.quantity}><div className={styles.redBlock}></div>其他异常</div>
    </div>
    <div>
      <div className={styles.unit}>件</div>
     <ErrorApp/>
    </div>
  </div>
  </>
}

export default ErrorException;
