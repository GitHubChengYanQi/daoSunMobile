import React, { useEffect, useState } from 'react';
import { isArray } from '../../../../../util/ToolUtil';
import { Button } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { useRequest } from '../../../../../util/Request';
import { instockDetailBySpuClass } from '../../../components/Ranking';
import { MyLoading } from '../../../../components/MyLoading';
import { getInType } from '../../../../Work/CreateTask/components/InstockAsk';
import { getOutType } from '../../../../Work/CreateTask/components/OutstockAsk';
import MyEmpty from '../../../../components/MyEmpty';
import styles from '../../../InStockReport/index.less';

const StoreAllocation = ({ title }) => {

  const history = useHistory();

  const [list, setList] = useState([]);

  const types = [
    { title: '调入', key: 'SPU_CLASS' },
    { title: '调出', key: 'TYPE' },
  ];

  const [type, setType] = useState(types[0].key);

  const {
    loading: instockDetailBySpuClassLoading,
    run: instockDetailBySpuClassRun,
  } = useRequest(instockDetailBySpuClass, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.inNumCount || 0) - (a.inNumCount || 0)));
    },
  });

  useEffect(() => {
    instockDetailBySpuClassRun({ data: { searchType: type } });
  }, [type]);

  return <>
    <div className={styles.rankingHeader}>
      <div className={styles.rankingTitle} style={{ fontSize: 16 }}>
        {title}
      </div>
      <div style={{ paddingBottom: 12 }} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=inStockNumber',
      })}>
        共 <span className='numberBlue'>{0}</span>次
        <RightOutline />
      </div>
    </div>
    <div className={styles.rankingScreen}>
      排行方式
      {
        types.map((item, index) => {
          return <Button
            key={index}
            color='primary'
            fill={type === item.key ? '' : 'outline'}
            onClick={() => setType(item.key)}
          >
            {item.title}
          </Button>;
        })
      }
    </div>
    {list.length === 0 && <MyEmpty />}
    {
      instockDetailBySpuClassLoading ? <MyLoading skeleton /> : list.map((item, index) => {
        if (index > 2) {
          return;
        }
        const leftText = item.storehouseName || '无仓库';
        const rightText = `${0} 次`;
        return <div key={index} className={styles.rankingContent}>
          <div className={styles.rankingContentLabel}>{index + 1}&nbsp;&nbsp;{leftText}</div>
          {rightText}
        </div>;
      })
    }
  </>;
};

export default StoreAllocation;
