import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { RightOutline } from 'antd-mobile-icons';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd-mobile';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../../util/ToolUtil';
import Icon from '../../../../components/Icon';
import { outStockDetailBySpuClass } from '../../../components/Ranking';
import { MyLoading } from '../../../../components/MyLoading';

const CountTimes =()=>{

  const history = useHistory();

  const [list, setList] = useState([]);

  const types = [
    { title: '物料', key: 'SPU_CLASS' },
    { title: '人员', key: 'TYPE' }
  ];

  const [type, setType] = useState(types[0].key);

  const {
    loading: outStockDetailBySpuClassLoading,
    run: outStockDetailBySpuClassRun,
  } = useRequest(outStockDetailBySpuClass, {
    manual: true,
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.inNumCount || 0) - (a.inNumCount || 0)));
    },
  });

  useEffect(() => {
    outStockDetailBySpuClassRun({ data: { searchType: type } });
  }, [type]);

  return <>
    <div className={styles.rankingHeader}>
      <div className={styles.rankingTitle}>
        <Icon type='icon-rukuzongshu' />
        盘点次数排行
      </div>
      <div style={{ paddingBottom: 12 }} onClick={() => history.push({
        pathname: '/Report/ReportDetail',
        search: 'type=CountTimesDetails',
      })}>
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
    {
      outStockDetailBySpuClassLoading ? <MyLoading skeleton /> : list.map((item, index) => {
        if (index > 2) {
          return;
        }
        let leftText = '';
        let rightText = '';
        switch (type) {
          case 'SPU_CLASS':
            leftText = '黑色内扣冷却管/lqg-700/ 1/2*700mm黑色内螺纹';
            rightText = `66次`;
            break;
          case 'TYPE':
            leftText = '张三（库房管理部-库房保管员）';
            rightText = `66次`;
            break;
          default:
            break;
        }
        return <div key={index} className={styles.rankingContent}>
          <div className={styles.rankingContentLabel}>{index + 1}&nbsp;&nbsp;{leftText}</div>
          {rightText}
        </div>;
      })
    }
  </>;
};

export default CountTimes;
