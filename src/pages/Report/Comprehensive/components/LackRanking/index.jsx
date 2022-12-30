import React, { useEffect, useState } from 'react';
import Icon from '../../../../components/Icon';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../../util/ToolUtil';
import { instockDetailByCustomer } from '../../../components/Ranking';
import { MyLoading } from '../../../../components/MyLoading';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../../InStockReport/index.less';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';

const LackRanking = ({title}) => {

  const history = useHistory();

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
    { text: '实时缺欠数量', type: 'SKU_COUNT' },
    { text: '累计缺欠次数', type: 'NUM_COUNT' },
  ];

  const [type, setType] = useState(searchTypes[0].type);

  useEffect(() => {

  }, [type]);

  return <>
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div onClick={() => {
          history.push({
            pathname: '/Report/ReportDetail',
            search: 'type=lackSkus',
          });
        }}>
          <RightOutline />
        </div>
      </div>
      <div className={styles.rankingHeader}>
        <div className={styles.searchTypes} style={{ flexGrow: 1 }}>
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
        <div>
          共 <span className='numberBlue'>123</span> 类<span className='numberBlue'>123</span> 件
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
    </div>

  </>;
};

export default LackRanking;
