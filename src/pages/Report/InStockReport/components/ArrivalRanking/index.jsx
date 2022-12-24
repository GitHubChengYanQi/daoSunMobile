import React, { useEffect, useState } from 'react';
import styles from '../../index.less';
import Icon from '../../../../components/Icon';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../components/ToolUtil';
import { instockDetailByCustomer } from '../../../components/Ranking';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';

const ArrivalRanking = () => {

  const [list, setList] = useState([]);

  const {
    loading: instockDetailByCustomerLoading,
    run: instockDetailByCustomerRun,
  } = useRequest(instockDetailByCustomer, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res));
    },
  });

  const searchTypes = [
    { text: '种类排行', type: 'SKU_COUNT' },
    { text: '件数排行', type: 'NUM_COUNT' },
  ];
  const [type, setType] = useState(searchTypes[0].type);

  useEffect(() => {
    instockDetailByCustomerRun({
      data: {
        searchType: type,
        // beginTime: date[0],
        // endTime: date[1]
      },
    });
  }, [type]);

  return <>
    <div className={styles.rankingHeader}>
      <div className={styles.rankingTitle}>
        <Icon type='icon-rukuzongshu' />
        到货量排行
      </div>
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
      instockDetailByCustomerLoading ? <MyLoading skeleton /> : list.map((item, index) => {
        if (index > 2) {
          return;
        }
        return <div key={index} className={styles.rankingContent}>
          <div className={styles.rankingContentLabel}>{index + 1}&nbsp;&nbsp;{item.customerName || '无供应商'}</div>
          {`${item.inSkuCount || item.outSkuCount || 0} 类 ${item.inNumCount || item.outNumCount || 0} 件`}
        </div>;
      })
    }
  </>;
};

export default ArrivalRanking;
