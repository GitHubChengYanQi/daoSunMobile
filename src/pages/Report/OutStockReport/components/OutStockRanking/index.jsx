import React, { useEffect, useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../components/ToolUtil';
import { outstockDetailByCustomer } from '../../../components/Ranking';
import { MyLoading } from '../../../../components/MyLoading';
import { RightOutline } from 'antd-mobile-icons';
import styles from '../../../InStockReport/index.less';
import ScreenButtons from '../../../InStockReport/components/ScreenButtons';
import MyEmpty from '../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';

const OutStockRanking = () => {

  const [list, setList] = useState([]);

  const history = useHistory();

  const {
    loading: outstockDetailByCustomerLoading,
    run: outstockDetailByCustomerRun,
  } = useRequest(outstockDetailByCustomer, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.outNumCount || 0) - (a.outNumCount || 0)));
    },
  });

  const searchTypes = [
    { text: '种类排行', type: 'SKU_COUNT' },
    { text: '件数排行', type: 'NUM_COUNT' },
  ];
  const [type, setType] = useState(searchTypes[0].type);

  useEffect(() => {
    outstockDetailByCustomerRun({
      data: {
        searchType: type,
        // beginTime: date[0],
        // endTime: date[1]
      },
    });
  }, [type]);

  return <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>出库用排行料</div>
        <div onClick={() => {
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=useNumber',
          });
        }}>
          共 <span className='numberBlue'>{0}</span>家
          <RightOutline />
        </div>
      </div>
      <div className={styles.rankingHeader}>
        <ScreenButtons onChange={(value) => {

        }} />
        <div className={styles.searchTypes}>
          {
            searchTypes.map((item, index) => {
              return <div
                key={index}
                onClick={() => {
                  setType(item.type);
                }}
                className={type === item.type ? styles.searchTypesChecked : ''}
              >
                {item.text}
              </div>;
            })
          }
        </div>
      </div>
      {list.length === 0 && <MyEmpty />}
      {
        outstockDetailByCustomerLoading ? <MyLoading skeleton /> : list.map((item, index) => {
          if (index > 2) {
            return;
          }
          return <div key={index} className={styles.rankingContent}>
            <div className={styles.rankingContentLabel}>{index + 1}&nbsp;&nbsp;{item.customerName || '无供应商'}</div>
            {`${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`}
          </div>;
        })
      }
    </div>
  </>;
};

export default OutStockRanking;
